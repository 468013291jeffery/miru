package com.miru.plus.app;

import android.app.Activity;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.Gravity;
import android.widget.TextView;

import com.applovin.mediation.MaxAd;
import com.applovin.mediation.MaxError;
import com.applovin.mediation.MaxReward;
import com.applovin.mediation.MaxRewardedAdListener;
import com.applovin.mediation.ads.MaxRewardedAd;
import com.applovin.sdk.AppLovinSdk;

/** 激励视频：网页里跳 miru-ad://rewarded?u=<用户ID>&n=<本次编号>，这里放一条广告后回到网页。
 *  发奖励以 AppLovin 服务器回调（S2S）为准，网页回到前台后向自己的服务器查询结果；这里不在本地发任何东西。 */
public class AdActivity extends Activity implements MaxRewardedAdListener {
    private static final long TIMEOUT_MS = 15000;
    private final Handler h = new Handler(Looper.getMainLooper());
    private MaxRewardedAd ad;
    private boolean done;

    @Override
    protected void onCreate(Bundle b) {
        super.onCreate(b);
        TextView t = new TextView(this);
        t.setText("广告加载中…");
        t.setTextColor(Color.WHITE);
        t.setBackgroundColor(Color.BLACK);
        t.setGravity(Gravity.CENTER);
        setContentView(t);
        if (!Ads.enabled() || BuildConfig.AL_REWARDED.isEmpty()) { finishAd(); return; }
        Uri u = getIntent() != null ? getIntent().getData() : null;
        final String uid = u != null ? u.getQueryParameter("u") : null;
        h.postDelayed(this::finishAd, TIMEOUT_MS);
        Ads.init(this, () -> {
            if (done) return;
            if (uid != null && !uid.isEmpty()) AppLovinSdk.getInstance(getApplicationContext()).getSettings().setUserIdentifier(uid);
            ad = MaxRewardedAd.getInstance(BuildConfig.AL_REWARDED, this);
            ad.setListener(this);
            if (ad.isReady()) { h.removeCallbacksAndMessages(null); ad.showAd(this); } else ad.loadAd();
        });
    }

    private void finishAd() {
        if (done) return;
        done = true;
        h.removeCallbacksAndMessages(null);
        finish();
        overridePendingTransition(0, 0);
    }

    @Override public void onAdLoaded(MaxAd a) { if (done || ad == null) return; h.removeCallbacksAndMessages(null); ad.showAd(this); }
    @Override public void onAdDisplayed(MaxAd a) {}
    @Override public void onAdHidden(MaxAd a) { finishAd(); }
    @Override public void onAdClicked(MaxAd a) {}
    @Override public void onAdLoadFailed(String unit, MaxError e) { finishAd(); }
    @Override public void onAdDisplayFailed(MaxAd a, MaxError e) { finishAd(); }
    @Override public void onUserRewarded(MaxAd a, MaxReward r) {}
}
