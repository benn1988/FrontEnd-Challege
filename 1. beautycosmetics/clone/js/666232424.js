(function () {
    var s = {};
    (function () {
        /*  Copyright The Closure Library Authors. SPDX-License-Identifier: Apache-2.0 */
        var c = {},
            f = this || self;
        var l = /#|$/;

        function n(d) {
            var g = d.search(l),
                a;
            a: {
                for (a = 0; 0 <= (a = d.indexOf("fmt", a)) && a < g;) {
                    var b = d.charCodeAt(a - 1);
                    if (38 == b || 63 == b)
                        if (b = d.charCodeAt(a + 3), !b || 61 == b || 38 == b || 35 == b) break a;
                    a += 4
                }
                a = -1
            }
            if (0 > a) return null;
            b = d.indexOf("&", a);
            if (0 > b || b > g) b = g;
            a += 4;
            return decodeURIComponent(d.substr(a, b - a).replace(/\+/g, " "))
        };

        function r(d, g, a) {
            function b() {
                --p;
                if (0 >= p) {
                    var e;
                    (e = d.GooglebQhCsO) || (e = {});
                    var q = e[g];
                    q && (delete e[g], (e = q[0]) && e.call && e())
                }
            }
            for (var p = a.length + 1, m = 0; m < a.length; m++) {
                var h = n(a[m]),
                    k = null;
                1 != h && 2 != h || !(h = d.document.getElementById("goog_conv_iframe")) || h.src || (k = h);
                k || (k = new Image);
                k.onload = b;
                k.src = a[m]
            }
            b()
        }
        var t = ["ss_"],
            u = s || f;
        t[0] in u || "undefined" == typeof u.execScript || u.execScript("var " + t[0]);
        for (var v; t.length && (v = t.shift());) t.length || void 0 === r ? u[v] && u[v] !== Object.prototype[v] ? u = u[v] : u = u[v] = {} : u[v] = r;
    }).call(this);;
    s.ss_(window, 'OjE1OTk2ODc3NzM3MDM', ['https://www.google.com/pagead/1p-user-list/666232424/?random\x3d1599687773703\x26cv\x3d9\x26fst\x3d1599685200000\x26num\x3d1\x26guid\x3dON\x26eid\x3d376635470\x26u_h\x3d600\x26u_w\x3d800\x26u_ah\x3d600\x26u_aw\x3d800\x26u_cd\x3d24\x26u_his\x3d2\x26u_tz\x3d-420\x26u_java\x3dfalse\x26u_nplug\x3d0\x26u_nmime\x3d0\x26gtm\x3d2wg8q1\x26sendb\x3d1\x26frm\x3d0\x26url\x3dhttps%3A%2F%2Fwww.beautystatcosmetics.com%2Fen%2Fpre-6.html\x26tiba\x3dAt%2020%25%20Pure%20Vitamin%20C%2C%20You%20Won%E2%80%99t%20Believe%20The%20Results\x26async\x3d1\x26fmt\x3d3\x26is_vtc\x3d1\x26random\x3d3184033964\x26resp\x3dGooglemKTybQhCsO\x26rmt_tld\x3d0\x26ipr\x3dy']);
})();