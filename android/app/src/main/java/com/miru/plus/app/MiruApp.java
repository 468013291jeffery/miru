package com.miru.plus.app;

import android.app.Application;
import android.content.Context;

/** 2026-11-26：App 一启动就装上崩溃记录（CrashLog），闪退原因下次打开时自动传回服务器，不用等 Play 后台的统计。
 *  2026-11-27：改到 attachBaseContext 里装——它比所有 ContentProvider（广告 SDK 的自动初始化就挂在那里）都早，
 *  之前装在 onCreate，provider 里的启动崩溃记不下来，所以服务器一直收不到闪退记录。 */
public class MiruApp extends Application {
    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        try { CrashLog.install(this, base); } catch (Throwable ignore) {}
    }
}
