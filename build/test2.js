! function(e, t) {
    "object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? exports.HumanConnect = t() : e.HumanConnect = t()
}(window, function() {
    return function(e) {
        var t = {};

        function n(o) {
            if (t[o]) return t[o].exports;
            var r = t[o] = {
                i: o,
                l: !1,
                exports: {}
            };
            return e[o].call(r.exports, r, r.exports, n), r.l = !0, r.exports
        }
        return n.m = e, n.c = t, n.d = function(e, t, o) {
            n.o(e, t) || Object.defineProperty(e, t, {
                enumerable: !0,
                get: o
            })
        }, n.r = function(e) {
            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
                value: "Module"
            }), Object.defineProperty(e, "__esModule", {
                value: !0
            })
        }, n.t = function(e, t) {
            if (1 & t && (e = n(e)), 8 & t) return e;
            if (4 & t && "object" == typeof e && e && e.__esModule) return e;
            var o = Object.create(null);
            if (n.r(o), Object.defineProperty(o, "default", {
                    enumerable: !0,
                    value: e
                }), 2 & t && "string" != typeof e)
                for (var r in e) n.d(o, r, function(t) {
                    return e[t]
                }.bind(null, r));
            return o
        }, n.n = function(e) {
            var t = e && e.__esModule ? function() {
                return e.default
            } : function() {
                return e
            };
            return n.d(t, "a", t), t
        }, n.o = function(e, t) {
            return Object.prototype.hasOwnProperty.call(e, t)
        }, n.p = "", n(n.s = 0)
    }([function(e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var o = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
            return typeof e
        } : function(e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
        };
        t.open = function() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
            if (Element.prototype.remove = function() {
                    this.parentElement.removeChild(this)
                }, NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
                    for (var e = this.length - 1; e >= 0; e--) this[e] && this[e].parentElement && this[e].parentElement.removeChild(this[e])
                }, document.getElementById("human-api")) return null;
            if (!e.token) throw new Error("The token attribute is required");
            if ("object" !== (void 0 === e ? "undefined" : o(e)) || Array.isArray(e)) throw new Error("Argument must be an object");
            e.__baseURL = e.__baseURL || "https://hapi-connect.humanapi.co";
            window.addEventListener("message", function t(n) {
                var o = n.data;
                "hapi-connect-close" === o.type && (document.getElementById("human-api").remove(), document.getElementById("human-api-connect-modal-overlay").remove(), delete o.type, e.onClose && e.onClose(o), window.removeEventListener("resize", i), window.removeEventListener("message", t, !1))
            }, !1);
            var t = e && e.overlayOpacity ? e.overlayOpacity : "0.6",
                n = document.createElement("iframe");
            n.src = e.__baseURL + "/?token=" + e.token, e.mode && (n.src = n.src + "&mode=" + e.mode);
            if ("select" === e.mode) {
                var r = e.preseededSources || [];
                n.src = n.src + "&clientId=" + e.clientId + "&preseededSources=" + btoa(JSON.stringify(r))
            }
            n.id = "human-api", n.style.position = "fixed", n.style.zIndex = "9999", n.style.margin = "0", n.style.padding = "0", n.style.border = "none", n.style.visibility = "visible", n.style.background = "#fff url(" + e.__baseURL + "/images/data-source-type-icons/launch-connect-text.svg) no-repeat center center";
            var i = function() {
                window.innerWidth >= 700 && window.innerHeight >= 500 ? (n.style.height = "100%", n.style.maxHeight = "500px", n.style.width = "100%", n.style.maxWidth = "700px", n.style.borderRadius = "8px", n.style.left = "calc(50% - 350px)", n.style.top = "calc(50% - 250px)", n.style.borderRadius = "8px") : (n.style.width = "100%", n.style.maxWidth = "100%", n.style.height = "100%", n.style.maxHeight = "100%", n.style.top = "0", n.style.left = "0", n.style.borderRadius = "none")
            };
            i(), window.addEventListener("resize", i);
            var l = document.createElement("div");
            l.id = "human-api-connect-modal-overlay", l.style.position = "fixed", l.style.width = "100%", l.style.height = "100%", l.style.top = "0", l.style.zIndex = 9990, l.style.backgroundColor = "#333", l.style.opacity = t;
            var s = document.getElementsByTagName("body")[0] || document.documentElement;
            s.appendChild(n), s.appendChild(l)
        }
    }])
});