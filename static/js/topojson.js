// https://github.com/topojson/topojson Version 3.0.2. Copyright 2017 Mike Bostock.
(function(r, n) { "object" == typeof exports && "undefined" != typeof module ? n(exports) : "function" == typeof define && define.amd ? define(["exports"], n) : n(r.topojson = r.topojson || {}) })(this, function(r) { "use strict";

    function n(r, n) { var e = n.id,
            o = n.bbox,
            a = null == n.properties ? {} : n.properties,
            i = t(r, n); return null == e && null == o ? { type: "Feature", properties: a, geometry: i } : null == o ? { type: "Feature", id: e, properties: a, geometry: i } : { type: "Feature", id: e, bbox: o, properties: a, geometry: i } }

    function t(r, n) {
        function t(r, n) { n.length && n.pop(); for (var t = f[r < 0 ? ~r : r], e = 0, o = t.length; e < o; ++e) n.push(c(t[e], e));
            r < 0 && C(n, o) }

        function e(r) { return c(r) }

        function o(r) { for (var n = [], e = 0, o = r.length; e < o; ++e) t(r[e], n); return n.length < 2 && n.push(n[0]), n }

        function a(r) { for (var n = o(r); n.length < 4;) n.push(n[0]); return n }

        function i(r) { return r.map(a) }

        function u(r) { var n, t = r.type; switch (t) {
                case "GeometryCollection":
                    return { type: t, geometries: r.geometries.map(u) };
                case "Point":
                    n = e(r.coordinates); break;
                case "MultiPoint":
                    n = r.coordinates.map(e); break;
                case "LineString":
                    n = o(r.arcs); break;
                case "MultiLineString":
                    n = r.arcs.map(o); break;
                case "Polygon":
                    n = i(r.arcs); break;
                case "MultiPolygon":
                    n = r.arcs.map(i); break;
                default:
                    return null } return { type: t, coordinates: n } } var c = A(r.transform),
            f = r.arcs; return u(n) }

    function e(r, n, t) { var e, a, i; if (arguments.length > 1) e = o(r, n, t);
        else
            for (a = 0, e = new Array(i = r.arcs.length); a < i; ++a) e[a] = a; return { type: "MultiLineString", arcs: G(r, e) } }

    function o(r, n, t) {
        function e(r) { var n = r < 0 ? ~r : r;
            (s[n] || (s[n] = [])).push({ i: r, g: c }) }

        function o(r) { r.forEach(e) }

        function a(r) { r.forEach(o) }

        function i(r) { r.forEach(a) }

        function u(r) { switch (c = r, r.type) {
                case "GeometryCollection":
                    r.geometries.forEach(u); break;
                case "LineString":
                    o(r.arcs); break;
                case "MultiLineString":
                case "Polygon":
                    a(r.arcs); break;
                case "MultiPolygon":
                    i(r.arcs) } } var c, f = [],
            s = []; return u(n), s.forEach(null == t ? function(r) { f.push(r[0].i) } : function(r) { t(r[0].g, r[r.length - 1].g) && f.push(r[0].i) }), f }

    function a(r) { for (var n, t = -1, e = r.length, o = r[e - 1], a = 0; ++t < e;) n = o, o = r[t], a += n[0] * o[1] - n[1] * o[0]; return Math.abs(a) }

    function i(r, n) {
        function e(r) { switch (r.type) {
                case "GeometryCollection":
                    r.geometries.forEach(e); break;
                case "Polygon":
                    o(r.arcs); break;
                case "MultiPolygon":
                    r.arcs.forEach(o) } }

        function o(r) { r.forEach(function(n) { n.forEach(function(n) {
                    (u[n = n < 0 ? ~n : n] || (u[n] = [])).push(r) }) }), c.push(r) }

        function i(n) { return a(t(r, { type: "Polygon", arcs: [n] }).coordinates[0]) } var u = {},
            c = [],
            f = []; return n.forEach(e), c.forEach(function(r) { if (!r._) { var n = [],
                    t = [r]; for (r._ = 1, f.push(n); r = t.pop();) n.push(r), r.forEach(function(r) { r.forEach(function(r) { u[r < 0 ? ~r : r].forEach(function(r) { r._ || (r._ = 1, t.push(r)) }) }) }) } }), c.forEach(function(r) { delete r._ }), { type: "MultiPolygon", arcs: f.map(function(n) { var t, e = []; if (n.forEach(function(r) { r.forEach(function(r) { r.forEach(function(r) { u[r < 0 ? ~r : r].length < 2 && e.push(r) }) }) }), e = G(r, e), (t = e.length) > 1)
                    for (var o, a, c = 1, f = i(e[0]); c < t; ++c)(o = i(e[c])) > f && (a = e[0], e[0] = e[c], e[c] = a, f = o); return e }) } }

    function u(r, n, t, e) { c(r, n, t), c(r, n, n + e), c(r, n + e, t) }

    function c(r, n, t) { for (var e, o = n + (t-- - n >> 1); n < o; ++n, --t) e = r[n], r[n] = r[t], r[t] = e }

    function f(r) { return null == r ? { type: null } : ("FeatureCollection" === r.type ? s : "Feature" === r.type ? l : h)(r) }

    function s(r) { var n = { type: "GeometryCollection", geometries: r.features.map(l) }; return null != r.bbox && (n.bbox = r.bbox), n }

    function l(r) { var n, t = h(r.geometry);
        null != r.id && (t.id = r.id), null != r.bbox && (t.bbox = r.bbox); for (n in r.properties) { t.properties = r.properties; break } return t }

    function h(r) { if (null == r) return { type: null }; var n = "GeometryCollection" === r.type ? { type: "GeometryCollection", geometries: r.geometries.map(h) } : "Point" === r.type || "MultiPoint" === r.type ? { type: r.type, coordinates: r.coordinates } : { type: r.type, arcs: r.coordinates }; return null != r.bbox && (n.bbox = r.bbox), n }

    function p(r) { var n, t = r[0],
            e = r[1]; return e < t && (n = t, t = e, e = n), t + 31 * e }

    function g(r, n) { var t, e = r[0],
            o = r[1],
            a = n[0],
            i = n[1]; return o < e && (t = e, e = o, o = t), i < a && (t = a, a = i, i = t), e === a && o === i }

    function y() { return !0 }

    function v(r) { return r }

    function b(r) { return null != r.type }

    function m(r) { var n = r[0],
            t = r[1],
            e = r[2]; return Math.abs((n[0] - e[0]) * (t[1] - n[1]) - (n[0] - t[0]) * (e[1] - n[1])) / 2 }

    function d(r) { for (var n, t = -1, e = r.length, o = r[e - 1], a = 0; ++t < e;) n = o, o = r[t], a += n[0] * o[1] - n[1] * o[0]; return Math.abs(a) / 2 }

    function M(r, n) { return r[1][2] - n[1][2] }

    function E(r) { return [r[0], r[1], 0] }

    function P(r, n) { if (t = r.length) { if ((n = +n) <= 0 || t < 2) return r[0]; if (n >= 1) return r[t - 1]; var t, e = (t - 1) * n,
                o = Math.floor(e),
                a = r[o]; return a + (r[o + 1] - a) * (e - o) } }

    function x(r, n) { return n - r }

    function w(r, n) { for (var t, e, o, a = 0, i = r.length, u = 0, c = r[n ? a++ : i - 1], f = c[0] * rr, s = c[1] * rr / 2 + $, l = er(s), h = or(s); a < i; ++a) { t = f, f = (c = r[a])[0] * rr, s = c[1] * rr / 2 + $, e = l, l = er(s), o = h, h = or(s); var p = f - t,
                g = p >= 0 ? 1 : -1,
                y = g * p,
                v = o * h,
                b = e * l + v * er(y),
                m = v * g * or(y);
            u += tr(m, b) } return u } var k = function(r) { return r },
        A = function(r) { if (null == r) return k; var n, t, e = r.scale[0],
                o = r.scale[1],
                a = r.translate[0],
                i = r.translate[1]; return function(r, u) { u || (n = t = 0); var c = 2,
                    f = r.length,
                    s = new Array(f); for (s[0] = (n += r[0]) * e + a, s[1] = (t += r[1]) * o + i; c < f;) s[c] = r[c], ++c; return s } },
        L = function(r) {
            function n(r) {
                (r = o(r))[0] < a && (a = r[0]), r[0] > u && (u = r[0]), r[1] < i && (i = r[1]), r[1] > c && (c = r[1]) }

            function t(r) { switch (r.type) {
                    case "GeometryCollection":
                        r.geometries.forEach(t); break;
                    case "Point":
                        n(r.coordinates); break;
                    case "MultiPoint":
                        r.coordinates.forEach(n) } } var e, o = A(r.transform),
                a = 1 / 0,
                i = a,
                u = -a,
                c = -a;
            r.arcs.forEach(function(r) { for (var n, t = -1, e = r.length; ++t < e;)(n = o(r[t], t))[0] < a && (a = n[0]), n[0] > u && (u = n[0]), n[1] < i && (i = n[1]), n[1] > c && (c = n[1]) }); for (e in r.objects) t(r.objects[e]); return [a, i, u, c] },
        C = function(r, n) { for (var t, e = r.length, o = e - n; o < --e;) t = r[o], r[o++] = r[e], r[e] = t },
        S = function(r, t) { return "GeometryCollection" === t.type ? { type: "FeatureCollection", features: t.geometries.map(function(t) { return n(r, t) }) } : n(r, t) },
        G = function(r, n) {
            function t(n) { var t, e = r.arcs[n < 0 ? ~n : n],
                    o = e[0]; return r.transform ? (t = [0, 0], e.forEach(function(r) { t[0] += r[0], t[1] += r[1] })) : t = e[e.length - 1], n < 0 ? [t, o] : [o, t] }

            function e(r, n) { for (var t in r) { var e = r[t];
                    delete n[e.start], delete e.start, delete e.end, e.forEach(function(r) { o[r < 0 ? ~r : r] = 1 }), u.push(e) } } var o = {},
                a = {},
                i = {},
                u = [],
                c = -1; return n.forEach(function(t, e) { var o, a = r.arcs[t < 0 ? ~t : t];
                a.length < 3 && !a[1][0] && !a[1][1] && (o = n[++c], n[c] = t, n[e] = o) }), n.forEach(function(r) { var n, e, o = t(r),
                    u = o[0],
                    c = o[1]; if (n = i[u])
                    if (delete i[n.end], n.push(r), n.end = c, e = a[c]) { delete a[e.start]; var f = e === n ? n : n.concat(e);
                        a[f.start = n.start] = i[f.end = e.end] = f } else a[n.start] = i[n.end] = n;
                else if (n = a[c])
                    if (delete a[n.start], n.unshift(r), n.start = u, e = i[u]) { delete i[e.end]; var s = e === n ? n : e.concat(n);
                        a[s.start = e.start] = i[s.end = n.end] = s } else a[n.start] = i[n.end] = n;
                else a[(n = [r]).start = u] = i[n.end = c] = n }), e(i, a), e(a, i), n.forEach(function(r) { o[r < 0 ? ~r : r] || u.push([r]) }), u },
        j = function(r, n) { for (var t = 0, e = r.length; t < e;) { var o = t + e >>> 1;
                r[o] < n ? t = o + 1 : e = o } return t },
        _ = function(r) { if (null == r) return k; var n, t, e = r.scale[0],
                o = r.scale[1],
                a = r.translate[0],
                i = r.translate[1]; return function(r, u) { u || (n = t = 0); var c = 2,
                    f = r.length,
                    s = new Array(f),
                    l = Math.round((r[0] - a) / e),
                    h = Math.round((r[1] - i) / o); for (s[0] = l - n, n = l, s[1] = h - t, t = h; c < f;) s[c] = r[c], ++c; return s } },
        I = function(r) {
            function n(r) { null != r && f.hasOwnProperty(r.type) && f[r.type](r) }

            function t(r) { var n = r[0],
                    t = r[1];
                n < a && (a = n), n > u && (u = n), t < i && (i = t), t > c && (c = t) }

            function e(r) { r.forEach(t) }

            function o(r) { r.forEach(e) } var a = 1 / 0,
                i = 1 / 0,
                u = -1 / 0,
                c = -1 / 0,
                f = { GeometryCollection: function(r) { r.geometries.forEach(n) }, Point: function(r) { t(r.coordinates) }, MultiPoint: function(r) { r.coordinates.forEach(t) }, LineString: function(r) { e(r.arcs) }, MultiLineString: function(r) { r.arcs.forEach(e) }, Polygon: function(r) { r.arcs.forEach(e) }, MultiPolygon: function(r) { r.arcs.forEach(o) } }; for (var s in r) n(r[s]); return u >= a && c >= i ? [a, i, u, c] : void 0 },
        T = function(r, n, t, e, o) { 3 === arguments.length && (e = Array, o = null); for (var a = new e(r = 1 << Math.max(4, Math.ceil(Math.log(r) / Math.LN2))), i = r - 1, u = 0; u < r; ++u) a[u] = o; return { add: function(e) { for (var u = n(e) & i, c = a[u], f = 0; c != o;) { if (t(c, e)) return !0; if (++f >= r) throw new Error("full hashset");
                        c = a[u = u + 1 & i] } return a[u] = e, !0 }, has: function(e) { for (var u = n(e) & i, c = a[u], f = 0; c != o;) { if (t(c, e)) return !0; if (++f >= r) break;
                        c = a[u = u + 1 & i] } return !1 }, values: function() { for (var r = [], n = 0, t = a.length; n < t; ++n) { var e = a[n];
                        e != o && r.push(e) } return r } } },
        F = function(r, n, t, e, o, a) { 3 === arguments.length && (e = a = Array, o = null); for (var i = new e(r = 1 << Math.max(4, Math.ceil(Math.log(r) / Math.LN2))), u = new a(r), c = r - 1, f = 0; f < r; ++f) i[f] = o; return { set: function(e, a) { for (var f = n(e) & c, s = i[f], l = 0; s != o;) { if (t(s, e)) return u[f] = a; if (++l >= r) throw new Error("full hashmap");
                        s = i[f = f + 1 & c] } return i[f] = e, u[f] = a, a }, maybeSet: function(e, a) { for (var f = n(e) & c, s = i[f], l = 0; s != o;) { if (t(s, e)) return u[f]; if (++l >= r) throw new Error("full hashmap");
                        s = i[f = f + 1 & c] } return i[f] = e, u[f] = a, a }, get: function(e, a) { for (var f = n(e) & c, s = i[f], l = 0; s != o;) { if (t(s, e)) return u[f]; if (++l >= r) break;
                        s = i[f = f + 1 & c] } return a }, keys: function() { for (var r = [], n = 0, t = i.length; n < t; ++n) { var e = i[n];
                        e != o && r.push(e) } return r } } },
        N = function(r, n) { return r[0] === n[0] && r[1] === n[1] },
        O = new ArrayBuffer(16),
        q = new Uint32Array(O),
        U = function(r) { var n = q[0] ^ q[1]; return 2147483647 & (n = n << 5 ^ n >> 7 ^ q[2] ^ q[3]) },
        z = function(r) {
            function n(r, n, t, e) { if (h[t] !== r) { h[t] = r; var o = p[t]; if (o >= 0) { var a = g[t];
                        o === n && a === e || o === e && a === n || (++v, y[t] = 1) } else p[t] = n, g[t] = e } }

            function t(r) { return U(c[r]) }

            function e(r, n) { return N(c[r], c[n]) } var o, a, i, u, c = r.coordinates,
                f = r.lines,
                s = r.rings,
                l = function() { for (var r = F(1.4 * c.length, t, e, Int32Array, -1, Int32Array), n = new Int32Array(c.length), o = 0, a = c.length; o < a; ++o) n[o] = r.maybeSet(o, o); return n }(),
                h = new Int32Array(c.length),
                p = new Int32Array(c.length),
                g = new Int32Array(c.length),
                y = new Int8Array(c.length),
                v = 0; for (o = 0, a = c.length; o < a; ++o) h[o] = p[o] = g[o] = -1; for (o = 0, a = f.length; o < a; ++o) { var b = f[o],
                    m = b[0],
                    d = b[1]; for (i = l[m], u = l[++m], ++v, y[i] = 1; ++m <= d;) n(o, i, i = u, u = l[m]);++v, y[u] = 1 } for (o = 0, a = c.length; o < a; ++o) h[o] = -1; for (o = 0, a = s.length; o < a; ++o) { var M = s[o],
                    E = M[0] + 1,
                    P = M[1]; for (n(o, l[P - 1], i = l[E - 1], u = l[E]); ++E <= P;) n(o, i, i = u, u = l[E]) }
            h = p = g = null; var x, w = T(1.4 * v, U, N); for (o = 0, a = c.length; o < a; ++o) y[x = l[o]] && w.add(c[x]); return w },
        R = function(r) { var n, t, e, o = z(r),
                a = r.coordinates,
                i = r.lines,
                c = r.rings; for (t = 0, e = i.length; t < e; ++t)
                for (var f = i[t], s = f[0], l = f[1]; ++s < l;) o.has(a[s]) && (n = { 0: s, 1: f[1] }, f[1] = s, f = f.next = n); for (t = 0, e = c.length; t < e; ++t)
                for (var h = c[t], p = h[0], g = p, y = h[1], v = o.has(a[p]); ++g < y;) o.has(a[g]) && (v ? (n = { 0: g, 1: h[1] }, h[1] = g, h = h.next = n) : (u(a, p, y, y - g), a[y] = a[p], v = !0, g = p)); return r },
        V = function(r) {
            function n(r) { var n, o, a, i, u, c, f, s; if (a = y.get(n = l[r[0]]))
                    for (f = 0, s = a.length; f < s; ++f)
                        if (i = a[f], t(i, r)) return r[0] = i[0], void(r[1] = i[1]);
                if (u = y.get(o = l[r[1]]))
                    for (f = 0, s = u.length; f < s; ++f)
                        if (c = u[f], e(c, r)) return r[1] = c[0], void(r[0] = c[1]);
                a ? a.push(r) : y.set(n, [r]), u ? u.push(r) : y.set(o, [r]), v.push(r) }

            function t(r, n) { var t = r[0],
                    e = n[0],
                    o = r[1]; if (t - o != e - n[1]) return !1; for (; t <= o; ++t, ++e)
                    if (!N(l[t], l[e])) return !1;
                return !0 }

            function e(r, n) { var t = r[0],
                    e = n[0],
                    o = r[1],
                    a = n[1]; if (t - o != e - a) return !1; for (; t <= o; ++t, --a)
                    if (!N(l[t], l[a])) return !1;
                return !0 }

            function o(r, n) { var t = r[0],
                    e = n[0],
                    o = r[1] - t; if (o !== n[1] - e) return !1; for (var a = i(r), u = i(n), c = 0; c < o; ++c)
                    if (!N(l[t + (c + a) % o], l[e + (c + u) % o])) return !1;
                return !0 }

            function a(r, n) { var t = r[0],
                    e = n[0],
                    o = r[1],
                    a = n[1],
                    u = o - t; if (u !== a - e) return !1; for (var c = i(r), f = u - i(n), s = 0; s < u; ++s)
                    if (!N(l[t + (s + c) % u], l[a - (s + f) % u])) return !1;
                return !0 }

            function i(r) { for (var n = r[0], t = r[1], e = n, o = e, a = l[e]; ++e < t;) { var i = l[e];
                    (i[0] < a[0] || i[0] === a[0] && i[1] < a[1]) && (o = e, a = i) } return o - n } var u, c, f, s, l = r.coordinates,
                h = r.lines,
                p = r.rings,
                g = h.length + p.length; for (delete r.lines, delete r.rings, f = 0, s = h.length; f < s; ++f)
                for (u = h[f]; u = u.next;) ++g; for (f = 0, s = p.length; f < s; ++f)
                for (c = p[f]; c = c.next;) ++g; var y = F(2 * g * 1.4, U, N),
                v = r.arcs = []; for (f = 0, s = h.length; f < s; ++f) { u = h[f];
                do { n(u) } while (u = u.next) } for (f = 0, s = p.length; f < s; ++f)
                if ((c = p[f]).next)
                    do { n(c) } while (c = c.next);
                else(function(r) { var n, t, e, u, c; if (t = y.get(n = l[r[0]]))
                        for (u = 0, c = t.length; u < c; ++u) { if (e = t[u], o(e, r)) return r[0] = e[0], void(r[1] = e[1]); if (a(e, r)) return r[0] = e[1], void(r[1] = e[0]) }
                    if (t = y.get(n = l[r[0] + i(r)]))
                        for (u = 0, c = t.length; u < c; ++u) { if (e = t[u], o(e, r)) return r[0] = e[0], void(r[1] = e[1]); if (a(e, r)) return r[0] = e[1], void(r[1] = e[0]) }
                    t ? t.push(r) : y.set(n, [r]), v.push(r) })(c);
            return r },
        W = function(r) { for (var n = -1, t = r.length; ++n < t;) { for (var e, o, a = r[n], i = 0, u = 1, c = a.length, f = a[0], s = f[0], l = f[1]; ++i < c;) e = (f = a[i])[0], o = f[1], e === s && o === l || (a[u++] = [e - s, o - l], s = e, l = o);
                1 === u && (a[u++] = [0, 0]), a.length = u } return r },
        B = function(r) {
            function n(r) { r && f.hasOwnProperty(r.type) && f[r.type](r) }

            function t(r) { for (var n = 0, t = r.length; n < t; ++n) c[++a] = r[n]; var e = { 0: a - t + 1, 1: a }; return i.push(e), e }

            function e(r) { for (var n = 0, t = r.length; n < t; ++n) c[++a] = r[n]; var e = { 0: a - t + 1, 1: a }; return u.push(e), e }

            function o(r) { return r.map(e) } var a = -1,
                i = [],
                u = [],
                c = [],
                f = { GeometryCollection: function(r) { r.geometries.forEach(n) }, LineString: function(r) { r.arcs = t(r.arcs) }, MultiLineString: function(r) { r.arcs = r.arcs.map(t) }, Polygon: function(r) { r.arcs = r.arcs.map(e) }, MultiPolygon: function(r) { r.arcs = r.arcs.map(o) } }; for (var s in r) n(r[s]); return { type: "Topology", coordinates: c, lines: i, rings: u, objects: r } },
        D = function(r) { var n, t = {}; for (n in r) t[n] = f(r[n]); return t },
        H = function(r, n, t) {
            function e(r) { return [Math.round((r[0] - f) * p), Math.round((r[1] - s) * g)] }

            function o(r, n) { for (var t, e, o, a, i, u = -1, c = 0, l = r.length, h = new Array(l); ++u < l;) t = r[u], a = Math.round((t[0] - f) * p), i = Math.round((t[1] - s) * g), a === e && i === o || (h[c++] = [e = a, o = i]); for (h.length = c; c < n;) c = h.push([h[0][0], h[0][1]]); return h }

            function a(r) { return o(r, 2) }

            function i(r) { return o(r, 4) }

            function u(r) { return r.map(i) }

            function c(r) { null != r && y.hasOwnProperty(r.type) && y[r.type](r) } var f = n[0],
                s = n[1],
                l = n[2],
                h = n[3],
                p = l - f ? (t - 1) / (l - f) : 1,
                g = h - s ? (t - 1) / (h - s) : 1,
                y = { GeometryCollection: function(r) { r.geometries.forEach(c) }, Point: function(r) { r.coordinates = e(r.coordinates) }, MultiPoint: function(r) { r.coordinates = r.coordinates.map(e) }, LineString: function(r) { r.arcs = a(r.arcs) }, MultiLineString: function(r) { r.arcs = r.arcs.map(a) }, Polygon: function(r) { r.arcs = u(r.arcs) }, MultiPolygon: function(r) { r.arcs = r.arcs.map(u) } }; for (var v in r) c(r[v]); return { scale: [1 / p, 1 / g], translate: [f, s] } },
        J = function(r) {
            function n(r) { switch (r.type) {
                    case "GeometryCollection":
                        r.geometries.forEach(n); break;
                    case "LineString":
                        e(r.arcs); break;
                    case "MultiLineString":
                    case "Polygon":
                        r.arcs.forEach(e); break;
                    case "MultiPolygon":
                        r.arcs.forEach(o) } }

            function t(r) { r < 0 && (r = ~r), v[r] || (v[r] = 1, ++b) }

            function e(r) { r.forEach(t) }

            function o(r) { r.forEach(e) }

            function a(r) { var n; switch (r.type) {
                    case "GeometryCollection":
                        n = { type: "GeometryCollection", geometries: r.geometries.map(a) }; break;
                    case "LineString":
                        n = { type: "LineString", arcs: u(r.arcs) }; break;
                    case "MultiLineString":
                        n = { type: "MultiLineString", arcs: r.arcs.map(u) }; break;
                    case "Polygon":
                        n = { type: "Polygon", arcs: r.arcs.map(u) }; break;
                    case "MultiPolygon":
                        n = { type: "MultiPolygon", arcs: r.arcs.map(c) }; break;
                    default:
                        return r } return null != r.id && (n.id = r.id), null != r.bbox && (n.bbox = r.bbox), null != r.properties && (n.properties = r.properties), n }

            function i(r) { return r < 0 ? ~v[~r] : v[r] }

            function u(r) { return r.map(i) }

            function c(r) { return r.map(u) } var f, s, l = r.objects,
                h = {},
                p = r.arcs,
                g = p.length,
                y = -1,
                v = new Array(g),
                b = 0,
                m = -1; for (s in l) n(l[s]); for (f = new Array(b); ++y < g;) v[y] && (v[y] = ++m, f[m] = p[y]); for (s in l) h[s] = a(l[s]); return { type: "Topology", bbox: r.bbox, transform: r.transform, objects: h, arcs: f } },
        K = function(r) {
            function n(r) { switch (r.type) {
                    case "GeometryCollection":
                        r.geometries.forEach(n); break;
                    case "Polygon":
                        t(r.arcs); break;
                    case "MultiPolygon":
                        r.arcs.forEach(t) } }

            function t(r) { for (var n = 0, t = r.length; n < t; ++n, ++a)
                    for (var e = r[n], i = 0, u = e.length; i < u; ++i) { var c = e[i];
                        c < 0 && (c = ~c); var f = o[c];
                        null == f ? o[c] = a : f !== a && (o[c] = -1) } } var e, o = new Array(r.arcs.length),
                a = 0; for (e in r.objects) n(r.objects[e]); return function(r) { for (var n, t = 0, e = r.length; t < e; ++t)
                    if (-1 === o[(n = r[t]) < 0 ? ~n : n]) return !0;
                return !1 } },
        Q = function(r, n, t) { return n = null == n ? Number.MIN_VALUE : +n, null == t && (t = d),
                function(e, o) { return t(S(r, { type: "Polygon", arcs: [e] }).geometry.coordinates[0], o) >= n } },
        X = function() {
            function r(r, n) { for (; n > 0;) { var t = (n + 1 >> 1) - 1,
                        o = e[t]; if (M(r, o) >= 0) break;
                    e[o._ = n] = o, e[r._ = n = t] = r } }

            function n(r, n) { for (;;) { var t = n + 1 << 1,
                        a = t - 1,
                        i = n,
                        u = e[i]; if (a < o && M(e[a], u) < 0 && (u = e[i = a]), t < o && M(e[t], u) < 0 && (u = e[i = t]), i === n) break;
                    e[u._ = n] = u, e[r._ = n = i] = r } } var t = {},
                e = [],
                o = 0; return t.push = function(n) { return r(e[n._ = o] = n, o++), o }, t.pop = function() { if (!(o <= 0)) { var r, t = e[0]; return --o > 0 && (r = e[o], n(e[r._ = 0] = r, 0)), t } }, t.remove = function(t) { var a, i = t._; if (e[i] === t) return i !== --o && (a = e[o], (M(a, t) < 0 ? r : n)(e[a._ = i] = a, i)), i }, t },
        Y = Math.PI,
        Z = 2 * Y,
        $ = Y / 4,
        rr = Y / 180,
        nr = Math.abs,
        tr = Math.atan2,
        er = Math.cos,
        or = Math.sin;
    r.bbox = L, r.feature = S, r.mesh = function(r) { return t(r, e.apply(this, arguments)) }, r.meshArcs = e, r.merge = function(r) { return t(r, i.apply(this, arguments)) }, r.mergeArcs = i, r.neighbors = function(r) {
        function n(r, n) { r.forEach(function(r) { r < 0 && (r = ~r); var t = o[r];
                t ? t.push(n) : o[r] = [n] }) }

        function t(r, t) { r.forEach(function(r) { n(r, t) }) }

        function e(r, n) { "GeometryCollection" === r.type ? r.geometries.forEach(function(r) { e(r, n) }) : r.type in i && i[r.type](r.arcs, n) } var o = {},
            a = r.map(function() { return [] }),
            i = { LineString: n, MultiLineString: t, Polygon: t, MultiPolygon: function(r, n) { r.forEach(function(r) { t(r, n) }) } };
        r.forEach(e); for (var u in o)
            for (var c = o[u], f = c.length, s = 0; s < f; ++s)
                for (var l = s + 1; l < f; ++l) { var h, p = c[s],
                        g = c[l];
                    (h = a[p])[u = j(h, g)] !== g && h.splice(u, 0, g), (h = a[g])[u = j(h, p)] !== p && h.splice(u, 0, p) }
        return a }, r.quantize = function(r, n) {
        function t(r) { return l(r) }

        function e(r) { var n; switch (r.type) {
                case "GeometryCollection":
                    n = { type: "GeometryCollection", geometries: r.geometries.map(e) }; break;
                case "Point":
                    n = { type: "Point", coordinates: t(r.coordinates) }; break;
                case "MultiPoint":
                    n = { type: "MultiPoint", coordinates: r.coordinates.map(t) }; break;
                default:
                    return r } return null != r.id && (n.id = r.id), null != r.bbox && (n.bbox = r.bbox), null != r.properties && (n.properties = r.properties), n } if (r.transform) throw new Error("already quantized"); if (n && n.scale) f = r.bbox;
        else { if (!((o = Math.floor(n)) >= 2)) throw new Error("n must be ≥2"); var o, a = (f = r.bbox || L(r))[0],
                i = f[1],
                u = f[2],
                c = f[3];
            n = { scale: [u - a ? (u - a) / (o - 1) : 1, c - i ? (c - i) / (o - 1) : 1], translate: [a, i] } } var f, s, l = _(n),
            h = r.objects,
            p = {}; for (s in h) p[s] = e(h[s]); return { type: "Topology", bbox: f, transform: n, objects: p, arcs: r.arcs.map(function(r) { var n, t = 0,
                    e = 1,
                    o = r.length,
                    a = new Array(o); for (a[0] = l(r[0], 0); ++t < o;)((n = l(r[t], t))[0] || n[1]) && (a[e++] = n); return 1 === e && (a[e++] = [0, 0]), a.length = e, a }) } }, r.transform = A, r.untransform = _, r.topology = function(r, n) {
        function t(r) { r && s.hasOwnProperty(r.type) && s[r.type](r) }

        function e(r) { var n = [];
            do { var t = f.get(r);
                n.push(r[0] < r[1] ? t : ~t) } while (r = r.next); return n }

        function o(r) { return r.map(e) } var a = I(r = D(r)),
            i = n > 0 && a && H(r, a, n),
            u = V(R(B(r))),
            c = u.coordinates,
            f = F(1.4 * u.arcs.length, p, g);
        r = u.objects, u.bbox = a, u.arcs = u.arcs.map(function(r, n) { return f.set(r, n), c.slice(r[0], r[1] + 1) }), delete u.coordinates, c = null; var s = { GeometryCollection: function(r) { r.geometries.forEach(t) }, LineString: function(r) { r.arcs = e(r.arcs) }, MultiLineString: function(r) { r.arcs = r.arcs.map(e) }, Polygon: function(r) { r.arcs = r.arcs.map(e) }, MultiPolygon: function(r) { r.arcs = r.arcs.map(o) } }; for (var l in r) t(r[l]); return i && (u.transform = i, u.arcs = W(u.arcs)), u }, r.filter = function(r, n) {
        function t(r) { var n, o; switch (r.type) {
                case "Polygon":
                    n = (o = e(r.arcs)) ? { type: "Polygon", arcs: o } : { type: null }; break;
                case "MultiPolygon":
                    n = (o = r.arcs.map(e).filter(v)).length ? { type: "MultiPolygon", arcs: o } : { type: null }; break;
                case "GeometryCollection":
                    n = (o = r.geometries.map(t).filter(b)).length ? { type: "GeometryCollection", geometries: o } : { type: null }; break;
                default:
                    return r } return null != r.id && (n.id = r.id), null != r.bbox && (n.bbox = r.bbox), null != r.properties && (n.properties = r.properties), n }

        function e(r) { return r.length && o(r[0]) ? [r[0]].concat(r.slice(1).filter(a)) : null }

        function o(r) { return n(r, !1) }

        function a(r) { return n(r, !0) } var i, u = r.objects,
            c = {};
        null == n && (n = y); for (i in u) c[i] = t(u[i]); return J({ type: "Topology", bbox: r.bbox, transform: r.transform, objects: c, arcs: r.arcs }) }, r.filterAttached = K, r.filterAttachedWeight = function(r, n, t) { var e = K(r),
            o = Q(r, n, t); return function(r, n) { return e(r, n) || o(r, n) } }, r.filterWeight = Q, r.planarRingArea = d, r.planarTriangleArea = m, r.presimplify = function(r, n) {
        function t(r) { o.remove(r), r[1][2] = n(r), o.push(r) } var e = r.transform ? A(r.transform) : E,
            o = X();
        null == n && (n = m); var a = r.arcs.map(function(r) { var a, i, u, c = [],
                f = 0; for (i = 1, u = (r = r.map(e)).length - 1; i < u; ++i)(a = [r[i - 1], r[i], r[i + 1]])[1][2] = n(a), c.push(a), o.push(a); for (r[0][2] = r[u][2] = 1 / 0, i = 0, u = c.length; i < u; ++i)(a = c[i]).previous = c[i - 1], a.next = c[i + 1]; for (; a = o.pop();) { var s = a.previous,
                    l = a.next;
                a[1][2] < f ? a[1][2] = f : f = a[1][2], s && (s.next = l, s[2] = a[2], t(s)), l && (l.previous = s, l[0] = a[0], t(l)) } return r }); return { type: "Topology", bbox: r.bbox, objects: r.objects, arcs: a } }, r.quantile = function(r, n) { var t = []; return r.arcs.forEach(function(r) { r.forEach(function(r) { isFinite(r[2]) && t.push(r[2]) }) }), t.length && P(t.sort(x), n) }, r.simplify = function(r, n) { n = null == n ? Number.MIN_VALUE : +n; var t = r.arcs.map(function(r) { for (var t, e = -1, o = 0, a = r.length, i = new Array(a); ++e < a;)(t = r[e])[2] >= n && (i[o++] = [t[0], t[1]]); return i.length = o, i }); return { type: "Topology", transform: r.transform, bbox: r.bbox, objects: r.objects, arcs: t } }, r.sphericalRingArea = function(r, n) { var t = w(r, !0); return n && (t *= -1), 2 * (t < 0 ? Z + t : t) }, r.sphericalTriangleArea = function(r) { return 2 * nr(w(r, !1)) }, Object.defineProperty(r, "__esModule", { value: !0 }) });