package com.miru.plus.app;

import android.app.Application;

/** 2026-11-26：App 一启动就装上崩溃记录（CrashLog），闪退原因下次打开时自动传回服务器，不用等 Play 后台的统计。 */
public class MiruApp extends Application {
    @Override
    public void onCreate() {
        super.onCreate();
        CrashLog.install(this);
    }
}
