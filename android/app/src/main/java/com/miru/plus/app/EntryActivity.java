package com.miru.plus.app;

import android.app.Activity;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;

import com.google.androidbrowserhelper.trusted.LauncherActivity;
import com.unity3d.ads.IUnityAdsLoadListener;
import com.unity3d.ads.IUnityAdsShowListener;
import com.unity3d.ads.UnityAds;
import com.unity3d.ads.UnityAdsShowOptions;

/** 冷启动入口：最多等 4 秒，有插屏广告就放一次（Unity 没有开屏格式，用插屏代替；4 小时内最多一次），然后打开网页壳（TWA）。 */
public class EntryActivity extends Activity implements IUnityAdsLoadListener, IUnityAdsShowListener {
    private static final long GAP_MS = 4L * 60 * 60 * 1000;
    private static final long WAIT_MS = 4000;
    private static final boolean LAUNCH_AD = false;

    private final Handler h = new Handler(Looper.getMainLooper());
    private boolean moved;

    @Override
    protected void onCreate(Bundle b) {
        super.onCreate(b);
        /* 2026-11-26：开屏插屏广告先关掉。用户反馈「昨天正常、今天一打开就闪退」——正好对上「每 4 小时第一次打开放一次插屏」，
           在半透明的启动页上弹 Unity 全屏广告是最可疑的崩溃点。先保证打开不崩，激励视频（AdActivity）不受影响。
           确认原因后要恢复，把 LAUNCH_AD 改回 true。 */
        if (!LAUNCH_AD || !Ads.enabled() || BuildConfig.UNITY_LAUNCH.isEmpty() || !due()) { go(); return; }
        h.postDelayed(this::go, WAIT_MS);
        try { Ads.init(this, () -> { try { if (!moved) UnityAds.load(BuildConfig.UNITY_LAUNCH, this); } catch (Throwable t) { go(); } }); } catch (Throwable t) { go(); }
    }

    private SharedPreferences prefs() { return getSharedPreferences("miru_ads", MODE_PRIVATE); }

    private boolean due() { return System.currentTimeMillis() - prefs().getLong("appopen_at", 0) > GAP_MS; }

    private void go() {
        if (moved) return;
        moved = true;
        h.removeCallbacksAndMessages(null);
        Intent i = new Intent(this, LauncherActivity.class);
        if (getIntent() != null && getIntent().getData() != null) i.setData(getIntent().getData());
        startActivity(i);
        finish();
        overridePendingTransition(0, 0);
    }

    @Override public void onUnityAdsAdLoaded(String placementId) {
        if (moved) return;
        h.removeCallbacksAndMessages(null);
        prefs().edit().putLong("appopen_at", System.currentTimeMillis()).apply();
        try { UnityAds.show(this, placementId, new UnityAdsShowOptions(), this); } catch (Throwable t) { go(); }
    }
    @Override public void onUnityAdsFailedToLoad(String placementId, UnityAds.UnityAdsLoadError e, String msg) { go(); }
    @Override public void onUnityAdsShowFailure(String placementId, UnityAds.UnityAdsShowError e, String msg) { go(); }
    @Override public void onUnityAdsShowStart(String placementId) {}
    @Override public void onUnityAdsShowClick(String placementId) {}
    @Override public void onUnityAdsShowComplete(String placementId, UnityAds.UnityAdsShowCompletionState state) { go(); }
}
