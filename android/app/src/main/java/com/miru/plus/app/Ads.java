package com.miru.plus.app;

import android.content.Context;

import com.applovin.sdk.AppLovinMediationProvider;
import com.applovin.sdk.AppLovinSdk;
import com.applovin.sdk.AppLovinSdkInitializationConfiguration;

import java.util.ArrayList;
import java.util.List;

/** AppLovin MAX 初始化（Unity Ads 作为 MAX 里的一家聚合网络，由适配器自动接入）。
 *  密钥和广告位 ID 都在构建时从 GitHub Secrets 写进 BuildConfig；没配密钥时广告整体关闭，App 照常打开。 */
public final class Ads {
    private Ads() {}

    private static boolean starting;
    private static final List<Runnable> waiting = new ArrayList<>();

    public static boolean enabled() { return BuildConfig.APPLOVIN_SDK_KEY.length() > 0; }

    public static void init(Context ctx, Runnable done) {
        if (!enabled()) { done.run(); return; }
        final AppLovinSdk sdk = AppLovinSdk.getInstance(ctx.getApplicationContext());
        if (sdk.isInitialized()) { done.run(); return; }
        synchronized (waiting) { waiting.add(done); if (starting) return; starting = true; }
        AppLovinSdkInitializationConfiguration cfg = AppLovinSdkInitializationConfiguration
                .builder(BuildConfig.APPLOVIN_SDK_KEY)
                .setMediationProvider(AppLovinMediationProvider.MAX)
                .build();
        sdk.initialize(cfg, config -> {
            List<Runnable> run;
            synchronized (waiting) { run = new ArrayList<>(waiting); waiting.clear(); starting = false; }
            for (Runnable r : run) r.run();
        });
    }
}
