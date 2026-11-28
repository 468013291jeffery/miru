package com.miru.plus.app;

import android.app.Activity;
import android.app.AlertDialog;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.Gravity;
import android.widget.TextView;
import android.widget.Toast;

import com.aptoide.sdk.billing.AptoideBillingClient;
import com.aptoide.sdk.billing.AptoideBillingClient.BillingResponseCode;
import com.aptoide.sdk.billing.AptoideBillingClient.ProductType;
import com.aptoide.sdk.billing.BillingFlowParams;
import com.aptoide.sdk.billing.BillingResult;
import com.aptoide.sdk.billing.ConsumeParams;
import com.aptoide.sdk.billing.ProductDetails;
import com.aptoide.sdk.billing.Purchase;
import com.aptoide.sdk.billing.PurchasesUpdatedListener;
import com.aptoide.sdk.billing.QueryProductDetailsParams;
import com.aptoide.sdk.billing.QueryPurchasesParams;
import com.aptoide.sdk.billing.listeners.AptoideBillingClientStateListener;

import org.json.JSONObject;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.List;

/** Aptoide 版专用的钻石购买页（2026-11-28，只在 aptoide 渠道包里有）。
 *  Aptoide 规定：从 Aptoide（以及它分发到的 APKPure 等渠道）安装的 App，内购必须走 Aptoide 自己的结算 SDK，不能走 Google Play。
 *  流程：网页里点钻石包 → 跳 miru-pay://aptoide?sku=gems_60&u=<用户ID> → 这里：
 *    1. 连上 Aptoide 结算，先把以前「付了钱但还没到账」的单补交一次；
 *    2. 查这个商品在当地的价格，弹窗确认（Aptoide 要求 App 里显示的价格和结账页一致）；
 *    3. 打开 Aptoide 结账页，developerPayload 里带上「miru:<用户ID>」；
 *    4. 付款成功后把订单交给 https://miru.plus/api/wallet?r=aptoide，服务器向 Aptoide 验单、按 payload 里的用户发钻（同一笔只发一次）；
 *    5. 服务器确认到账后才「消耗」这笔订单（没消耗的单 Aptoide 两天后会自动退款，所以到账失败时用户的钱不会白扣）。
 *  做完关掉自己回到网页，网页回到前台时会重新拉一次余额。 */
public class AptoidePayActivity extends Activity {
    private static final String WALLET = "https://miru.plus/api/wallet?r=aptoide";
    private final Handler ui = new Handler(Looper.getMainLooper());
    private AptoideBillingClient client;
    private String sku, uid;
    private boolean done, launched;
    private TextView status;

    @Override
    protected void onCreate(Bundle b) {
        super.onCreate(b);
        status = new TextView(this);
        status.setText("正在連接 Aptoide 付款…");
        status.setTextColor(Color.WHITE);
        status.setBackgroundColor(Color.rgb(0x20, 0x02, 0x17));
        status.setGravity(Gravity.CENTER);
        status.setPadding(48, 48, 48, 48);
        setContentView(status);
        Uri u = getIntent() != null ? getIntent().getData() : null;
        sku = u != null ? u.getQueryParameter("sku") : null;
        uid = u != null ? u.getQueryParameter("u") : null;
        if (BuildConfig.APTOIDE_PUBLIC_KEY.isEmpty()) { end("付款暫時無法使用（缺少 Aptoide 金鑰）"); return; }
        try {
            client = AptoideBillingClient.newBuilder(this)
                    .setListener(purchasesUpdated)
                    .setPublicKey(BuildConfig.APTOIDE_PUBLIC_KEY)
                    .build();
            client.startConnection(new AptoideBillingClientStateListener() {
                @Override public void onBillingSetupFinished(BillingResult r) {
                    if (r.getResponseCode() != BillingResponseCode.OK) { log("setup_fail", String.valueOf(r.getResponseCode())); end("無法連接 Aptoide 付款，請稍後再試"); return; }
                    recover();
                }
                @Override public void onBillingServiceDisconnected() { if (!done && !launched) end("Aptoide 付款連線中斷，請再試一次"); }
            });
        } catch (Throwable t) { log("init_fail", String.valueOf(t)); end("無法連接 Aptoide 付款，請稍後再試"); }
    }

    /** 先補交以前沒到賬的單，再開始這次購買 */
    private void recover() {
        try {
            client.queryPurchasesAsync(QueryPurchasesParams.newBuilder().setProductType(ProductType.INAPP).build(), (r, list) -> {
                if (r.getResponseCode() == BillingResponseCode.OK && list != null) for (Purchase p : list) deliver(p, false);
                ui.post(this::queryAndConfirm);
            });
        } catch (Throwable t) { ui.post(this::queryAndConfirm); }
    }

    private void queryAndConfirm() {
        if (done) return;
        if (sku == null || sku.isEmpty() || uid == null || uid.isEmpty()) { end(null); return; }
        try {
            QueryProductDetailsParams q = QueryProductDetailsParams.newBuilder()
                    .setProductList(Collections.singletonList(QueryProductDetailsParams.Product.newBuilder().setProductId(sku).setProductType(ProductType.INAPP).build()))
                    .build();
            client.queryProductDetailsAsync(q, (r, res) -> {
                List<ProductDetails> l = res != null ? res.getProductDetailsList() : null;
                if (r.getResponseCode() != BillingResponseCode.OK || l == null || l.isEmpty()) { log("no_product", sku + " " + r.getResponseCode()); ui.post(() -> end("這個鑽石包暫時無法購買")); return; }
                ProductDetails d = l.get(0);
                String price = "";
                try { price = d.getOneTimePurchaseOfferDetails().getFormattedPrice(); } catch (Throwable ignore) {}
                final String shown = price;
                ui.post(() -> confirm(d, shown));
            });
        } catch (Throwable t) { log("query_fail", String.valueOf(t)); end("這個鑽石包暫時無法購買"); }
    }

    private void confirm(ProductDetails d, String price) {
        if (done || isFinishing()) return;
        String gems = sku.replace("gems_", "");
        new AlertDialog.Builder(this)
                .setTitle("購買 " + gems + " 鑽石")
                .setMessage((price.isEmpty() ? "" : "價格：" + price + "\n") + "由 Aptoide 安全付款，付款後鑽石自動到賬。")
                .setPositiveButton("付款", (x, y) -> launch(d))
                .setNegativeButton("取消", (x, y) -> end(null))
                .setOnCancelListener(x -> end(null))
                .show();
    }

    private void launch(ProductDetails d) {
        launched = true;
        status.setText("正在打開 Aptoide 付款頁…");
        final BillingFlowParams p = BillingFlowParams.newBuilder()
                .setProductDetailsParamsList(Collections.singletonList(BillingFlowParams.ProductDetailsParams.newBuilder().setProductDetails(d).build()))
                .setDeveloperPayload("miru:" + uid)
                .setObfuscatedAccountId(uid)
                .build();
        new Thread(() -> {
            try {
                BillingResult r = client.launchBillingFlow(this, p);
                if (r.getResponseCode() != BillingResponseCode.OK) { log("launch_fail", String.valueOf(r.getResponseCode())); ui.post(() -> end("無法打開付款頁，沒有扣款")); }
            } catch (Throwable t) { log("launch_fail", String.valueOf(t)); ui.post(() -> end("無法打開付款頁，沒有扣款")); }
        }, "miru-aptoide-launch").start();
    }

    private final PurchasesUpdatedListener purchasesUpdated = (r, purchases) -> {
        if (r.getResponseCode() == BillingResponseCode.OK && purchases != null && !purchases.isEmpty()) {
            ui.post(() -> status.setText("付款成功，鑽石到賬中…"));
            for (Purchase p : purchases) deliver(p, true);
        } else if (r.getResponseCode() == BillingResponseCode.USER_CANCELED) {
            ui.post(() -> end("付款已取消，沒有扣款"));
        } else {
            log("purchase_fail", String.valueOf(r.getResponseCode()));
            ui.post(() -> end("這次沒有付款成功，沒有扣款"));
        }
    };

    /** 交給伺服器驗單發鑽；成功後才消耗訂單 */
    private void deliver(Purchase p, boolean finishAfter) {
        new Thread(() -> {
            String product = "";
            try { List<String> ps = p.getProducts(); product = ps != null && !ps.isEmpty() ? ps.get(0) : ""; } catch (Throwable ignore) {}
            boolean ok = false; int gems = -1;
            for (int i = 0; i < 3 && !ok; i++) {
                try {
                    JSONObject body = new JSONObject();
                    body.put("sku", product);
                    body.put("token", p.getPurchaseToken());
                    body.put("pkg", getPackageName());
                    JSONObject j = post(body);
                    ok = j != null && j.optBoolean("ok");
                    if (j != null) gems = j.optInt("gems", -1);
                } catch (Throwable ignore) {}
                if (!ok) try { Thread.sleep(1500L * (i + 1)); } catch (InterruptedException ignore) {}
            }
            if (ok) {
                try { client.consumeAsync(ConsumeParams.newBuilder().setPurchaseToken(p.getPurchaseToken()).build(), (cr, token) -> {}); } catch (Throwable ignore) {}
                final int g = gems;
                if (finishAfter) ui.post(() -> end(g >= 0 ? "儲值成功，現在有 💎 " + g : "儲值成功"));
            } else {
                log("deliver_fail", product);
                if (finishAfter) ui.post(() -> end("付款已收到，鑽石稍後會自動補上（下次打開儲值時會再確認一次）"));
            }
        }, "miru-aptoide-deliver").start();
    }

    private JSONObject post(JSONObject body) throws Exception {
        HttpURLConnection c = (HttpURLConnection) new URL(WALLET).openConnection();
        try {
            c.setConnectTimeout(8000); c.setReadTimeout(15000);
            c.setRequestMethod("POST"); c.setDoOutput(true);
            c.setRequestProperty("Content-Type", "application/json");
            try (OutputStream os = c.getOutputStream()) { os.write(body.toString().getBytes(StandardCharsets.UTF_8)); }
            int code = c.getResponseCode();
            java.io.InputStream in = code < 400 ? c.getInputStream() : c.getErrorStream();
            if (in == null) return null;
            java.io.ByteArrayOutputStream bo = new java.io.ByteArrayOutputStream(); byte[] buf = new byte[4096]; int n;
            while ((n = in.read(buf)) > 0) bo.write(buf, 0, n);
            JSONObject j = new JSONObject(bo.toString("UTF-8"));
            if (code >= 400) j.put("ok", false);
            return j;
        } finally { c.disconnect(); }
    }

    private void log(String what, String msg) { try { CrashLog.pay("aptoide_" + what, msg); } catch (Throwable ignore) {} }

    private void end(String msg) {
        if (done) return;
        done = true;
        if (msg != null) try { Toast.makeText(getApplicationContext(), msg, Toast.LENGTH_LONG).show(); } catch (Throwable ignore) {}
        ui.postDelayed(() -> {
            finish();
            overridePendingTransition(0, 0);
        }, 300);
    }
}
