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
            try {
                var t = function(e) {
                    var t = e.logger,
                        n = void 0 === t ? function() {} : t;
                    if (document.getElementById("human-api")) return null;
                    if (!e.token) throw new Error("The token attribute is required");
                    if (!e || "object" !== (void 0 === e ? "undefined" : o(e)) || Array.isArray(e)) throw new Error("Argument must be an object");
                    e.__baseURL = e.baseURL || "https://hapi-connect.humanapi.co";
                    var s = document.createElement("iframe"),
                        l = document.createElement("div");

                    function u() {
                        n("Responding to window resize");
                        var e = s;
                        e.style.width = "100%", e.style.height = "100%", window.innerWidth >= r && window.innerHeight >= i ? (e.style.maxHeight = i + "px", e.style.maxWidth = r + "px", e.style.left = "calc(50% - 350px)", e.style.top = "calc(50% - 250px)", e.style.borderRadius = "8px") : (e.style.maxWidth = "100%", e.style.maxHeight = "100%", e.style.top = "0", e.style.left = "0", e.style.borderRadius = "none")
                    }

                    function a(t) {
                        var o = t.data;
                        n("Responding to postMessage", o);
                        var r = function(t) {
                            return delete o.type, e[t] instanceof Function ? e[t](o) : null
                        };
                        switch (o.type.replace("hapi-connect-", "")) {
                            case "connect-source":
                                r("onConnectSource");
                                break;
                            case "disconnect-source":
                                r("onDisconnectSource");
                                break;
                            case "close":
                                r("onClose"), n("Cleaning up elements"), document.getElementById("human-api").remove(), document.getElementById("human-api-connect-modal-overlay").remove(), n("Unmounting listeners"), window.removeEventListener("resize", u), window.removeEventListener("message", a, !1)
                        }
                    }
                    return {
                        mount: function() {
                            return function() {
                                    n("Building iframe");
                                    var t = s;
                                    t.src = e.__baseURL + "/?token=" + e.token, e.inviteSessionId && (t.src += "&pisId=" + e.inviteSessionId);
                                    e.mode && (t.src += "&mode=" + e.mode);
                                    if ("select" === e.mode) {
                                        var o = e.preseededSources || [];
                                        t.src += "&clientId=" + e.clientId + "&preseededSources=" + btoa(JSON.stringify(o))
                                    }
                                    t.id = "human-api", t.style.position = "fixed", t.style.zIndex = "9999", t.style.margin = "0", t.style.padding = "0", t.style.border = "none", t.style.visibility = "visible", t.style.background = "#fff url(" + e.__baseURL + "/images/data-source-type-icons/launch-connect-text.svg) no-repeat center center", u()
                                }(),
                                function() {
                                    n("Building modal overlay");
                                    var t = l,
                                        o = e.overlayOpacity || "0.6";
                                    t.id = "human-api-connect-modal-overlay", t.style.position = "fixed", t.style.width = "100%", t.style.height = "100%", t.style.top = "0", t.style.zIndex = 9990, t.style.backgroundColor = "#333", t.style.opacity = o
                                }(), n("Mounting listeners"), window.addEventListener("message", a, !1), window.addEventListener("resize", u), {
                                    iframe: s,
                                    modal: l
                                }
                        }
                    }
                }(e);
                if (!t) return null;
                var n = t.mount(),
                    s = n.iframe,
                    l = n.modal,
                    u = document.getElementsByTagName("body")[0] || document.documentElement;
                u.appendChild(s), u.appendChild(l)
            } catch (e) {
                throw console.error({
                    err: e
                }, e.stack), e
            }
        }, (0, function(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }(n(1)).default)();
        var r = 700,
            i = 500
    }, function(e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.default = function() {
            Element.prototype.remove = function() {
                this.parentElement.removeChild(this)
            }, NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
                for (var e = this.length - 1; e >= 0; e--) this[e] && this[e].parentElement && this[e].parentElement.removeChild(this[e])
            }
        }
    }])
});