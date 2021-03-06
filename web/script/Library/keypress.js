/*
 Keypress version 2.0.1 (c) 2014 David Mauro.
 Licensed under the Apache License, Version 2.0
 http://www.apache.org/licenses/LICENSE-2.0
 */
(function () {
    var u, w, x, y, p, v, C, D, E, F, q, r, o, k, s, z, G, A = {}.hasOwnProperty, i = [].indexOf || function (a) {
        for (var c = 0, b = this.length; c < b; c++)if (c in this && this[c] === a)return c;
        return-1
    };
    p = {is_unordered: !1, is_counting: !1, is_exclusive: !1, is_solitary: !1, prevent_default: !1, prevent_repeat: !1};
    z = "meta alt option ctrl shift cmd".split(" ");
    k = "ctrl";
    window.keypress = {};
    keypress.debug = !1;
    var B = function (a) {
        var c, b;
        for (c in a)A.call(a, c) && (b = a[c], !1 !== b && (this[c] = b));
        this.keys = this.keys || [];
        this.count = this.count || 0
    };
    B.prototype.allows_key_repeat =
        function () {
            return!this.prevent_repeat && "function" === typeof this.on_keydown
        };
    B.prototype.reset = function () {
        this.count = 0;
        return this.keyup_fired = null
    };
    var H = keypress, f = function (a, c) {
        var b, d, e = this;
        this.should_force_event_defaults = this.should_suppress_event_defaults = !1;
        this.sequence_delay = 800;
        this._registered_combos = [];
        this._keys_down = [];
        this._active_combos = [];
        this._sequence = [];
        this._sequence_timer = null;
        this._prevent_capture = !1;
        this._defaults = c || {};
        for (b in p)A.call(p, b) && (d = p[b], this._defaults[b] = this._defaults[b] ||
            d);
        a = a || document.body;
        b = function (a, b, c) {
            if (a.addEventListener)return a.addEventListener(b, c);
            if (a.attachEvent)return a.attachEvent("on" + b, c)
        };
        b(a, "keydown", function (a) {
            a = a || window.event;
            e._receive_input(a, !0);
            return e._bug_catcher(a)
        });
        b(a, "keyup", function (a) {
            a = a || window.event;
            return e._receive_input(a, !1)
        });
        b(window, "blur", function () {
            var a, b, c, d;
            d = e._keys_down;
            b = 0;
            for (c = d.length; b < c; b++)a = d[b], e._key_up(a, {});
            return e._keys_down = []
        })
    };
    f.prototype._bug_catcher = function (a) {
        var c;
        if ("cmd" === k && 0 <= i.call(this._keys_down,
            "cmd") && "cmd" !== (c = x(a.keyCode)) && "shift" !== c && "alt" !== c && "caps" !== c && "tab" !== c)return this._receive_input(a, !1)
    };
    f.prototype._cmd_bug_check = function (a) {
        return"cmd" === k && 0 <= i.call(this._keys_down, "cmd") && 0 > i.call(a, "cmd") ? !1 : !0
    };
    f.prototype._prevent_default = function (a, c) {
        if ((c || this.should_suppress_event_defaults) && !this.should_force_event_defaults)if (a.preventDefault ? a.preventDefault() : a.returnValue = !1, a.stopPropagation)return a.stopPropagation()
    };
    f.prototype._get_active_combos = function (a) {
        var c,
            b, d = this;
        c = [];
        b = v(this._keys_down, function (b) {
            return b !== a
        });
        b.push(a);
        this._match_combo_arrays(b, function (a) {
            if (d._cmd_bug_check(a.keys))return c.push(a)
        });
        this._fuzzy_match_combo_arrays(b, function (a) {
            if (!(0 <= i.call(c, a)) && !a.is_solitary && d._cmd_bug_check(a.keys))return c.push(a)
        });
        return c
    };
    f.prototype._get_potential_combos = function (a) {
        var c, b, d, e, g;
        b = [];
        g = this._registered_combos;
        d = 0;
        for (e = g.length; d < e; d++)c = g[d], c.is_sequence || 0 <= i.call(c.keys, a) && this._cmd_bug_check(c.keys) && b.push(c);
        return b
    };
    f.prototype._add_to_active_combos = function (a) {
        var c, b, d, e, g, j, h, f, n, l, m;
        j = !1;
        g = !0;
        d = !1;
        if (0 <= i.call(this._active_combos, a))return!0;
        if (this._active_combos.length) {
            e = h = 0;
            for (l = this._active_combos.length; 0 <= l ? h < l : h > l; e = 0 <= l ? ++h : --h)if ((c = this._active_combos[e]) && c.is_exclusive && a.is_exclusive) {
                c = c.keys;
                if (!j) {
                    f = 0;
                    for (n = c.length; f < n; f++)if (b = c[f], j = !0, 0 > i.call(a.keys, b)) {
                        j = !1;
                        break
                    }
                }
                if (g && !j) {
                    m = a.keys;
                    f = 0;
                    for (n = m.length; f < n; f++)if (b = m[f], g = !1, 0 > i.call(c, b)) {
                        g = !0;
                        break
                    }
                }
                j && (d ? (c = this._active_combos.splice(e,
                    1)[0], null != c && c.reset()) : (c = this._active_combos.splice(e, 1, a)[0], null != c && c.reset(), d = !0), g = !1)
            }
        }
        g && this._active_combos.unshift(a);
        return j || g
    };
    f.prototype._remove_from_active_combos = function (a) {
        var c, b, d, e;
        b = d = 0;
        for (e = this._active_combos.length; 0 <= e ? d < e : d > e; b = 0 <= e ? ++d : --d)if (c = this._active_combos[b], c === a) {
            a = this._active_combos.splice(b, 1)[0];
            a.reset();
            break
        }
    };
    f.prototype._get_possible_sequences = function () {
        var a, c, b, d, e, g, j, h, f, n, l, m;
        d = [];
        n = this._registered_combos;
        g = 0;
        for (f = n.length; g < f; g++) {
            a =
                n[g];
            c = j = 1;
            for (l = this._sequence.length; 1 <= l ? j <= l : j >= l; c = 1 <= l ? ++j : --j)if (e = this._sequence.slice(-c), a.is_sequence) {
                if (0 > i.call(a.keys, "shift") && (e = v(e, function (a) {
                    return"shift" !== a
                }), !e.length))continue;
                c = h = 0;
                for (m = e.length; 0 <= m ? h < m : h > m; c = 0 <= m ? ++h : --h)if (a.keys[c] === e[c])b = !0; else {
                    b = !1;
                    break
                }
                b && d.push(a)
            }
        }
        return d
    };
    f.prototype._add_key_to_sequence = function (a, c) {
        var b, d, e, g;
        this._sequence.push(a);
        d = this._get_possible_sequences();
        if (d.length) {
            e = 0;
            for (g = d.length; e < g; e++)b = d[e], this._prevent_default(c,
                b.prevent_default);
            this._sequence_timer && clearTimeout(this._sequence_timer);
            -1 < this.sequence_delay && (this._sequence_timer = setTimeout(function () {
                return this._sequence = []
            }, this.sequence_delay))
        } else this._sequence = []
    };
    f.prototype._get_sequence = function (a) {
        var c, b, d, e, g, j, f, t, n, l, m, k;
        l = this._registered_combos;
        j = 0;
        for (n = l.length; j < n; j++)if (c = l[j], c.is_sequence) {
            b = f = 1;
            for (m = this._sequence.length; 1 <= m ? f <= m : f >= m; b = 1 <= m ? ++f : --f)if (g = v(this._sequence,function (a) {
                return 0 <= i.call(c.keys, "shift") ? !0 : "shift" !==
                    a
            }).slice(-b), c.keys.length === g.length) {
                b = t = 0;
                for (k = g.length; 0 <= k ? t < k : t > k; b = 0 <= k ? ++t : --t)if (e = g[b], !(0 > i.call(c.keys, "shift") && "shift" === e) && !("shift" === a && 0 > i.call(c.keys, "shift")))if (c.keys[b] === e)d = !0; else {
                    d = !1;
                    break
                }
            }
            if (d)return c
        }
        return!1
    };
    f.prototype._receive_input = function (a, c) {
        var b;
        if (this._prevent_capture)this._keys_down.length && (this._keys_down = []); else if (b = x(a.keyCode), (c || this._keys_down.length || !("alt" === b || b === k)) && b)return c ? this._key_down(b, a) : this._key_up(b, a)
    };
    f.prototype._fire =
        function (a, c, b, d) {
            "function" === typeof c["on_" + a] && this._prevent_default(b, !0 !== c["on_" + a].call(c["this"], b, c.count, d));
            "release" === a && (c.count = 0);
            if ("keyup" === a)return c.keyup_fired = !0
        };
    f.prototype._match_combo_arrays = function (a, c) {
        var b, d, e, g;
        g = this._registered_combos;
        d = 0;
        for (e = g.length; d < e; d++)b = g[d], (!b.is_unordered && w(a, b.keys) || b.is_unordered && u(a, b.keys)) && c(b)
    };
    f.prototype._fuzzy_match_combo_arrays = function (a, c) {
        var b, d, e, g;
        g = this._registered_combos;
        d = 0;
        for (e = g.length; d < e; d++)b = g[d], (!b.is_unordered &&
            D(b.keys, a) || b.is_unordered && C(b.keys, a)) && c(b)
    };
    f.prototype._keys_remain = function (a) {
        var c, b, d, e;
        e = a.keys;
        b = 0;
        for (d = e.length; b < d; b++)if (a = e[b], 0 <= i.call(this._keys_down, a)) {
            c = !0;
            break
        }
        return c
    };
    f.prototype._key_down = function (a, c) {
        var b, d, e, g, j;
        (b = y(a, c)) && (a = b);
        this._add_key_to_sequence(a, c);
        (b = this._get_sequence(a)) && this._fire("keydown", b, c);
        for (e in s)b = s[e], c[b] && (e === a || 0 <= i.call(this._keys_down, e) || this._keys_down.push(e));
        for (e in s)if (b = s[e], e !== a && 0 <= i.call(this._keys_down, e) && !c[b] && !("cmd" ===
            e && "cmd" !== k)) {
            b = d = 0;
            for (g = this._keys_down.length; 0 <= g ? d < g : d > g; b = 0 <= g ? ++d : --d)this._keys_down[b] === e && this._keys_down.splice(b, 1)
        }
        d = this._get_active_combos(a);
        e = this._get_potential_combos(a);
        g = 0;
        for (j = d.length; g < j; g++)b = d[g], this._handle_combo_down(b, e, a, c);
        if (e.length) {
            d = 0;
            for (g = e.length; d < g; d++)b = e[d], this._prevent_default(c, b.prevent_default)
        }
        0 > i.call(this._keys_down, a) && this._keys_down.push(a)
    };
    f.prototype._handle_combo_down = function (a, c, b, d) {
        var e, g, j, f, k;
        if (0 > i.call(a.keys, b))return!1;
        this._prevent_default(d,
            a && a.prevent_default);
        e = !1;
        if (0 <= i.call(this._keys_down, b) && (e = !0, !a.allows_key_repeat()))return!1;
        j = this._add_to_active_combos(a, b);
        b = a.keyup_fired = !1;
        if (a.is_exclusive) {
            f = 0;
            for (k = c.length; f < k; f++)if (g = c[f], g.is_exclusive && g.keys.length > a.keys.length) {
                b = !0;
                break
            }
        }
        if (!b && (a.is_counting && "function" === typeof a.on_keydown && (a.count += 1), j))return this._fire("keydown", a, d, e)
    };
    f.prototype._key_up = function (a, c) {
        var b, d, e, g, f, h;
        b = a;
        (e = y(a, c)) && (a = e);
        e = r[b];
        c.shiftKey ? e && 0 <= i.call(this._keys_down, e) || (a = b) :
            b && 0 <= i.call(this._keys_down, b) || (a = e);
        (g = this._get_sequence(a)) && this._fire("keyup", g, c);
        if (0 > i.call(this._keys_down, a))return!1;
        g = f = 0;
        for (h = this._keys_down.length; 0 <= h ? f < h : f > h; g = 0 <= h ? ++f : --f)if ((d = this._keys_down[g]) === a || d === e || d === b) {
            this._keys_down.splice(g, 1);
            break
        }
        d = this._active_combos.length;
        e = [];
        h = this._active_combos;
        g = 0;
        for (f = h.length; g < f; g++)b = h[g], 0 <= i.call(b.keys, a) && e.push(b);
        g = 0;
        for (f = e.length; g < f; g++)b = e[g], this._handle_combo_up(b, c, a);
        if (1 < d) {
            f = this._active_combos;
            d = 0;
            for (g = f.length; d <
                g; d++)b = f[d], void 0 === b || 0 <= i.call(e, b) || this._keys_remain(b) || this._remove_from_active_combos(b)
        }
    };
    f.prototype._handle_combo_up = function (a, c, b) {
        var d, e;
        this._prevent_default(c, a && a.prevent_default);
        e = this._keys_remain(a);
        if (!a.keyup_fired && (d = this._keys_down.slice(), d.push(b), !a.is_solitary || u(d, a.keys)))this._fire("keyup", a, c), a.is_counting && ("function" === typeof a.on_keyup && "function" !== typeof a.on_keydown) && (a.count += 1);
        e || (this._fire("release", a, c), this._remove_from_active_combos(a))
    };
    f.prototype.simple_combo =
        function (a, c) {
            return this.register_combo({keys: a, on_keydown: c})
        };
    f.prototype.counting_combo = function (a, c) {
        return this.register_combo({keys: a, is_counting: !0, is_unordered: !1, on_keydown: c})
    };
    f.prototype.sequence_combo = function (a, c) {
        return this.register_combo({keys: a, on_keydown: c, is_sequence: !0})
    };
    f.prototype.register_combo = function (a) {
        var c, b, d;
        "string" === typeof a.keys && (a.keys = a.keys.split(" "));
        d = this._defaults;
        for (c in d)A.call(d, c) && (b = d[c], void 0 === a[c] && (a[c] = b));
        a = new B(a);
        if (G(a))return this._registered_combos.push(a),
            !0
    };
    f.prototype.register_many = function (a) {
        var c, b, d, e;
        e = [];
        b = 0;
        for (d = a.length; b < d; b++)c = a[b], e.push(this.register_combo(c));
        return e
    };
    f.prototype.unregister_combo = function (a) {
        var c, b, d, e, g, f = this;
        if (!a)return!1;
        b = function (a) {
            var b, c, d, e;
            e = [];
            b = c = 0;
            for (d = f._registered_combos.length; 0 <= d ? c < d : c > d; b = 0 <= d ? ++c : --c)if (a === f._registered_combos[b]) {
                f._registered_combos.splice(b, 1);
                break
            } else e.push(void 0);
            return e
        };
        if (a.keys)return b(a);
        g = this._registered_combos;
        d = 0;
        for (e = g.length; d < e; d++)c = g[d];
        "string" === typeof a && (a = a.split(" "));
        if (c.is_unordered && u(a, c.keys) || !c.is_unordered && w(a, c.keys))return b(c)
    };
    f.prototype.unregister_many = function (a) {
        var c, b, d, e;
        e = [];
        b = 0;
        for (d = a.length; b < d; b++)c = a[b], e.push(this.unregister_combo(c));
        return e
    };
    f.prototype.get_registered_combos = function () {
        return this._registered_combos
    };
    f.prototype.reset = function () {
        return this._registered_combos = []
    };
    f.prototype.listen = function () {
        return this._prevent_capture = !1
    };
    f.prototype.stop_listening = function () {
        return this._prevent_capture = !0
    };
    f.prototype.get_meta_key = function () {
        return k
    };
    H.Listener = f;
    x = function (a) {
        return q[a]
    };
    v = function (a, c) {
        var b;
        if (a.filter)return a.filter(c);
        var d, e, g;
        g = [];
        d = 0;
        for (e = a.length; d < e; d++)b = a[d], c(b) && g.push(b);
        return g
    };
    u = function (a, c) {
        var b, d, e;
        if (a.length !== c.length)return!1;
        d = 0;
        for (e = a.length; d < e; d++)if (b = a[d], !(0 <= i.call(c, b)))return!1;
        return!0
    };
    w = function (a, c) {
        var b, d, e;
        if (a.length !== c.length)return!1;
        b = d = 0;
        for (e = a.length; 0 <= e ? d < e : d > e; b = 0 <= e ? ++d : --d)if (a[b] !== c[b])return!1;
        return!0
    };
    C = function (a, c) {
        var b, d, e;
        d = 0;
        for (e = a.length; d < e; d++)if (b = a[d], 0 > i.call(c, b))return!1;
        return!0
    };
    D = function (a, c) {
        var b, d, e, g;
        e = d = 0;
        for (g = a.length; e < g; e++)if (b = a[e], b = c.indexOf(b), b >= d)d = b; else return!1;
        return!0
    };
    o = function () {
        if (keypress.debug)return console.log.apply(console, arguments)
    };
    E = function (a) {
        var c, b, d;
        c = !1;
        for (d in q)if (b = q[d], a === b) {
            c = !0;
            break
        }
        if (!c)for (d in r)if (b = r[d], a === b) {
            c = !0;
            break
        }
        return c
    };
    G = function (a) {
        var c, b, d, e, g, f, h;
        g = !0;
        a.keys.length || o("You're trying to bind a combo with no keys:", a);
        b =
            f = 0;
        for (h = a.keys.length; 0 <= h ? f < h : f > h; b = 0 <= h ? ++f : --f)d = a.keys[b], (c = F[d]) && (d = a.keys[b] = c), "meta" === d && a.keys.splice(b, 1, k), "cmd" === d && o('Warning: use the "meta" key rather than "cmd" for Windows compatibility');
        h = a.keys;
        c = 0;
        for (f = h.length; c < f; c++)d = h[c], E(d) || (o('Do not recognize the key "' + d + '"'), g = !1);
        if (0 <= i.call(a.keys, "meta") || 0 <= i.call(a.keys, "cmd")) {
            c = a.keys.slice();
            f = 0;
            for (h = z.length; f < h; f++)d = z[f], -1 < (b = c.indexOf(d)) && c.splice(b, 1);
            1 < c.length && (o("META and CMD key combos cannot have more than 1 non-modifier keys",
                a, c), g = !1)
        }
        for (e in a)"undefined" === p[e] && o("The property " + e + " is not a valid combo property. Your combo has still been registered.");
        return g
    };
    y = function (a, c) {
        var b;
        if (!c.shiftKey)return!1;
        b = r[a];
        return null != b ? b : !1
    };
    s = {cmd: "metaKey", ctrl: "ctrlKey", shift: "shiftKey", alt: "altKey"};
    F = {escape: "esc", control: "ctrl", command: "cmd", "break": "pause", windows: "cmd", option: "alt", caps_lock: "caps", apostrophe: "'", semicolon: ";", tilde: "~", accent: "`", scroll_lock: "scroll", num_lock: "num"};
    r = {"/": "?", ".": ">", ",": "<",
        "'": '"', ";": ":", "[": "{", "]": "}", "\\": "|", "`": "~", "=": "+", "-": "_", 1: "!", 2: "@", 3: "#", 4: "$", 5: "%", 6: "^", 7: "&", 8: "*", 9: "(", "0": ")"};
    q = {"0": "\\", 8: "backspace", 9: "tab", 12: "num", 13: "enter", 16: "shift", 17: "ctrl", 18: "alt", 19: "pause", 20: "caps", 27: "esc", 32: "space", 33: "pageup", 34: "pagedown", 35: "end", 36: "home", 37: "left", 38: "up", 39: "right", 40: "down", 44: "print", 45: "insert", 46: "delete", 48: "0", 49: "1", 50: "2", 51: "3", 52: "4", 53: "5", 54: "6", 55: "7", 56: "8", 57: "9", 65: "a", 66: "b", 67: "c", 68: "d", 69: "e", 70: "f", 71: "g", 72: "h", 73: "i",
        74: "j", 75: "k", 76: "l", 77: "m", 78: "n", 79: "o", 80: "p", 81: "q", 82: "r", 83: "s", 84: "t", 85: "u", 86: "v", 87: "w", 88: "x", 89: "y", 90: "z", 91: "cmd", 92: "cmd", 93: "cmd", 96: "num_0", 97: "num_1", 98: "num_2", 99: "num_3", 100: "num_4", 101: "num_5", 102: "num_6", 103: "num_7", 104: "num_8", 105: "num_9", 106: "num_multiply", 107: "num_add", 108: "num_enter", 109: "num_subtract", 110: "num_decimal", 111: "num_divide", 124: "print", 144: "num", 145: "scroll", 186: ";", 187: "=", 188: ",", 189: "-", 190: ".", 191: "/", 192: "`", 219: "[", 220: "\\", 221: "]", 222: "'", 223: "`", 224: "cmd",
        225: "alt", 57392: "ctrl", 63289: "num"};
    -1 !== navigator.userAgent.indexOf("Mac OS X") && (k = "cmd");
    -1 !== navigator.userAgent.indexOf("Opera") && (q["17"] = "cmd")
}).call(this);