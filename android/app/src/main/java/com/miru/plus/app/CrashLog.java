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

/** 闪退记录：崩溃时把错误堆栈存到本机；下次打开 App 时在后台发到 https://miru.plus/api/events（事件名 android_crash），发成功就删掉。
 *  只记录错误信息、App 版本、系统版本和机型，不含任何用户内容。 */
final class CrashLog {
    private CrashLog() {}
    private static final String PREF = "miru_crash";

    static void install(Context ctx) { install(ctx, ctx); }

    /** base：attachBaseContext 时 getApplicationContext() 还是 null，用传进来的 base 读写本机记录 */
    static void install(Context ctx, Context base) {
        Context ac = null; try { ac = ctx.getApplicationContext(); } catch (Throwable ignore) {}
        final Context app = ac != null ? ac : base;
        final Thread.UncaughtExceptionHandler prev = Thread.getDefaultUncaughtExceptionHandler();
        Thread.setDefaultUncaughtExceptionHandler((t, e) -> {
            try {
                StringWriter sw = new StringWriter();
                e.printStackTrace(new PrintWriter(sw));
                String s = sw.toString();
                if (s.length() > 1400) s = s.substring(0, 1400);
                app.getSharedPreferences(PREF, Context.MODE_PRIVATE).edit()
                        .putString("trace", s).putString("thread", t.getName())
                        .putLong("at", System.currentTimeMillis()).commit();
            } catch (Throwable ignore) {}
            if (prev != null) prev.uncaughtException(t, e);
        });
        flush(app);
    }

    private static void flush(final Context app) {
        final SharedPreferences sp = app.getSharedPreferences(PREF, Context.MODE_PRIVATE);
        final String trace = sp.getString("trace", null);
        if (trace == null) return;
        new Thread(() -> {
            HttpURLConnection c = null;
            try {
                JSONObject props = new JSONObject();
                props.put("trace", trace);
                props.put("thread", sp.getString("thread", ""));
                props.put("crashAt", sp.getLong("at", 0));
                props.put("ver", BuildConfig.VERSION_NAME);
                props.put("sdk", Build.VERSION.SDK_INT);
                props.put("model", Build.MANUFACTURER + " " + Build.MODEL);
                JSONObject ev = new JSONObject();
                ev.put("name", "android_crash");
                ev.put("props", props);
                JSONObject body = new JSONObject();
                body.put("events", new JSONArray().put(ev));
                c = (HttpURLConnection) new URL("https://miru.plus/api/events").openConnection();
                c.setConnectTimeout(8000);
                c.setReadTimeout(8000);
                c.setRequestMethod("POST");
                c.setDoOutput(true);
                c.setRequestProperty("Content-Type", "application/json");
                try (OutputStream os = c.getOutputStream()) { os.write(body.toString().getBytes(StandardCharsets.UTF_8)); }
                int code = c.getResponseCode();
                if (code >= 200 && code < 300) sp.edit().clear().apply();
            } catch (Throwable ignore) {
            } finally {
                if (c != null) c.disconnect();
            }
        }, "miru-crash-flush").start();
    }
}
