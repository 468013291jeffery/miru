package com.miru.plus.app;

import android.app.Activity;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.Gravity;
import android.widget.TextView;

import com.unity3d.ads.IUnityAdsLoadListener;
import com.unity3d.ads.IUnityAdsShowListener;
import com.unity3d.ads.UnityAds;
import com.unity3d.ads.UnityAdsShowOptions;
import com.unity3d.ads.metadata.PlayerMetaData;

/** 激励视频：网页里跳 miru-ad://rewarded?u=<用户ID>&n=<本次编号>，这里放一条 Unity 激励广告后回到网页。
 *  用户 ID 通过 PlayerMetaData.setServerId 交给 Unity，用于服务器回调（S2S）发奖励；这里不在本地发任何东西。 */
public class AdActivity extends Activity implements IUnityAdsLoadListener, IUnityAdsShowListener {
    private static final long TIMEOUT_MS = 15000;
    private final Handler h = new Handler(Looper.getMainLooper());
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
        if (!Ads.enabled() || BuildConfig.UNITY_REWARDED.isEmpty()) { finishAd(); return; }
        Uri u = getIntent() != null ? getIntent().getData() : null;
        final String uid = u != null ? u.getQueryParameter("u") : null;
        h.postDelayed(() -> { try { CrashLog.ad("timeout", "", "init=" + UnityAds.isInitialized()); } catch (Throwable ignore) {} finishAd(); }, TIMEOUT_MS);
        Ads.init(this, () -> {
            if (done) return;
            if (uid != null && !uid.isEmpty()) { PlayerMetaData pm = new PlayerMetaData(getApplicationContext()); pm.setServerId(uid); pm.commit(); }
            UnityAds.load(BuildConfig.UNITY_REWARDED, this);
        });
    }

    private void finishAd() {
        if (done) return;
        done = true;
        h.removeCallbacksAndMessages(null);
        finish();
        overridePendingTransition(0, 0);
    }

    @Override public void onUnityAdsAdLoaded(String placementId) { if (done) return; h.removeCallbacksAndMessages(null); UnityAds.show(this, placementId, new UnityAdsShowOptions(), this); }
    @Override public void onUnityAdsFailedToLoad(String placementId, UnityAds.UnityAdsLoadError e, String msg) { try { CrashLog.ad("load_fail", String.valueOf(e), msg); } catch (Throwable ignore) {} finishAd(); }
    @Override public void onUnityAdsShowFailure(String placementId, UnityAds.UnityAdsShowError e, String msg) { try { CrashLog.ad("show_fail", String.valueOf(e), msg); } catch (Throwable ignore) {} finishAd(); }
    @Override public void onUnityAdsShowStart(String placementId) { try { CrashLog.ad("show_start", "", placementId); } catch (Throwable ignore) {} }
    @Override public void onUnityAdsShowClick(String placementId) {}
    @Override public void onUnityAdsShowComplete(String placementId, UnityAds.UnityAdsShowCompletionState state) { finishAd(); }
}
