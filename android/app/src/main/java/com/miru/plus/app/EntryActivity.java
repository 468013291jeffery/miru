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

    private final Handler h = new Handler(Looper.getMainLooper());
    private boolean moved;

    @Override
    protected void onCreate(Bundle b) {
        super.onCreate(b);
        if (!Ads.enabled() || BuildConfig.UNITY_LAUNCH.isEmpty() || !due()) { go(); return; }
        h.postDelayed(this::go, WAIT_MS);
        Ads.init(this, () -> { if (!moved) UnityAds.load(BuildConfig.UNITY_LAUNCH, this); });
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
        UnityAds.show(this, placementId, new UnityAdsShowOptions(), this);
    }
    @Override public void onUnityAdsFailedToLoad(String placementId, UnityAds.UnityAdsLoadError e, String msg) { go(); }
    @Override public void onUnityAdsShowFailure(String placementId, UnityAds.UnityAdsShowError e, String msg) { go(); }
    @Override public void onUnityAdsShowStart(String placementId) {}
    @Override public void onUnityAdsShowClick(String placementId) {}
    @Override public void onUnityAdsShowComplete(String placementId, UnityAds.UnityAdsShowCompletionState state) { go(); }
}
