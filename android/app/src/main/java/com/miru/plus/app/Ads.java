package com.miru.plus.app;

import android.content.Context;

import com.unity3d.ads.IUnityAdsInitializationListener;
import com.unity3d.ads.UnityAds;

import java.util.ArrayList;
import java.util.List;

/** Unity Ads 初始化（2026-11-24：AppLovin 不再接受新的发布者账号，改为直接接 Unity Ads）。
 *  Game ID 不是密钥，写在 build.gradle 里；也可以用 GitHub Secret UNITY_GAME_ID 覆盖。为空时广告整体关闭，App 照常打开。 */
public final class Ads {
    private Ads() {}

    private static boolean starting;
    private static final List<Runnable> waiting = new ArrayList<>();

    public static boolean enabled() { return BuildConfig.UNITY_GAME_ID.length() > 0; }

    public static void init(Context ctx, Runnable done) {
        if (!enabled()) { done.run(); return; }
        if (UnityAds.isInitialized()) { done.run(); return; }
        synchronized (waiting) { waiting.add(done); if (starting) return; starting = true; }
        UnityAds.initialize(ctx.getApplicationContext(), BuildConfig.UNITY_GAME_ID, BuildConfig.UNITY_TEST, new IUnityAdsInitializationListener() {
            @Override public void onInitializationComplete() { flush(); }
            @Override public void onInitializationFailed(UnityAds.UnityAdsInitializationError e, String msg) { try { CrashLog.ad("init_fail", String.valueOf(e), msg); } catch (Throwable ignore) {} flush(); }
        });
    }

    private static void flush() {
        List<Runnable> run;
        synchronized (waiting) { run = new ArrayList<>(waiting); waiting.clear(); starting = false; }
        for (Runnable r : run) r.run();
    }
}
