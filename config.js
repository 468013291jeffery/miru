/* Where MIRU sends LongCat requests. On Vercel the same-origin /api/longcat is used automatically;
   everywhere else (GitHub Pages, local copies) uses the MIRU proxy below. The key lives only on the server. */
window.MIRU_PROXY = window.MIRU_PROXY || (/\.vercel\.app$/.test(location.hostname) ? "" : "https://miru-wheat-pi.vercel.app/api/longcat");