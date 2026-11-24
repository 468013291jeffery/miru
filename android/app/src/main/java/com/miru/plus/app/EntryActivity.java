package com.miru.plus.app;

import android.app.Activity;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;

import com.applovin.mediation.MaxAd;
import com.applovin.mediation.MaxAdListener;
import com.applovin.mediation.MaxError;
import com.applovin.mediation.ads.MaxAppOpenAd;
import com.google.androidbrowserhelper.trusted.LauncherActivity;

/** 冷启动入口：最多等 4 秒，有开屏广告就放一次（4 小时内最多一次），然后打开网页壳（TWA）。 */
public class EntryActivity extends Activity implements MaxAdListener {
    private static final long GAP_MS = 4L * 60 * 60 * 1000;
    private static final long WAIT_MS = 4000;

    private final Handler h = new Handler(Looper.getMainLooper());
    private MaxAppOpenAd ad;
    private boolean moved;

    @Override
    protected void onCreate(Bundle b) {
        super.onCreate(b);
        if (!Ads.enabled() || BuildConfig.AL_APPOPEN.isEmpty() || !due()) { go(); return; }
        h.postDelayed(this::go, WAIT_MS);
        Ads.init(this, () -> {
            if (moved) return;
            ad = new MaxAppOpenAd(BuildConfig.AL_APPOPEN, this);
            ad.setListener(this);
            ad.loadAd();
        });
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

    @Override public void onAdLoaded(MaxAd a) {
        if (moved || ad == null || !ad.isReady()) return;
        h.removeCallbacksAndMessages(null);
        prefs().edit().putLong("appopen_at", System.currentTimeMillis()).apply();
        ad.showAd("launch");
    }
    @Override public void onAdDisplayed(MaxAd a) {}
    @Override public void onAdHidden(MaxAd a) { go(); }
    @Override public void onAdClicked(MaxAd a) {}
    @Override public void onAdLoadFailed(String unit, MaxError e) { go(); }
    @Override public void onAdDisplayFailed(MaxAd a, MaxError e) { go(); }
}
