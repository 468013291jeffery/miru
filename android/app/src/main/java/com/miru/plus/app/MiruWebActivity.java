package com.miru.plus.app;

import android.graphics.Color;
import android.os.Bundle;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebView;

import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;

import com.google.androidbrowserhelper.trusted.WebViewFallbackActivity;

/** App 自带 WebView 壳（2026-11-28，非 Chrome 手机用；见 MiruLauncher）。
 *  在官方 WebViewFallbackActivity 基础上补三件事：
 *  1. WebView 默认底色是白的，页面画出来之前会白一下 → 改成开屏海报同色 #200217，跟开屏页无缝衔接；
 *  2. Android 15 起系统强制「内容铺满到状态栏下面」，网页顶部会被状态栏 / 底部被手势条压住 → 按系统栏高度留出边距；
 *  3. 弹出键盘时同样让出键盘高度，聊天输入框不会被挡住。 */
public class MiruWebActivity extends WebViewFallbackActivity {
    private static final int BG = Color.rgb(0x20, 0x02, 0x17);

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        try {
            getWindow().getDecorView().setBackgroundColor(BG);
            WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView()).setAppearanceLightStatusBars(false);
            View content = findViewById(android.R.id.content);
            WebView wv = findWebView(content);
            if (wv != null) wv.setBackgroundColor(BG);
            if (content != null) {
                ViewCompat.setOnApplyWindowInsetsListener(content, (v, insets) -> {
                    Insets s = insets.getInsets(WindowInsetsCompat.Type.systemBars()
                            | WindowInsetsCompat.Type.displayCutout() | WindowInsetsCompat.Type.ime());
                    v.setPadding(s.left, s.top, s.right, s.bottom);
                    return WindowInsetsCompat.CONSUMED;
                });
                ViewCompat.requestApplyInsets(content);
            }
        } catch (Throwable ignore) {}
    }

    private static WebView findWebView(View v) {
        if (v instanceof WebView) return (WebView) v;
        if (v instanceof ViewGroup) {
            ViewGroup g = (ViewGroup) v;
            for (int i = 0; i < g.getChildCount(); i++) {
                WebView w = findWebView(g.getChildAt(i));
                if (w != null) return w;
            }
        }
        return null;
    }
}
