package com.miru.plus.app;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Build;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.OutputStream;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

/** 闪退记录：崩溃时把错误堆栈发到 https://miru.plus/api/events（事件名 android_crash）。
 *  2026-11-27：一打开就崩的情况下，「下次打开再补传」永远传不出去（每次都在发送前又崩了），
 *  所以改成崩溃当下就发（单独线程，最多等 3 秒），同时也存一份到本机，下次打开再补传一次。
 *  每次启动还会发一条 android_boot（版本、系统、机型），用来确认用户手上到底是哪个版本。
 *  只记录错误信息、App 版本、系统版本和机型，不含任何用户内容。 */
final class CrashLog {
    private CrashLog() {}
    private static final String PREF = "miru_crash";

    static void install(Context ctx) { install(ctx, ctx); }

    static void install(Context ctx, Context base) {
        Context ac = null; try { ac = ctx.getApplicationContext(); } catch (Throwable ignore) {}
        final Context app = ac != null ? ac : base;
        final Thread.UncaughtExceptionHandler prev = Thread.getDefaultUncaughtExceptionHandler();
        Thread.setDefaultUncaughtExceptionHandler((t, e) -> {
            try {
                StringWriter sw = new StringWriter();
                e.printStackTrace(new PrintWriter(sw));
                String s = sw.toString();
                if (s.length() > 1800) s = s.substring(0, 1800);
                final long at = System.currentTimeMillis();
                try {
                    app.getSharedPreferences(PREF, Context.MODE_PRIVATE).edit()
                            .putString("trace", s).putString("thread", t.getName()).putLong("at", at).commit();
                } catch (Throwable ignore) {}
                final String trace = s, thread = t.getName();
                Thread sender = new Thread(() -> { if (post("android_crash", props(trace, thread, at))) { try { app.getSharedPreferences(PREF, Context.MODE_PRIVATE).edit().clear().commit(); } catch (Throwable ignore) {} } }, "miru-crash-now");
                sender.start();
                sender.join(3000);
            } catch (Throwable ignore) {}
            if (prev != null) prev.uncaughtException(t, e);
        });
        new Thread(() -> {
            try {
                SharedPreferences sp = app.getSharedPreferences(PREF, Context.MODE_PRIVATE);
                String trace = sp.getString("trace", null);
                if (trace != null && post("android_crash", props(trace, sp.getString("thread", ""), sp.getLong("at", 0)))) sp.edit().clear().apply();
                post("android_boot", props(null, null, System.currentTimeMillis()));
            } catch (Throwable ignore) {}
        }, "miru-crash-flush").start();
    }

    /** 2026-11-28：每次打开记一下用的哪种壳（twa / webview）和接手的浏览器包名，排查「顶部进度条」这类只在某些手机上出现的问题。 */
    static void shell(String mode, String provider, int launchMode) {
        new Thread(() -> {
            try {
                JSONObject p = props(null, null, 0);
                p.put("shell", mode);
                p.put("provider", provider == null ? "" : provider);
                p.put("launchMode", launchMode);
                post("android_shell", p);
            } catch (Throwable ignore) {}
        }, "miru-shell-log").start();
    }

    private static JSONObject props(String trace, String thread, long at) {
        JSONObject p = new JSONObject();
        try {
            if (trace != null) { p.put("trace", trace); p.put("thread", thread); p.put("crashAt", at); }
            p.put("ver", BuildConfig.VERSION_NAME);
            p.put("sdk", Build.VERSION.SDK_INT);
            p.put("model", Build.MANUFACTURER + " " + Build.MODEL);
        } catch (Throwable ignore) {}
        return p;
    }

    private static boolean post(String name, JSONObject props) {
        HttpURLConnection c = null;
        try {
            JSONObject ev = new JSONObject();
            ev.put("name", name);
            ev.put("props", props);
            JSONObject body = new JSONObject();
            body.put("events", new JSONArray().put(ev));
            c = (HttpURLConnection) new URL("https://miru.plus/api/events").openConnection();
            c.setConnectTimeout(2500);
            c.setReadTimeout(2500);
            c.setRequestMethod("POST");
            c.setDoOutput(true);
            c.setRequestProperty("Content-Type", "application/json");
            try (OutputStream os = c.getOutputStream()) { os.write(body.toString().getBytes(StandardCharsets.UTF_8)); }
            int code = c.getResponseCode();
            return code >= 200 && code < 300;
        } catch (Throwable ignore) {
            return false;
        } finally {
            if (c != null) c.disconnect();
        }
    }
}
