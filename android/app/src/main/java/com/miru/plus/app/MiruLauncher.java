package com.miru.plus.app;

import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Bundle;

import androidx.annotation.Nullable;

import com.google.androidbrowserhelper.trusted.LauncherActivity;
import com.google.androidbrowserhelper.trusted.LauncherActivityMetadata;
import com.google.androidbrowserhelper.trusted.TwaProviderPicker;
import com.google.androidbrowserhelper.trusted.WebViewFallbackActivity;

/** 桌面图标入口（2026-11-28）。
 *  用户反馈：打开 App 时顶部一直有一条加载进度细线，看起来像网页。
 *  这条线不是我们网页画的，是「浏览器壳」画的：只有 Chrome 在「可信网页壳（TWA）」模式下才会把浏览器界面完全藏起来；
 *  手机默认浏览器如果是别的（荣耀/华为自带浏览器、Edge、Firefox、三星浏览器等），它们接手后会留下工具栏或进度条。
 *  现在：只有 Chrome（正式 / Beta / Dev / Canary）才走 TWA（网页里的 Google Play 结算也只有 Chrome 支持）；
 *  其他情况一律直接用 App 自带的 WebView 打开 miru.plus —— WebView 里没有任何浏览器界面，也就没有进度条。
 *  每次启动发一条 android_shell 事件（用的哪种壳、哪个浏览器），方便以后排查。 */
public class MiruLauncher extends LauncherActivity {
    private static final String[] CHROME = {"com.android.chrome", "com.chrome.beta", "com.chrome.dev", "com.chrome.canary"};

    private boolean useWebView;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        String provider = null;
        int mode = TwaProviderPicker.LaunchMode.BROWSER;
        try {
            PackageManager pm = getPackageManager();
            TwaProviderPicker.Action a = TwaProviderPicker.pickProvider(pm);
            provider = a.provider;
            mode = a.launchMode;
        } catch (Throwable ignore) {}
        useWebView = !(mode == TwaProviderPicker.LaunchMode.TRUSTED_WEB_ACTIVITY && isChrome(provider));
        try { CrashLog.shell(useWebView ? "webview" : "twa", provider, mode); } catch (Throwable ignore) {}
        super.onCreate(savedInstanceState);
    }

    @Override
    protected void launchTwa() {
        if (!useWebView) { super.launchTwa(); return; }
        if (isFinishing()) return;
        try {
            Uri url = getLaunchingUrl();
            Intent i = WebViewFallbackActivity.createLaunchIntent(this, url, LauncherActivityMetadata.parse(this));
            i.setClass(this, MiruWebActivity.class);
            startActivity(i);
            overridePendingTransition(0, 0);
            finish();
        } catch (Throwable t) {
            // WebView 打不开（极少数系统 WebView 被禁用）时，退回原来的方式
            useWebView = false;
            super.launchTwa();
        }
    }

    private static boolean isChrome(String p) {
        if (p == null) return false;
        for (String c : CHROME) if (c.equals(p)) return true;
        return false;
    }
}
