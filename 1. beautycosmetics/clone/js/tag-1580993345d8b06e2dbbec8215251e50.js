///id=a:3.0:nojquery,tr:6.0
(function () {
  var waitForCondition = function (condition, callback) {
    var execute = function () {
      if (condition()) {
        callback();
      } else {
        setTimeout(execute, 100);
      }
    };
    execute();
  };
  waitForCondition(function () {
    return VWO && VWO._ && VWO._.libLoaded
  }, function () {
    //Set gquery coming in from testing library

    ! function () {
      "use strict";
      var i = parseInt(new Date / 1e3, 10),
        e, r = function () {
          return e || (e = VWO.data.ts || i)
        },
        t = Object.keys || function (e) {
          var t, n = [];
          for (t in e) e.hasOwnProperty(t) && n.push(t);
          return n
        };

      function n(e, t) {
        for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
      }

      function o(e, t) {
        for (var n = [], i = 0; i < e.length; i++) n.push(t(e[i]));
        return n
      }

      function s(e, t) {
        for (var n = [], i = 0; i < e.length; i++) t(e[i], i) && n.push(e[i]);
        return n
      }

      function _(e) {
        var t = r(),
          n = parseInt(new Date / 1e3, 10) - i;
        return e ? t + n : 1e3 * (t + n) + +new Date % 1e3
      }

      function w(e, t) {
        var n, i = !1;
        return function () {
          i && (clearTimeout(n), n = null), n = setTimeout(function () {
            e.call()
          }, t), i = !0
        }
      }

      function a(e, t, n) {
        "Array" === e ? (this.tags = [], this.lastSent = 0) : "Hash" === e && (this.tags = {}, this.sentTags = {}), this.type = e, this.maxCount = t || 1 / 0, this.addTagCallback = n || function () {}
      }
      a.prototype.add = function (e, t) {
        if (e) {
          var n = this.tags;
          "Array" === this.type ? ("[object Array]" !== Object.prototype.toString.call(e) && (e = [e]), e = o(e, function (e) {
            return e = encodeURIComponent(e.trim())
          }), n = s(n = (n = n.concat(e)).slice(0, this.maxCount), function (e, t) {
            return n.indexOf(e) === t
          }), this.tags = n) : "Hash" === this.type && (this.sentTags[e] && this.sentTags[e] === t || (this.tags[encodeURIComponent(e)] = encodeURIComponent(t))), this.addTagCallback()
        }
      }, a.prototype.get = function () {
        var e;
        if (this.isTagPassed()) return "Array" === this.type ? (e = this.tags.slice(this.lastSent), this.lastSent = this.tags.length) : "Hash" === this.type && (e = this.tags, n(this.sentTags, this.tags), this.tags = {}), e
      }, a.prototype.isTagPassed = function () {
        return "Array" === this.type ? this.tags.length > this.lastSent : "Hash" === this.type && 0 < t(this.tags).length
      }, a.prototype.reset = function () {
        "Array" === this.type ? (this.tags = [], this.lastSent = 0) : "Hash" === this.type && (this.tags = {}, this.sentTags = {})
      }, a.prototype.refresh = function () {
        "Array" === this.type ? this.lastSent = 0 : "Hash" === this.type && (n(this.tags, this.sentTags), this.sentTags = {})
      };
      var d = vwo_$,
        c = d,
        l = 250,
        u = 7,
        h, f, m, g;
      f = h = h || {}, f.DEAD = "11", f.RAGE = "12", f.ERROR = "13";
      var p = {
          init: function (e) {
            g = m = !1;
            var t = this.getMcData(e);
            return this.originalData = e, 0 < t.length && this.classifyClick(t), {
              latestRecording: this.originalData,
              deadClickInThisBatch: m,
              rageClickInThisBatch: g
            }
          },
          desanitizeActionData: function (e) {
            return e ? e.replace(/!-u-!/g, "_").replace(/!-c-!/g, ",") : ""
          },
          getTargetFromPath: function (e) {
            var t = e.split("+"),
              n = t[t.length - 1];
            return 0 < n.indexOf(">") ? (n = (t = e.split(">"))[t.length - 1], this.getTargetFromPath(n)) : 0 < n.indexOf("+") && this.getTargetFromPath(n), n.trim()
          },
          isDeadClickElement: function (t) {
            var e;
            try {
              e = document.querySelector(this.desanitizeActionData(t))
            } catch (e) {
              window.VWO._.customError && window.VWO._.customError({
                msg: "Query selector failed for selector path " + this.desanitizeActionData(t),
                url: "clickTracker.js",
                lineno: 92,
                colno: 9
              })
            }
            if (!e || !e.nodeName || !e.nodeName.toUpperCase) return !1;
            if (e._vwo_nd) return !1;
            switch (e.nodeName.toUpperCase()) {
              case "LABEL":
                if (e.hasAttribute("for")) {
                  var n = e.getAttribute("for");
                  if (document.getElementById(n)) return !1
                } else if (0 < c(e).find("input,select,textarea,option").length) return !1
            }
            return !0
          },
          canBeRageClick: function (e, t) {
            return parseInt(t.time, 10) - parseInt(e.time, 10) < l && e.selectorPath === t.selectorPath
          },
          getRageClicks: function (i) {
            if (i.length < 7) return [];
            var e = 0,
              t = 0,
              r = [];

            function n(e, t) {
              if (u - 1 <= t - e)
                for (var n = e; n <= t; n++) r.push(i[n].index)
            }
            for (var o = 1; o < i.length; o++) this.canBeRageClick(i[o - 1], i[o]) ? t++ : (n(e, t), t = e = o);
            return e !== t && n(e, t), r
          },
          classifyClick: function (e) {
            for (var t = [], n = 0; n < e.length; n++) this.isDeadClickElement(e[n].selectorPath) && t.push(e[n].index);
            this.addToOriginalData(t, this.getRageClicks(e))
          },
          addToOriginalData: function (e, t) {
            for (var n = {}, i = 0; i < e.length; i++) m = !0, n[e[i]] = h.DEAD;
            for (i = 0; i < t.length; i++) g = !0, n[t[i]] ? n[t[i]] += ":" + h.RAGE : n[t[i]] = h.RAGE;
            for (var r in n) n.hasOwnProperty(r) && (this.originalData[r] += "_{" + n[r] + "}")
          },
          getMcData: function (e) {
            for (var t = [], n = 0; n < e.length; n++) {
              var i = e[n].split("_");
              if ("mc" === i[0]) {
                var r = i[1],
                  o = i[2];
                t.push({
                  action: i[0],
                  time: r,
                  selectorPath: o,
                  index: n
                })
              }
            }
            return t
          }
        },
        v = function () {
          if (VWO._.eventsManager) return VWO._.eventsManager;
          var c = [],
            s = !0,
            l = [],
            u = [],
            h = {
              bind: "unbind",
              live: "die",
              on: "off"
            },
            f = [];
          var t = /iPhone|iPad/.test(navigator.userAgent);

          function a(e) {
            return !VWO.DONT_IOS && !("touchmove" !== e && "touchstart" !== e && "touchend" !== e || !t)
          }

          function o(e, t) {
            s && f.push({
              type: e,
              state: t,
              ref: e[t]
            })
          }

          function m() {
            for (var e = f.length - 1; 0 <= e; e--) {
              var t = f[e];
              t.type[t.state] = t.ref
            }
          }
          return v = {
            addEventListener: function (e, t, n, i) {
              if (!a(t)) return s && c.push({
                $el: e,
                name: t,
                callback: n,
                capture: i
              }), e.addEventListener ? e.addEventListener(t, n, i) : e.attachEvent && e.attachEvent("on" + t, n, i), v
            },
            addMutationObserver: function (e, t, n, i) {
              var r;
              if (void 0 !== window.MutationObserver ? r = window.MutationObserver : void 0 !== window.WebKitMutationObserver && (r = window.WebKitMutationObserver), r) try {
                var o = new MutationObserver(e.bind(i));
                u.push(o), o.observe(t, n)
              } catch (e) {}
            },
            clearAllListeners: function () {
              for (var e = 0; e < c.length; e++) {
                var t = c[e],
                  n = t.$el;
                t.jqType ? (i = n, r = t.jqType, o = t.eventName, s = t.callback, a = t.selector, d = t.capture, r && (a ? i[h[r]](o, a, s, d) : i[h[r]](o, s, d))) : n.removeEventListener ? n.removeEventListener(t.name, t.callback, t.capture) : n.detachEvent && n.detachEvent("on" + t.name, t.callback)
              }
              var i, r, o, s, a, d;
              return u.forEach(function (e) {
                  e.disconnect()
                }),
                function () {
                  for (var e = 0; e < l.length; e++) {
                    var t = l[e];
                    ("interval" === t.type ? clearInterval : clearTimeout)(t.name)
                  }
                }(), m(), c.length = 0, f.length = 0, u.length = 0, l.length = 0, v
            },
            addJqEventListener: function (e, t, n, i, r, o) {
              return a(n) || (s && c.push({
                $el: e,
                jqType: t,
                eventName: n,
                callback: i,
                selector: r,
                capture: o
              }), r ? e[t](n, r, i, o) : e[t](n, i, o)), v
            },
            pushTimers: function (e, t) {
              if (s) return l.push({
                name: e,
                type: t
              }), v
            },
            addOverrideState: o,
            overrideHistoryPush: function (n, i, e) {
              if (s) {
                var r = n[e];
                o(n, e), n[e] = function (e) {
                  var t = r.apply(n, [].slice.call(arguments));
                  try {
                    i({
                      state: e
                    })
                  } catch (e) {}
                  return t
                }
              }
            },
            revertOverriddenStates: m,
            init: function (e) {
              s = e.shouldPushToQueue
            }
          }, VWO.destroy = v.clearAllListeners, VWO._.eventsManager = v
        }();

      function y(e, t) {
        if (e) {
          var n, i = "." + e,
            r = window.vwo_$;
          if (!(t = t || {})[e]) {
            try {
              n = r(i)
            } catch (e) {
              n = ""
            }
            if (1 === n.length) return 1;
            t[e] = !0
          }
        }
      }

      function b(e) {
        if (e) {
          var t, n = window.vwo_$;
          try {
            t = n("#" + e)
          } catch (e) {
            t = ""
          }
          return t.length
        }
      }

      function T(e) {
        if (e.previousElementSibling) return e.previousElementSibling;
        for (; e = e.previousSibling;)
          if (1 === e.nodeType) return e
      }

      function E(e, t) {
        if (!e) return null;
        if (e === document) return "#document";
        t = t || {};
        var n, i, r, o, s, a = e,
          d = [],
          c = e.tagName,
          l = window.vwo_$;
        if ("string" == typeof c && ("body" === c.toLowerCase() || "head" === c.toLowerCase())) return c;
        for (; e;) {
          n = (c = e.tagName).match(/^((?:[\w\u00c0-\uFFFF\*-]|\\.)+)/), c && n && (n && n[0]) === c || (c = "*");
          try {
            i = l(e).attr("id")
          } catch (a) {
            i = e.id
          }
          i && "string" == typeof i && b(i) && (c = c + "#" + i), r = (r = e.getAttribute("class")) ? r.split(/\s+/) : [];
          for (var u = 0; u < r.length; u++)
            if (s = "." + (o = r[u]), y(o, t)) {
              c += s;
              break
            } d.unshift(c), e = T(e)
        }
        return -1 !== d[0].indexOf("#") || a.parentNode && "HEAD" === a.parentNode.nodeName || (d[0] += ":first-child"), E(a.parentNode, t) + " > " + d.join(" + ")
      }
      var N = function () {
          function e(e, t) {
            try {
              Object.defineProperty(e, t, {
                writable: !1
              })
            } catch (e) {}
          }

          function n() {
            if (!window.DISABLE_NATIVE_CONSTANTS) {
              if (!document.body) return void(window.DISABLE_NATIVE_CONSTANTS = !0);
              i = window.document.createElement("iframe"), e(i, "src"), i.setAttribute = function (e, t) {}, i.style.display = "none", i.onload = function () {
                (r = i.contentWindow).onerror = function (e, t, n, i) {
                  window.VWO && window.VWO._ && window.VWO._.customError && window.VWO._.customError({
                    msg: e,
                    url: t,
                    lineno: n,
                    colno: i,
                    source: "nativeConstants"
                  })
                }
              }, document.body.appendChild(i), (r = i.contentWindow) && e(r.location, "href")
            }
          }
          var i, r;
          return void 0 === window.DISABLE_NATIVE_CONSTANTS ? window.DISABLE_NATIVE_CONSTANTS = !0 : !1 === window.DISABLE_NATIVE_CONSTANTS && n(), {
            get: function (e) {
              i && i.contentWindow || n();
              var t = r;
              return t && !window.DISABLE_NATIVE_CONSTANTS || (t = window), t[e]
            }
          }
        },
        S = N(),
        D = {
          create: function (e, t, n, i) {
            var r = "";
            if (n) {
              var o = new(S.get("Date"));
              o.setTime(o.getTime() + 24 * n * 60 * 60 * 1e3), r = "; expires=" + o.toGMTString()
            } else !1 === n && (r = "; expires=Thu, 01 Jan 1970 00:00:01 GMT");
            i = i ? "; domain=" + i : "", document.cookie = e + "=" + t + r + "; path=/" + i
          },
          get: function (e) {
            for (var t = e + "=", n = document.cookie.split(";"), i = 0; i < n.length; i++) {
              for (var r = n[i];
                " " === r.charAt(0);) r = r.substring(1, r.length);
              if (0 === r.indexOf(t)) return r.substring(t.length, r.length)
            }
            return null
          },
          erase: function (e, t) {
            this.create(e, "", !1, t)
          }
        },
        k = d,
        R = window.VWO || [];
      R._vba = R._vba || {};
      var O = 120,
        C = [],
        A = function (e) {
          var t = e.sort(function (e, t) {
            return e - t
          }).filter(function (e) {
            return e
          });
          return {
            min: t[0] || 0,
            max: t[t.length - 1] || 0
          }
        },
        I = {
          cDT: 500,
          sRD: null,
          visualViewportAvaialable: window.visualViewport,
          jq: k,
          version: "3.0.94",
          ids: {
            account: window._vwo_acc_id,
            experiment: {},
            re: {},
            he: {},
            fe: {},
            recording: 0,
            html: 0,
            session: 0
          },
          tags: {
            eTags: new a("Hash"),
            eTagsV2: {
              f: new a("Array"),
              r: new a("Array"),
              h: new a("Array")
            },
            uTags: new a("Array")
          },
          heartBeatFrequency: R._vba.heartBeat || 4e3,
          startTime: 0,
          returnVisitor: !1,
          newSession: !1,
          loadChance: 100,
          saveNewRecordingInitiatedOnce: !1,
          lastTime: 0,
          enums: {
            formAnalysis: {
              TEMPORARY_STATE: "temporary",
              PERMANENT_STATE: "permanent"
            }
          },
          stopRecording: !1,
          sessionIdleTimeout: !1,
          config: {
            stopRecordingTime: 18e5,
            deleteSessionRecordingTime: 0
          },
          recordingData: {
            totals: {
              movements: 0,
              clicks: 0,
              keyPresses: 0,
              scroll: 0,
              touches: 0,
              ocs: 0
            },
            last: {
              movements: 0,
              clicks: 0,
              keyPresses: 0,
              scroll: 0,
              touches: 0,
              ocs: 0
            },
            mouse: {
              lastMove: {
                docX: 0,
                docY: 0
              }
            }
          },
          htmlRequestSuccess: !1,
          linkHrefForSnapshotting: [],
          triggerSessionIdleTimeout: function () {
            I.sessionIdleTimeout || (I.sessionIdleTimeout = setTimeout(function () {
              I.stopRecording = I.enums.formAnalysis.TEMPORARY_STATE, I.triggerSessionDeleteTimeout()
            }, I.config.stopRecordingTime))
          },
          triggerSessionDeleteTimeout: function () {
            I.sessionIdleTimeout = setTimeout(function () {
              I.stopRecording = I.enums.formAnalysis.PERMANENT_STATE, D.erase("nlssid" + I.ids.account, I.getCookieDomain()), D.erase("nlsrid" + I.ids.account, I.getCookieDomain())
            }, I.config.deleteSessionRecordingTime)
          },
          clearSessionIdleTimeout: function () {
            I.sessionIdleTimeout && (clearTimeout(I.sessionIdleTimeout), I.sessionIdleTimeout = !1)
          },
          resetAfterDataSent: function () {
            I.recordingData.last.scroll = I.recordingData.totals.scroll, I.recordingData.last.movements = I.recordingData.totals.movements, I.recordingData.last.clicks = I.recordingData.totals.clicks, I.recordingData.last.keyPresses = I.recordingData.totals.keyPresses, I.recordingData.last.touches = I.recordingData.totals.touches, I.recordingData.last.ocs = I.recordingData.totals.ocs, I.ftu = !1, I.resetTagAfterSent()
          },
          resetTagAfterSent: function () {
            I.tags.eTagsV2.f.refresh(), I.tags.eTagsV2.r.refresh(), I.tags.eTagsV2.h.refresh()
          },
          checkIfIdle: function () {
            return I.recordingData.last.scroll === I.recordingData.totals.scroll && I.recordingData.last.movements === I.recordingData.totals.movements && I.recordingData.last.clicks === I.recordingData.totals.clicks && I.recordingData.last.keyPresses === I.recordingData.totals.keyPresses && I.recordingData.last.touches === I.recordingData.totals.touches && I.recordingData.last.ocs === I.recordingData.totals.ocs && !I.ftu
          },
          resetClicksCount: function () {
            this.recordingData.totals.clicks = 0, this.recordingData.last.clicks = 0
          },
          calcDuration: function (e, t) {
            e = e || {};
            var n, i, r, o, s, a, d, c = _(),
              l = S.get("Math");
            e.recording && (r = +(n = e.recording.split(","))[0].split("_")[1], o = +n[n.length - 1].split("_")[1]), e.mutations && (i = S.get("JSON").parse(e.mutations)) instanceof S.get("Array") && (s = +i[0].time, a = +i[i.length - 1].time);
            var u = A([o, a, r, s]);
            return d = t || !u.max ? 0 : l.abs(u.max - this.lastTime), d /= 1e3, this.lastTime = t ? c - I.startTime : d ? u.max : this.lastTime, {
              currentTime: c,
              duration: d
            }
          },
          isMobile: function () {
            return /iphone|ipad|ipod|android|webos|opera mini|blackberry|iemobile|windows phone/i.test(navigator.userAgent)
          },
          getViewportDimensions: function () {
            var e = {
              width: 0,
              height: 0
            };
            return e.width = this.isMobile() ? window.innerWidth : document.documentElement.clientWidth, e.height = this.isMobile() ? window.innerHeight : document.documentElement.clientHeight, e.height = parseInt(e.height, 10), e.height = e.height || 0, I.isMobile() ? this.getDimensionsConsideringOrientation(e.width, e.height) : {
              width: e.width,
              height: e.height
            }
          },
          getAvailableDimensions: function () {
            var e = window.screen.availWidth || window.outerWidth,
              t = window.screen.availHeight || window.outerHeight,
              n = this.getDimensionsConsideringOrientation(e, t);
            return {
              height: n.height,
              width: n.width
            }
          },
          getDimensionsConsideringOrientation: function (e, t) {
            var n, i, r = S.get("Math");
            return this.isLandscapeMode() ? (n = r.max(e, t), i = r.min(e, t)) : (i = r.max(e, t), n = r.min(e, t)), {
              width: n,
              height: i
            }
          },
          isLandscapeMode: function () {
            return I.visualViewportAvaialable && window.screen && window.screen.orientation ? 0 <= window.screen.orientation.type.indexOf("landscape") : window.innerWidth > window.innerHeight
          },
          getScreenDimensions: function () {
            var e = window.screen.width,
              t = window.screen.height,
              n = this.getDimensionsConsideringOrientation(e, t);
            return {
              width: n.width,
              height: n.height
            }
          },
          getScreenScale: function () {
            var e = I.getAvailableDimensions(),
              t = I.getScreenDimensions();
            return {
              x: e.width / t.width,
              y: e.height / t.height
            }
          },
          getScale: function () {
            var e = this.getScreenDimensions();
            return {
              x: e.width / window.innerWidth,
              y: e.height / window.innerHeight
            }
          },
          getScrollPercentage: function () {
            var e = k(window).scrollTop(),
              t = k(document).height(),
              n = k(window).height(),
              i = S.get("Math").ceil(100 - (t - (n + e)) / t * 100);
            return isNaN(i) ? 0 : 100 < i ? 100 : i
          },
          getPageTitle: function () {
            var e = document.getElementsByTagName("title")[0];
            return e ? e.innerHTML : document.title
          },
          getCookieDomain: function () {
            for (var e = S.get("Date"), t = 0, n = document.domain || window.location.host, i = n.split("."), r = "nlsgd" + (new e).getTime(); t < i.length - 1 && -1 === document.cookie.indexOf(r + "=" + r);) n = i.slice(-1 - ++t).join("."), document.cookie = r + "=" + r + ";domain=" + n + ";";
            return document.cookie = r + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=" + n + ";", n
          },
          triggerLibEvent: function (e, t) {
            t instanceof S.get("Array") || (t = [t]), window._vwo_evq.push([e].concat(t))
          },
          isEligibleToSendRecordingData: function () {
            if (I.stopRecording === I.enums.formAnalysis.PERMANENT_STATE) return !1;
            var e = _(),
              t = 1e3 * I.ids.session;
            return !(60 * O * 1e3 < e - t) || (I.stopRecording = I.enums.formAnalysis.PERMANENT_STATE, !1)
          },
          extractLinkHrefForSnapshotting: function (e) {
            if (R._.ast) {
              var t = e.href && encodeURIComponent(e.href);
              "LINK" === e.tagName && t && "stylesheet" === e.rel && I.linkHrefForSnapshotting.indexOf(t) < 0 && (I.linkHrefForSnapshotting.push(t), C.push(t))
            }
          },
          resetHrefCollection: function () {
            C.length = 0
          },
          getCurrentHrefs: function () {
            return C
          }
        },
        x = d,
        L = window.VWO._.cookies,
        M = {
          getNodeProperty: function (e, t, n) {
            return t = t || "", this.needsMasking(e, n) ? this.getMaskedValue(t) : t
          },
          getMaskedValue: function (e, t) {
            return e ? "string" != typeof e ? e : "password" === t ? "*" : "number" === t ? e.replace(/./gi, "0") : "date" === t ? "1970-01-01" : e.replace(/./gi, "*") : ""
          },
          isElementBlacklisted: function (e, t) {
            return !!x(e).is(I.Recording.bl) || (!(!e.classList || !e.classList.contains("nls_protected")) || !(!e.tagName || "textarea" !== e.tagName.toLowerCase() && "option" !== e.tagName.toLowerCase() || !t))
          },
          ntDdClk: function (e) {
            if (VWO.data.frn && VWO.data.frn.dc && VWO.data.frn.dc.bl) {
              if (x(e).is(VWO.data.frn.dc.bl)) return !0
            } else if (e.classList && e.classList.contains("_vwo_no_dead")) return !0;
            return !1
          },
          isElementWhitelisted: function (e) {
            return !!x(e).is(I.Recording.wl) || !(!e.classList || !e.classList.contains("nls_whitelist"))
          },
          needsMasking: function (e, t) {
            return !this.isElementWhitelisted(e) && (!!this.isElementBlacklisted(e, t) || e.parentNode && this.needsMasking(e.parentNode, t))
          },
          shouldAnonymizeValue: function (e, t) {
            var n = x(e),
              i = n.val();
            if (!this.isElementWhitelisted(e) && t && "submit" !== n.prop("type") && "reset" !== n.prop("type") || this.isElementBlacklisted(e, t) || !this.isElementWhitelisted(e) && i.match(/\d{3,}/) || "password" === n.prop("type") || "hidden" === n.prop("type")) return !0
          },
          sanitizeActionData: function (e) {
            return "string" != typeof e ? "INVALIDATA" : e.replace(/_/g, "!-u-!").replace(/,/g, "!-c-!")
          },
          attributeValueToBeAnonymized: function (e, t) {
            var n;
            switch (t) {
              case "label":
                n = e.attr("label");
                break;
              case "value":
              default:
                n = e.val()
            }
            return n
          },
          handleProtected: function (e, t, n) {
            var i = x(e),
              r = this.attributeValueToBeAnonymized(i, n);
            return this.shouldAnonymizeValue(e, t) && (r = this.getMaskedValue(r, i.prop("type"))), r
          },
          getUUID: function () {
            return L.get("_vwo_uuid")
          }
        },
        H = {
          getTrueWidth: function (e) {
            var t = window.vwo_$ || window.jQuery;
            return t && t(e).width() || e.clientWidth || e.offsetWidth || e.scrollWidth
          },
          getTrueHeight: function (e) {
            var t = window.vwo_$ || window.jQuery;
            return t && t(e).height() || e.clientHeight || e.offsetHeight || e.scrollHeight
          },
          getRelativeStats: function (e, t, n, i, r, o) {
            var s = e.offset().top - t.offset().top,
              a = e.offset().left - t.offset().left,
              d = 0,
              c = 0;
            return r && o && (d = r - a, c = o - s), {
              correctedTargetHeight: this.getTrueHeight(t[0]),
              correctedTargetWidth: this.getTrueWidth(t[0]),
              correctedTargetOffsetX: n + a,
              correctedTargetOffsetY: i + s,
              correctedTargetPageX: d,
              correctedTargetPageY: c
            }
          }
        },
        P = ["html", "mutations", "recording"],
        V = [],
        z = {
          log: function () {
            for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
            if (window.console && -1 !== document.cookie.indexOf("vwo_log_mode")) return window.console.log.apply(window, e)
          }
        },
        W = 3,
        F = 0,
        U = null,
        B = function (e, t, n) {
          setTimeout(function () {
            n.retries = n.retries || 0, n.retries++, n.retries <= W && j(e, t, n)
          }, 50)
        },
        j = function (t, n, i) {
          var e = i.url,
            r = new(S.get("XMLHttpRequest"));
          r.open("POST", e, !0), "JSON" === t ? r.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8") : r.formData = n, r.send(n), r.onload = function () {
            if (200 <= this.status && this.status < 400)
              if (this.response) try {
                var e = S.get("JSON");
                i.success(e.parse(this.response))
              } catch (e) {} else i.success();
              else i.formData = this.formData, i.error(), B(t, n, i);
            i.complete()
          }, r.onerror = function () {
            i.formData = this.formData, i.error(), i.complete(), B(t, n, i)
          }
        },
        q = {
          isWorkerAvailable: function () {
            return this.workerUrl
          },
          isMultipartSupported: function () {
            return !!window.FormData
          },
          isWorkerRequired: function (e) {
            for (var t = 0; t < P.length; t++) {
              if (e[P[t]]) return !0
            }
          },
          ajax: function (e) {
            var t = void 0 !== (e = e || {}).url ? e.url : "",
              n = void 0 !== e.type ? e.type : "AUTO",
              i = e.data = void 0 !== e.data ? e.data : {},
              r = e.success = "function" == typeof e.success ? e.success : function () {},
              o = e.error = "function" == typeof e.error ? e.error : function () {},
              s = e.complete = "function" == typeof e.complete ? e.complete : function () {},
              a = this.workerUrl = e.workerUrl,
              d = e.formData,
              c = S.get("Object");
            if (c.keys(i).length) {
              var l = this.createQueryString(i);
              if ("GET" === n.toUpperCase() || "AUTO" === n.toUpperCase() && l.length <= 1800) {
                e.type = "GET";
                var u = new(S.get("Image"));
                u.src = t + "?" + l, u.onload = function () {
                  r(), s()
                }, u.onerror = function () {
                  o(), s()
                }
              } else if ("POST" === n.toUpperCase() || "AUTO" === n.toUpperCase() && 1800 < l.length) {
                e.url = e.url + "?_a=" + i.a + "&_u=" + encodeURIComponent(i.url), e.type = "POST";
                var h = [];
                try {
                  a && (U = U || new Worker(a))
                } catch (e) {}
                if (d) j("FormData", d, e);
                else if (e.dataLength = e.dataLength || l.length, this.isWorkerRequired(i) && this.isWorkerAvailable() && this.isMultipartSupported() && U) {
                  for (var f = 0; f < P.length; f++) h[f] = i[P[f]];
                  V[++F] = {
                    data: i,
                    options: e
                  }, U.postMessage({
                    id: F,
                    action: "compress",
                    strings: h
                  }), U.onmessage = U.onmessage || function (e) {
                    var t = e.data,
                      n = t.strings;
                    if (V[t.id]) {
                      var i, r = V[t.id].data,
                        o = V[t.id].options;
                      if ("compressed" === t.action) {
                        for (var s = 0; s < n.length; s++) i = P[s], n[s] && (r["c_" + i] = new Blob([n[s]]), z.log("Original Size: " + r[i].length + ", Compressed Size: " + r["c_" + i].size), delete r[i]);
                        var a = new FormData;
                        for (var d in r) c.prototype.hasOwnProperty.call(r, d) && a.append(d, r[d]);
                        j("FormData", a, o), delete V[t.id]
                      }
                    }
                  }
                } else j("JSON", l, e)
              }
            }
          },
          createQueryString: function (e) {
            var t = "";
            for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t += t.length ? "&" : "", t += n + "=", t += encodeURIComponent(e[n]));
            return t
          },
          sendError: function (e, t, n, i) {
            window.VWO._.customError && window.VWO._.customError({
              msg: e,
              url: t,
              lineno: n || 0,
              colno: i || 0,
              source: encodeURIComponent(window.location.href)
            })
          }
        },
        Y = {
          htmlSuccess: [6],
          disableNativeConstants: [307863, 318739, 337597, 11708, 354377, 279614]
        },
        X = window._vwo_acc_id;
      0 <= Y.disableNativeConstants.indexOf(X) && (window.DISABLE_NATIVE_CONSTANTS = !0);
      var J = d,
        K, G, $ = "nls_ajax.php",
        Q = ["eTags", "eTagsV2"],
        Z = window.VWO.data,
        ee = function () {},
        te = {},
        ne = 0,
        ie = function () {
          return !I.faultyWorker && I.workerUrl
        },
        re = function (e) {
          var t = Object.keys(e);
          if (t.length > Q.length) return !0;
          for (var n = 0; n < t.length; n++)
            if (-1 === Q.indexOf(t[n])) return !0;
          return !1
        };

      function oe(e, t) {
        K = "https://dev.visualwebsiteoptimizer.com/", G = I.analyze && Z.asn && "https://" + Z.asn + "/";
        var n = (t = t || {}).callback || function () {},
          i = I.analyze || window.VWO._vba.forceWorker ? ie() : null,
          r = (G || K) + $,
          o = I.ids.session;
        te[o] ? te[o] !== r && (q.sendError("Recording url is not matching __ previous url: " + te[o] + " __ new url: " + r + " __ sessionId: " + o + "__ uuid: " + M.getUUID(), "ajax-nls.js", 33), te[o] = r) : te[o] = r, e.count = ++ne, q.ajax({
          url: r,
          type: t.method,
          data: e,
          workerUrl: i,
          success: function (e) {
            n(e), I.resetHrefCollection()
          }
        })
      }

      function se() {
        var e = {},
          t = S.get("JSON");
        return I.r && (e.re = t.stringify(I.ids.re)), I.hs && (e.he = t.stringify(I.ids.he)), I.fae && (e.fe = t.stringify(I.ids.fe)), e
      }
      var ae = {
          formSubmitCallbacks: [],
          saveNewRecording: function (e) {
            var t, n, i, r, o = I.getViewportDimensions(),
              s = I.getScrollPercentage(),
              a = I.formAnalysis ? I.formAnalysis.forms : {},
              d = {},
              c = I.calcDuration(null, !0);
            if (e = e || ee, I.isEligibleToSendRecordingData()) {
              I.recordingData.totals.scroll = s < 1 ? 10 : s;
              var l = I.getScreenDimensions(),
                u = S.get("JSON"),
                h = {
                  codedo: "set_html_and_recording",
                  a: I.ids.account,
                  e: u.stringify(I.ids.experiment),
                  title: I.getPageTitle(),
                  url: window.location.href,
                  referring_url: document.referrer,
                  session_id: I.ids.session,
                  recording_id: I.ids.recording,
                  return_visitor: I.returnVisitor,
                  ins: I.newSession,
                  start_time: I.startTime,
                  end_time: c.currentTime,
                  window_width: o.width,
                  window_height: o.height,
                  sh: l.height,
                  sw: l.width,
                  vn: I.version
                },
                f = I.getCurrentHrefs();
              f.length && (h.asts = f), I.newSession = !1, I.hs && (i = {
                scroll_percentage: I.recordingData.totals.scroll
              }), I.fae && (n = {
                forms: u.stringify(a)
              }), I.r && (t = {
                duration: c.duration,
                clicks: I.recordingData.totals.clicks,
                movements: I.recordingData.totals.movements,
                end_time: c.currentTime
              }, I.Recording && I.Recording.addInitialHTML(h)), I.analyze && ($ = "analyze", r = se(), I.fae && (n.f = u.stringify(I.formAnalysis ? I.formAnalysis.f : {})), d = I.getTags(), I.resetTagAfterSent()), J.extend(h, t, n, i, r, d), oe(h, {
                callback: e
              }), I.resetClicksCount()
            }
          },
          sendRecordingData: function (e, t) {
            if (-1 === Y.htmlSuccess.indexOf(I.ids.account) && !I.htmlRequestSuccess) return !1;
            var n, i, r, o, s, a, d, c = I.checkIfIdle(),
              l = S.get("JSON");
            if (!e) {
              if (!I.isEligibleToSendRecordingData()) return;
              switch (I.stopRecording) {
                case I.enums.formAnalysis.TEMPORARY_STATE:
                  return void(c || (I.resetAfterDataSent(), I.clearSessionIdleTimeout(), I.triggerSessionDeleteTimeout()));
                case I.enums.formAnalysis.PERMANENT_STATE:
                  return
              }
              if (c) {
                if (I.triggerSessionIdleTimeout(), c) return;
                I.clearSessionIdleTimeout()
              }
              i = {
                a: I.ids.account,
                e: l.stringify(I.ids.experiment),
                url: t || window.location.href,
                session_id: I.ids.session,
                recording_id: I.ids.recording,
                vn: I.version
              };
              var u = I.getCurrentHrefs();
              for (var h in u.length && (i.asts = u), o = {}, this.formSubmitCallbacks) Object.prototype.hasOwnProperty.call(this.formSubmitCallbacks, h) && (n = this.formSubmitCallbacks[h]()) && J.extend(o, n);
              if (r = I.calcDuration(o), I.r && (a = {
                  movements: I.recordingData.totals.movements,
                  clicks: I.recordingData.totals.clicks,
                  duration: r.duration,
                  start_time: I.startTime,
                  end_time: r.currentTime
                }, s = !0), re(o) && (s = !0, J.extend(i, o)), !s) return void I.resetTagAfterSent();
              I.analyze && ($ = "analyze", d = se(), i.fRS = I.htmlRequestSuccess, delete i.e), J.extend(i, a, d), I.resetAfterDataSent(), oe(i), I.resetClicksCount()
            }
          }
        },
        de = d,
        ce, le;

      function ue(i) {
        var r, o;
        window.history && (r = window.history, o = r.pushState || function () {}, v.addOverrideState(r, "pushState"), r.pushState = function () {
          for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
          var n = o.apply(r, e);
          return i({
            state: e[0]
          }), n
        }, window.addEventListener ? v.addEventListener(window, "popstate", i, !1) : window.attachEvent && window.attachEvent("onpopstate", i))
      }

      function he() {
        I.recordingData.totals.ocs++;
        var e = I.getScreenDimensions();
        this.recording.push("oc_" + (_() - I.startTime) + "_" + e.width + "_" + e.height)
      }

      function fe(e) {
        var t = setTimeout(he.bind(e), 10);
        v.pushTimers(t, "timeout")
      }

      function me() {
        var e = S.get("Array");
        this.heatmap = {
          eventsLength: 0,
          maxClicksRecorded: window._vwo_clicks || 3,
          clicks: new e
        }, this.recording = new e, this.clicks = new e, this.index = {
          recording: 0,
          clicks: 0,
          heatmap: 0
        }, this.intervals = new e, I.startTime = _(), this.anonymizeKeys = !0, this.clickDelay = {
          page: 0,
          link: 380
        }, this.tags = new a("Array"), this.totals = {
          movements: 0,
          clicks: 0,
          keyPresses: 0,
          scroll: 0
        }, this.window = {
          width: 0,
          height: 0
        }, this.mouse = {
          curMove: {
            el: {},
            width: 0,
            height: 0,
            relX: 0,
            relY: 0,
            docX: 0,
            docY: 0
          },
          lastMove: {
            docX: 0,
            docY: 0
          },
          curDown: {
            tag: "",
            index: 0
          }
        }, this.isMobile = I.isMobile(), this.devicePixelRatio = 0
      }
      me.prototype.addInitialHTML = function (e) {
        var t = S.get("JSON");
        if (I.r) {
          var n = I.GetHtml.html;
          n.lvs = {
            c: VWO.v,
            o: VWO.v_o,
            s: VWO.v_s
          }, n.idleToAction = I.saveNewRecordingInitiatedOnce, e.html = t.stringify(n)
        }
      }, me.prototype.getRelativeCoord = function (e) {
        if (this.isMobile) {
          var t = (ce = ce || de('<span style="position:absolute;top:0;left:-100px"></span>').appendTo("body")).offset();
          e.pageY += t.top, e.pageX += t.left - -100
        }
        return {
          x: e.pageX - e.offsetX,
          y: e.pageY - e.offsetY
        }
      }, me.prototype.sendElementScrollData = function (e) {
        var t = e.target;
        this.recording.push("es_" + (_() - I.startTime) + "_" + M.sanitizeActionData(E(t)) + "_" + de(t).scrollLeft() + "_" + de(t).scrollTop())
      }, me.prototype.loadEventListeners = function () {
        var t = this;
        v.addJqEventListener(de(window), "on", "orientationchange", fe.bind(this, t)), v.addJqEventListener(de(document), "on", "mouseleave", ae.sendRecordingData.bind(ae));

        function s() {
          var e = I.getScale();
          t.recording.push("tc_" + (_() - I.startTime) + "_" + e.x + "_" + e.y + "_" + de(window).scrollLeft() + "_" + de(window).scrollTop())
        }

        function a(e) {
          var t, n, i = e.target,
            r = de(i).offset(),
            o = "touchend" === e.type,
            s = window.vwo_$(i),
            a = window.vwo_$(i);
          if (r) {
            if (this.mouse.curDown.tag = i.nodeName, this.mouse.curDown.index = de(i.nodeName).index(i), o) {
              var d = e.changedTouches[0];
              d && (t = d.pageX, n = d.pageY)
            } else t = e.pageX, n = e.pageY;
            for (var c = S.get("Math"), l = this.getRelativeCoord({
                pageX: t,
                offsetX: r.left,
                pageY: n,
                offsetY: r.top
              }), u = _() - I.startTime, h = "mc_" + u + "_" + M.sanitizeActionData(E(i)) + "_" + H.getTrueWidth(i) + "_" + H.getTrueHeight(i) + "_" + c.floor(l.x) + "_" + c.floor(l.y) + "_" + this.mouse.curMove.docX + "_" + this.mouse.curMove.docY; a.width() <= 0 && a.height() <= 0 && a.length;) a = a.parent();
            if (a && a !== s) {
              var f = c.floor(l.x),
                m = c.floor(l.y),
                g = this.mouse.curMove.docX,
                p = this.mouse.curMove.docY,
                v = H.getRelativeStats(s, a, f, m, g, p);
              h = "mc_" + u + "_" + M.sanitizeActionData(E(a[0])) + "_" + v.correctedTargetWidth + "_" + v.correctedTargetHeight + "_" + c.floor(v.correctedTargetOffsetX) + "_" + c.floor(v.correctedTargetOffsetY) + "_" + v.correctedTargetPageX + "_" + v.correctedTargetPageY
            }
            this.heatmap.clicks.push(h), this.recording.push(h), I.sRD = I.sRD || w(ae.sendRecordingData.bind(ae), I.cDT), I.sRD()
          }
        }
        v.addEventListener(document, "touchstart", function (e) {
          2 === e.touches.length && s()
        }.bind(this)), v.addEventListener(document, "touchmove", function (e) {
          2 === e.touches.length && s();
          var t = e.target;
          if (t) {
            t.vwoVbaTm = 1;
            var n = setTimeout(function () {
              t.vwoVbaTm = 0
            }, 1e3);
            v.pushTimers(n, "timeout")
          }
        }.bind(this)), v.addEventListener(document, "touchend", function () {
          for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
          var n = e[0];
          if (2 === n.touches.length) {
            var i = setTimeout(s, 600);
            v.pushTimers(i, "timeout")
          }
          var r = n.target;
          if (r) {
            r.vwoVbaTe = 1;
            var o = setTimeout(function () {
              r.vwoVbaTe = 0
            }, 1e3);
            v.pushTimers(o, "timeout"), r.vwoVbaTm || a.apply(this, e.concat(0)), r.vwoVbaTm = 0
          }
        }.bind(this));
        var e = w(function () {
          var e = I.getScale(),
            t = this.isMobile ? e.x : 1,
            n = this.isMobile ? e.y : 1;
          this.recording.push("sc_" + (_() - I.startTime) + "_" + t + "_" + n + "_" + de(window).scrollLeft() + "_" + de(window).scrollTop() + "_" + window.innerWidth + "_" + window.innerHeight + "_" + de("html").width() + "_" + de("html").height())
        }.bind(t), 100);
        v.addEventListener(window, "resize", function () {
          if (this.devicePixelRatio === window.devicePixelRatio) {
            var e = I.getScale(),
              t = I.getScreenScale(),
              n = (this.isMobile ? "rs_" : "re_") + (_() - I.startTime) + "_" + (this.isMobile ? window.innerWidth : document.documentElement.clientWidth) + "_" + (this.isMobile ? window.innerHeight : document.documentElement.clientHeight) + "_" + de(window).scrollLeft() + "_" + de(window).scrollTop() + "_" + (this.isMobile ? e.x + "_" + e.y : "") + "_" + (this.isMobile ? t.x : "") + "_" + (this.isMobile ? t.y : "") + "_" + (this.isMobile ? de("html").width() : "") + "_" + (this.isMobile ? de("html").height() : "");
            this.recording.push(n)
          } else this.devicePixelRatio = window.devicePixelRatio
        }.bind(this)), v.addEventListener(document, "mousemove", function (e) {
          var t = e.target,
            n = de(t).offset();
          if (n) {
            var i = this.getRelativeCoord({
                pageX: e.pageX,
                offsetX: n.left,
                pageY: e.pageY,
                offsetY: n.top
              }),
              r = S.get("Math");
            this.mouse.curMove.el = t, this.mouse.curMove.width = H.getTrueWidth(t), this.mouse.curMove.height = H.getTrueHeight(t), this.mouse.curMove.relX = r.floor(i.x), this.mouse.curMove.relY = r.floor(i.y), this.mouse.curMove.docX = e.pageX, this.mouse.curMove.docY = e.pageY
          }
        }.bind(this)), v.addJqEventListener(de(window), "on", "scroll", e), "function" == typeof document.addEventListener ? v.addEventListener(document.body, "scroll", t.sendElementScrollData.bind(t), !0) : v.addJqEventListener(de("*"), "on", "scroll", t.sendElementScrollData.bind(t)), v.addEventListener(document, "focus", function (e) {
          var t = e.target;
          this.recording.push("fo_" + (_() - I.startTime) + "_" + M.sanitizeActionData(E(t)))
        }.bind(this), !0), v.addEventListener(document, "blur", function (e) {
          var t = e.target,
            n = this.handleProtected(t);
          this.recording.push("bl_" + (_() - I.startTime) + "_" + M.sanitizeActionData(E(t)) + "_" + n)
        }.bind(this), !0), ue(function () {
          this.recording.push("url_" + (_() - I.startTime) + "_" + encodeURIComponent(location.href) + "_" + encodeURIComponent(this.currentUrl)), this.currentUrl = location.href
        }.bind(this)), v.addEventListener(document.body, "mousedown", function () {
          for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
          var n = e[0].target;
          n.vwoVbaTe ? n.vwoVbaTe = 0 : a.apply(this, e)
        }.bind(this)), v.addEventListener(document, "mouseup", function (e) {
          var t = e.target,
            n = de(t).offset(),
            i = de(t.nodeName).index(t);
          if ("HTML" !== t.nodeName && n) {
            var r;
            if (t.nodeName === this.mouse.curDown.tag && i === this.mouse.curDown.index) switch (e.button) {
              case 0:
              case 1:
              default:
                r = "mc_";
                break;
              case 2:
                r = "mr_"
            } else r = "mu_";
            if ("mc_" !== r) {
              var o = this.getRelativeCoord({
                  pageX: e.pageX,
                  offsetX: n.left,
                  pageY: e.pageY,
                  offsetY: n.top
                }),
                s = S.get("Math");
              if (this.recording.push(r + (_() - I.startTime) + "_" + M.sanitizeActionData(E(t)) + "_" + H.getTrueWidth(t) + "_" + H.getTrueHeight(t) + "_" + s.floor(o.x) + "_" + s.floor(o.y) + "_" + this.mouse.curMove.docX + "_" + this.mouse.curMove.docY), "submit" !== de(t).attr("type")) {
                setTimeout(function () {
                  ae.sendRecordingData()
                }, 1);
                for (var a = "A" === t.nodeName ? this.clickDelay.link : this.clickDelay.page, d = S.get("Date"), c = new d, l = c.getTime() + a; c.getTime() < l;) c = new d
              }
            }
          }
        }.bind(this)), v.addEventListener(document, "keyup", function (e) {
          var t = e.target,
            n = this.handleProtected(t);
          this.recording.push("ku_" + (_() - I.startTime) + "_" + M.sanitizeActionData(E(t)) + "_" + n)
        }.bind(this)), v.addJqEventListener(de(document), "on", "change", function (e) {
          var t = e.target,
            n = de(t).isChecked && de(t).isChecked() || de(t).is(":checked");
          this.recording.push("rb_" + (_() - I.startTime) + "_" + M.sanitizeActionData(E(t)) + "_" + n)
        }.bind(this), "input[type=radio]"), v.addJqEventListener(de(document), "on", "change", function (e) {
          var t = e.target,
            n = de(t).isChecked && de(t).isChecked() || de(t).is(":checked");
          this.recording.push("cb_" + (_() - I.startTime) + "_" + M.sanitizeActionData(E(t)) + "_" + n)
        }.bind(this), "input[type=checkbox]"), v.addJqEventListener(de(document), "on", "change", function (e) {
          var t, n = e.target,
            i = de(n).val();
          if (de.isArray(i)) {
            for (var r = 0; r < i.length; r++) i[r] = M.sanitizeActionData(i[r]);
            t = i.join("!-ac-!")
          } else t = i;
          t = this.handleProtected(n), this.recording.push("sb_" + (_() - I.startTime) + "_" + M.sanitizeActionData(E(n)) + "_" + t)
        }.bind(this), "select")
      }, me.prototype.storeMouseMove = function () {
        "HTML" !== this.mouse.curMove.el.nodeName && (this.mouse.lastMove.docX === this.mouse.curMove.docX && this.mouse.lastMove.docY === this.mouse.curMove.docY || (this.recording.push("mm_" + (_() - I.startTime) + "_" + M.sanitizeActionData(E(this.mouse.curMove.el)) + "_" + this.mouse.curMove.width + "_" + this.mouse.curMove.height + "_" + this.mouse.curMove.relX + "_" + this.mouse.curMove.relY + "_" + this.mouse.curMove.docX + "_" + this.mouse.curMove.docY), this.mouse.lastMove.docX = this.mouse.curMove.docX, this.mouse.lastMove.docY = this.mouse.curMove.docY))
      }, me.prototype.handleProtected = function (e) {
        var t = M.handleProtected(e, this.anonymizeKeys);
        return t = M.sanitizeActionData(t)
      }, me.prototype.getHeatmapData = function (e) {
        if (I.hs && !I.hsStopped) {
          var t = e,
            n = {},
            i = I.Recording.heatmap.maxClicksRecorded - I.Recording.heatmap.eventsLength;
          return t = t.slice(0, i), I.Recording.heatmap.eventsLength += t.length, 0 < t.length && de.extend(n, {
            mc: t.join(",")
          }), I.Recording.hasScrollChanged() && de.extend(n, {
            scroll_percentage: I.recordingData.totals.scroll
          }), n
        }
      }, me.prototype.resetHeatmapData = function () {
        var e = S.get("Array");
        I.Recording.heatmap.eventsLength = 0, I.hsStopped = !1, I.Recording.heatmap.clicks = new e, I.Recording.index.heatmap = 0
      }, me.prototype.resetData = function () {
        I.tags.eTags.refresh(), I.lastSendTime = 0, I.Recording.resetHeatmapData()
      }, me.prototype.hasScrollChanged = function () {
        return I.recordingData.totals.scroll !== I.recordingData.last.scroll
      }, me.prototype.addTag = function (e) {
        I.analyze || (I.Recording.tags.add(e), I.Recording.tags.isTagPassed() && ae.sendRecordingData(!0))
      }, me.prototype.getTagData = function () {
        if (I.r && I.Recording.tags.isTagPassed()) return {
          tags: I.Recording.tags.get()
        }
      }, me.prototype.getRecordingData = function (e, t) {
        var n = {},
          i = S.get("JSON");
        if (I.r) return e.length && (n.recording = e.join(",")), t.length && (n.mutations = i.stringify(t)), n
      }, me.prototype.sendData = function () {
        var e = I.getScreenScale(),
          t = {};
        if (this.oldSettings = this.oldSettings || {}, this.isMobile && (this.oldSettings.screenScaleX === e.x && this.oldSettings.screenScaleY === e.y || (I.Recording.recording.push("sS_" + (_() - I.startTime) + "_" + e.x + "_" + e.y), this.oldSettings.screenScaleX = e.x, this.oldSettings.screenScaleY = e.y)), !(I.Recording.index.recording >= I.Recording.recording.length && I.Recording.index.heatmap >= I.Recording.heatmap.clicks.length && I.Mutations.index >= I.Mutations.mutations.length) || I.Recording.hasScrollChanged() || I.Recording.tags.isTagPassed()) {
          var n = I.Recording.recording.slice(I.Recording.index.recording),
            i = I.Mutations.mutations.slice(I.Mutations.index),
            r = I.Recording.heatmap.clicks.slice(I.Recording.index.heatmap);
          I.Recording.index.recording = I.Recording.recording.length, I.Recording.index.heatmap = I.Recording.heatmap.clicks.length, I.Mutations.index = I.Mutations.mutations.length;
          var o = p.init(n);
          n = o.latestRecording;
          var s = o.deadClickInThisBatch ? 11 : 0,
            a = o.rageClickInThisBatch ? 12 : 0,
            d = {};
          if (s || a) {
            var c = [];
            c.push(s, a), d.rm = JSON.stringify({
              ct: c
            })
          }
          var l = I.Recording.getRecordingData(n, i),
            u = I.Recording.getHeatmapData(r),
            h = I.Recording.getTagData();
          return de.extend(t, l, u, h, d), t
        }
      }, me.prototype.pushScaleInformation = function () {
        var e = I.getScale(),
          t = e.x,
          n = e.y;
        this.recording.push("is_" + (_() - I.startTime) + "_" + t + "_" + n + "_" + de(window).scrollLeft() + "_" + de(window).scrollTop())
      }, me.prototype.init = function (e) {
        if (e && me.bind(this)(), this.currentUrl = location.href, ae.formSubmitCallbacks.push(this.sendData.bind(this)), this.devicePixelRatio = window.devicePixelRatio, this.initialClientHeight = I.getViewportDimensions().height, this.isMobile) {
          this.oldSettings = this.oldSettings || {};
          var t = I.getScreenScale(),
            n = t.x,
            i = t.y;
          I.Recording.recording.push("sS_" + (_() - I.startTime) + "_" + n + "_" + i + "_"), this.oldSettings.screenScaleX = n, this.oldSettings.screenScaleY = i, this.pushScaleInformation();
          for (var r = 500; r <= 2e3; r += 500) {
            var o = setTimeout(this.pushScaleInformation.bind(this), r);
            v.pushTimers(o, "timeout")
          }
        }
        var s = I.getScale();
        if (this.recording.push("sc_" + (_() - I.startTime) + "_" + (this.isMobile ? s.x : 1) + "_" + (this.isMobile ? s.y : 1) + "_" + de(window).scrollLeft() + "_" + de(window).scrollTop() + "_" + window.innerWidth + "_" + window.innerHeight + "_" + de("html").width() + "_" + de("html").height()), !le) {
          this.loadEventListeners();
          var a = setInterval(this.storeMouseMove.bind(this), 300);
          v.pushTimers(a, "interval"), le = !0
        }
      }, I.Recording = new me;
      var ge = function () {};

      function pe() {
        this.focusedNode = null, this.selectedLiIndex = -1
      }
      pe.prototype.getFocusedNode = function () {
        return this.focusedNode
      }, pe.prototype.setFocusOnNode = function (e) {
        this.focusedNode = e
      }, pe.prototype.resetFocusedNode = function () {
        this.focusedNode = null
      }, pe.prototype.resetSelectedLiIndex = function () {
        this.selectedLiIndex = -1
      }, pe.prototype.getSelectedLiIndex = function () {
        return this.selectedLiIndex
      }, pe.prototype.setSelectedLiIndex = function (e, t) {
        t = t || ge, this.selectedLiIndex !== e && (this.selectedLiIndex = e, t())
      }, pe.prototype.doBlurOnNode = function (e, t) {
        t = t || ge, this.focusedNode && this.focusedNode !== e && (t(), this.resetFocusedNode(), this.resetSelectedLiIndex())
      }, pe.prototype.doFocusOnNode = function (e, t) {
        t = t || ge, this.focusedNode && this.focusedNode === e || t()
      };
      var ve = new pe,
        _e = {
          createEvent: function (e, t) {
            var n = e.createEvent("Event");
            return n.initEvent(t, !1, !1), n
          },
          dispatchEvent: function (e, t) {
            e.dispatchEvent(t)
          }
        },
        we = d,
        ye;

      function be(e) {
        if (e.vwoCustEl && e.vwoCustEl.length) {
          for (var t = e.vwoCustEl, n = 0; n < t.length; n++) delete t[n].vwoNatEl, Ce(t[n]);
          delete e.vwoCustEl
        }
      }

      function Te(e) {
        for (var t = e.customElements, n = e.nativeElement, i = [], r = 0; r < t.length; r++)
          if (t[r]) {
            if (t[r].vwoNatEl) continue;
            t[r].vwoNatEl = n, Oe(t[r]), i.push(t[r])
          } n.vwoCustEl = i
      }

      function Ee(e) {
        var t = we(e),
          n = t.attr("type");
        if (t.is("input") && ("checkbox" === n || "radio" === n)) {
          var i = we('label[for="' + t.attr("id") + '"]');
          if (i.length <= 0) {
            var r = t.parent();
            "label" === r.get(0).tagName.toLowerCase() && (i = r)
          }
          return i.get(0)
        }
      }

      function Ne(e) {
        var t = e.currentTarget.vwoNatEl,
          n = we(e.target);
        if (t.tagName && "SELECT" === t.tagName && (n.is("li") || n.parent().is("li") || n.parent().parent().is("li"))) {
          var i = n.closest("li").index();
          return t.chStatsProcessed = 0, ve.setSelectedLiIndex(i, ye.changeHandler.bind({}, {
            target: t
          }, !0)), void(t.chStatsProcessed = 1)
        }
        t.mdStatsProcessed = 0, ye.mouseDownHandler({
          target: t
        }), t.mdStatsProcessed = 1, t.fcStatsProcessed = 0, ve.doFocusOnNode(t, ye.focusHandler.bind({}, {
          target: t
        })), t.fcStatsProcessed = 1
      }

      function Se(e) {
        var t = we(e.target),
          n = e.currentTarget.vwoNatEl;
        n.tagName && "SELECT" === n.tagName && (t.parent().is("li") || t.parent().parent().is("li")) || (n.muStatsProcessed = 0, ye.mouseUpHandler({
          target: n
        }), n.muStatsProcessed = 1, n.chStatsProcessed = 0, "INPUT" === n.tagName && "checkbox" === n.type ? ye.changeHandler({
          target: n
        }) : "INPUT" === n.tagName && "radio" === n.type && ve.doFocusOnNode(n, ye.changeHandler.bind({}, {
          target: n
        })), n.chStatsProcessed = 1, ve.setFocusOnNode(n))
      }

      function De(e) {
        var t = e.currentTarget.vwoNatEl;
        t.meStatsProcessed = 0, ye.mouseEnterHandler({
          target: t
        }), t.meStatsProcessed = 1
      }

      function ke(e) {
        var t = e.currentTarget.vwoNatEl;
        t.mlStatsProcessed = 0, ye.mouseLeaveHandler({
          target: t
        }), t.mlStatsProcessed = 1
      }

      function Re() {
        document.addEventListener("vwo_element_added", function (e) {
          if (ye._mapElements) {
            var t = e.data;
            t.constructor !== NodeList && (t = [t]);
            for (var n = 0; n < t.length; n++) {
              var i = [];
              t[n].tagName && "input" === t[n].tagName.toLowerCase() && i.push(Ee(t[n])), i.push(ye._mapElements(t[n]));
              var r = {
                customElements: i.reduce(function (e, t) {
                  return e.concat(t)
                }, []),
                nativeElement: t[n]
              };
              be(t[n]), Te(r)
            }
          }
        }, !1)
      }

      function Oe(e) {
        e.addEventListener("mousedown", Ne, !0), e.addEventListener("mouseup", Se, !0), e.addEventListener("mouseenter", De, !0), e.addEventListener("mouseleave", ke, !0)
      }

      function Ce(e) {
        e.removeEventListener("mousedown", Ne, !0), e.removeEventListener("mouseup", Se, !0), e.removeEventListener("mouseenter", De, !0), e.removeEventListener("mouseleave", ke, !0)
      }
      var Ae = {
          init: function (e) {
            ye = e, Re()
          }
        },
        Ie = d,
        xe = window._vwo_exp,
        Le = window._vwo_exp_ids,
        Me = "ANALYZE_FORM",
        He = 0,
        Pe;

      function Ve(e, t) {
        var n, i = Ie(e.target),
          r = i.get(0);
        switch (t) {
          case "mouseenter":
            n = r.meStatsProcessed;
            break;
          case "mouseleave":
            n = r.mlStatsProcessed;
            break;
          case "mousedown":
            n = r.mdStatsProcessed;
            break;
          case "mouseup":
            n = r.muStatsProcessed;
            break;
          case "focus":
            n = r.fcStatsProcessed;
            break;
          case "blur":
            n = r.blStats;
            break;
          case "change":
            n = r.chStatsProcessed;
            break;
          case "keydown":
            n = r.kdStats
        }
        if (!n && ze.handleTracking(i)) return i
      }
      var ze = {
        f: {},
        forms: {},
        lastSentForms: void 0,
        changes: {},
        formInputSelector: "form input, form select, form textarea, [nls_fa_name]:not(form) input, [nls_fa_name]:not(form) select, [nls_fa_name]:not(form) textarea",
        getFormName: function (e) {
          if (I.analyze) {
            var t = e.data("id");
            return t ? t : (He++, e.data("id", He), He)
          }
          return void 0 !== e.attr("nls_fa_name") && !1 !== e.attr("nls_fa_name") ? e.attr("nls_fa_name") : void 0 !== e.attr("id") && !1 !== e.attr("id") ? e.attr("id") : void 0 !== e.attr("name") && !1 !== e.attr("name") && e.attr("name")
        },
        getFormElementName: function (e) {
          return void 0 !== e.attr("nls_fa_el_name") && !1 !== e.attr("nls_fa_el_name") && null !== e.attr("nls_fa_el_name") ? e.attr("nls_fa_el_name") : void 0 !== e.attr("id") && !1 !== e.attr("id") && null !== e.attr("id") ? e.attr("id") : void 0 !== e.attr("name") && !1 !== e.attr("name") && null !== e.attr("name") && e.attr("name")
        },
        addForm: function (n) {
          var i, r, o, s, a, e = Le.length,
            d = this.getFormName(n);
          if (d) {
            for (; e--;)
              if (r = Le[e], (i = xe[r]).type === Me && i.ready) {
                var t = void 0;
                try {
                  t = Ie(i.forms[0])
                } catch (e) {
                  return
                }
                t.eq(0).each(l)
              } if ((!I.analyze || o) && 1 !== n.data("nls_fa_tracked") && !this.forms[d]) {
              s = {
                hiddenInputs: 0,
                submit: 0,
                total: 0
              }, n.find("input, select, textarea").each(function (e, t) {
                var n = Ie(t);
                "hidden" === n.prop("type").toLowerCase() && (s.hiddenInputs += 1), "submit" === n.prop("type").toLowerCase() && (s.submit += 1), s.total += 1
              }), a = s.hiddenInputs + s.submit === s.total;
              var c = S.get("Array");
              d ? a ? (n.data("nls_fa_tracked", 0), n.data("nls_fa_active", 0)) : (n.data("nls_fa_tracked", 1), n.data("nls_fa_active", 1), this.forms[d] = {
                name: d,
                fields: new c,
                interacted: 0,
                submitted: 0
              }, n.data("nls_fa_name", d)) : (n.data("nls_fa_tracked", 1), n.data("nls_fa_active", 0)), n.find("input, select, textarea").each(function (e, t) {
                var n = Ie(t),
                  i = ze.getFormElementName(n),
                  r = n.prop("type"),
                  o = 1 === n.data("nls_fa_tracked") && 1 === n.data("nls_fa_active");
                if (!d || !i || "hidden" === n.prop("type").toLowerCase() || a) return o || (n.data("nls_fa_tracked", 1), n.data("nls_fa_active", 0)), !0;
                var s = ze.forms[d].fields.length;
                ze.forms[d].fields.push({
                  name: i,
                  type: r,
                  interacted: 0,
                  filledOut: 0,
                  refilled: 0,
                  timeHesitation: 0,
                  timeInteraction: 0,
                  fip: s
                }), n.data("nls_fa_tracked", 1), n.data("nls_fa_active", 1), n.data("nls_fa_name", d), n.data("nls_fa_field_pos", s)
              }), Object.prototype.hasOwnProperty.call(this.forms, d) && this.addChanges("add_forms", this.forms[d], d)
            }
          }

          function l(e, t) {
            t === n[0] && (o = !0, ze.f[d] = ze.f[d] || {}, ze.f[d][r] || (ze.f[d][r] = i.forms[0]))
          }
        },
        addFormElement: function (e) {
          if (1 !== e.data("nls_fa_tracked")) {
            var t = e.closest("form,[nls_fa_name]:not(form)");
            if (1 === t.data("nls_fa_tracked")) {
              if (1 === t.data("nls_fa_tracked") && 1 !== t.data("nls_fa_active")) return e.data("nls_fa_tracked", 1), void e.data("nls_fa_active", 0);
              var n = t.data("nls_fa_name"),
                i = this.getFormElementName(e),
                r = e.prop("type");
              if (!i || "hidden" === e.prop("type").toLowerCase()) return e.data("nls_fa_tracked", 1), void e.data("nls_fa_active", 0);
              var o = this.forms[n].fields.length;
              this.forms[n].fields.push({
                name: i,
                type: r,
                interacted: 0,
                filledOut: 0,
                refilled: 0,
                timeHesitation: 0,
                timeInteraction: 0,
                fip: o
              }), e.data("nls_fa_tracked", 1), e.data("nls_fa_active", 1), e.data("nls_fa_name", n), e.data("nls_fa_field_pos", o), Object.prototype.hasOwnProperty.call(this.forms[n].fields, o) && this.addChanges("edit", {
                a: "add",
                t: "element",
                d: this.forms[n].fields[o]
              }, n)
            } else this.addForm(t)
          }
        },
        _addForm: function (e, t) {
          ze.addForm(Ie(t))
        },
        loadForms: function () {
          Ie("form").each(this._addForm), Ie("[nls_fa_name]:not(form)").each(this._addForm)
        },
        handleTracking: function (e) {
          if (1 !== e.data("nls_fa_tracked") && this.addFormElement(e), e.data("nls_fa_tracked")) return 1 !== e.data("nls_fa_tracked") || 1 === e.data("nls_fa_active")
        },
        addChanges: function (e, t, n) {
          if ("add_forms" === e) void 0 === this.changes.add_forms && (this.changes.add_forms = {}), this.changes.add_forms[n] = t;
          else if ("edit" === e) {
            var i = S.get("Array");
            void 0 === this.changes.edit && (this.changes.edit = {}), void 0 === this.changes.edit[n] && (this.changes.edit[n] = new i), this.changes.edit[n].push(t)
          }
        },
        staggerChanges: function () {
          var e = {},
            t = S.get("Array");
          for (var n in this.changes)
            if (Object.prototype.hasOwnProperty.call(ze.changes, n))
              if ("add_forms" === n) e.add_forms = ze.changes.add_forms;
              else if ("edit" === n)
            for (var i in e.edit = {}, ze.changes.edit)
              if (Object.prototype.hasOwnProperty.call(ze.changes.edit, i)) {
                e.edit[i] = new t;
                for (var r = 0; r < ze.changes.edit[i].length; r++) {
                  if (r + 1 !== ze.changes.edit[i].length) {
                    var o = ze.changes.edit[i][r],
                      s = ze.changes.edit[i][r + 1];
                    if ("edit" === o.a && o.fip === s.fip && o.d.pn === s.d.pn) continue
                  }
                  e.edit[i].push(ze.changes.edit[i][r])
                }
              } return this.changes = {}, e
        },
        changeHandler: function (e) {
          var t = Ve(e, "change");
          if (t) {
            var n = t.data("nls_fa_name"),
              i = t.data("nls_fa_field_pos"),
              r = ze.forms[n].fields[i].name;
            0 < t.data("nls_fa_focus_time") && (ze.forms[n].fields[i].timeHesitation += _() - t.data("nls_fa_focus_time"), ze.addChanges("edit", {
              a: "edit",
              t: "element",
              fip: i,
              fname: r,
              d: {
                pn: "timeHesitation",
                v: ze.forms[n].fields[i].timeHesitation
              }
            }, n), t.data("nls_fa_focus_time", 0)), 0 < t.data("nls_fa_keydown_time") && (ze.forms[n].fields[i].timeInteraction += _() - t.data("nls_fa_keydown_time"), ze.addChanges("edit", {
              a: "edit",
              t: "element",
              fip: i,
              fname: r,
              d: {
                pn: "timeInteraction",
                v: ze.forms[n].fields[i].timeInteraction
              }
            }, n), t.data("nls_fa_keydown_time", 0)), t.data("nls_fa_mouseenter_time", 0), t.data("nls_fa_mousedown_time", 0), 1 === ze.forms[n].fields[i].filledOut && (ze.forms[n].fields[i].refilled = 1, ze.addChanges("edit", {
              a: "edit",
              t: "element",
              fip: i,
              fname: r,
              d: {
                pn: "refilled",
                v: ze.forms[n].fields[i].refilled
              }
            }, n)), t.val() || 1 !== ze.forms[n].fields[i].filledOut ? t.val() && 0 === ze.forms[n].fields[i].filledOut && (ze.forms[n].fields[i].filledOut = 1, ze.addChanges("edit", {
              a: "edit",
              t: "element",
              fip: i,
              fname: r,
              d: {
                pn: "filledOut",
                v: ze.forms[n].fields[i].filledOut
              }
            }, n)) : (ze.forms[n].fields[i].filledOut = 0, ze.addChanges("edit", {
              a: "edit",
              t: "element",
              fip: i,
              fname: r,
              d: {
                pn: "filledOut",
                v: ze.forms[n].fields[i].filledOut
              }
            }, n))
          }
        },
        blurHandler: function (e) {
          var t = Ve(e, "blur");
          if (t) {
            var n = t.data("nls_fa_name"),
              i = t.data("nls_fa_field_pos"),
              r = ze.forms[n].fields[i].name;
            0 < t.data("nls_fa_focus_time") && (ze.forms[n].fields[i].timeHesitation += _() - t.data("nls_fa_focus_time"), ze.addChanges("edit", {
              a: "edit",
              t: "element",
              fip: i,
              fname: r,
              d: {
                pn: "timeHesitation",
                v: ze.forms[n].fields[i].timeHesitation
              }
            }, n), t.data("nls_fa_focus_time", 0)), 0 < t.data("nls_fa_keydown_time") && (ze.forms[n].fields[i].timeInteraction += _() - t.data("nls_fa_keydown_time"), ze.addChanges("edit", {
              a: "edit",
              t: "element",
              fip: i,
              fname: r,
              d: {
                pn: "timeInteraction",
                v: ze.forms[n].fields[i].timeInteraction
              }
            }, n), t.data("nls_fa_keydown_time", 0)), t.data("nls_fa_mouseenter_time", 0), t.data("nls_fa_mousedown_time", 0)
          }
        },
        focusHandler: function (e) {
          var t = Ve(e, "focus");
          if (t) {
            var n = t.data("nls_fa_name"),
              i = t.data("nls_fa_field_pos"),
              r = ze.forms[n].fields[i].name;
            0 === ze.forms[n].interacted && (ze.forms[n].interacted = 1, ze.addChanges("edit", {
              a: "edit",
              t: "form",
              d: {
                pn: "interacted",
                v: 1
              }
            }, n)), 0 === ze.forms[n].fields[i].interacted && (ze.forms[n].fields[i].interacted = 1, ze.addChanges("edit", {
              a: "edit",
              t: "element",
              fip: i,
              fname: r,
              d: {
                pn: "interacted",
                v: 1
              }
            }, n)), t.data("nls_fa_focus_time", _()), 0 < t.data("nls_fa_mouseenter_time") && (ze.forms[n].fields[i].timeHesitation += _() - t.data("nls_fa_mouseenter_time"), ze.addChanges("edit", {
              a: "edit",
              t: "element",
              fip: i,
              fname: r,
              d: {
                pn: "timeHesitation",
                v: ze.forms[n].fields[i].timeHesitation
              }
            }, n), t.data("nls_fa_mouseenter_time", 0))
          }
        },
        mouseUpHandler: function (e) {
          var t = Ve(e, "mouseup");
          if (t) {
            var n = t.data("nls_fa_name"),
              i = t.data("nls_fa_field_pos"),
              r = ze.forms[n].fields[i].name;
            0 < t.data("nls_fa_mousedown_time") && (ze.forms[n].fields[i].timeInteraction += _() - t.data("nls_fa_mousedown_time"), ze.addChanges("edit", {
              a: "edit",
              t: "element",
              fip: i,
              fname: r,
              d: {
                pn: "timeInteraction",
                v: ze.forms[n].fields[i].timeInteraction
              }
            }, n), t.data("nls_fa_mousedown_time", 0))
          }
        },
        mouseDownHandler: function (e) {
          var t = Ve(e, "mousedown");
          t && (ve.doBlurOnNode(t.get(0), ze.blurHandler.bind({}, {
            target: ve.getFocusedNode()
          })), t.data("nls_fa_mousedown_time", _()))
        },
        mouseLeaveHandler: function (e) {
          var t = Ve(e, "mouseleave");
          if (!(!t || t.isFocussed && t.isFocussed() || t.is(":focus"))) {
            var n = t.data("nls_fa_name"),
              i = t.data("nls_fa_field_pos"),
              r = ze.forms[n].fields[i].name;
            0 < t.data("nls_fa_mouseenter_time") && (ze.forms[n].fields[i].timeHesitation += _() - t.data("nls_fa_mouseenter_time"), ze.addChanges("edit", {
              a: "edit",
              t: "element",
              fip: i,
              fname: r,
              d: {
                pn: "timeHesitation",
                v: ze.forms[n].fields[i].timeHesitation
              }
            }, n), t.data("nls_fa_mouseenter_time", 0))
          }
        },
        mouseEnterHandler: function (e) {
          var t = Ve(e, "mouseenter");
          !t || t.isFocussed && t.isFocussed() || t.is(":focus") || t.data("nls_fa_mouseenter_time", _())
        },
        onFormSubmit: function () {
          var e = Ie(this);
          ze.trackFormSubmission(e)
        },
        keyDownHandler: function (e) {
          var t = Ve(e, "keydown");
          if (t) {
            var n = t.data("nls_fa_name"),
              i = t.data("nls_fa_field_pos"),
              r = ze.forms[n].fields[i].name;
            0 < t.data("nls_fa_focus_time") && (ze.forms[n].fields[i].timeHesitation += _() - t.data("nls_fa_focus_time"), ze.addChanges("edit", {
              a: "edit",
              t: "element",
              fip: i,
              fname: r,
              d: {
                pn: "timeHesitation",
                v: ze.forms[n].fields[i].timeHesitation
              }
            }, n), t.data("nls_fa_focus_time", 0)), 0 < t.data("nls_fa_keydown_time") && (ze.forms[n].fields[i].timeInteraction += _() - t.data("nls_fa_keydown_time"), ze.addChanges("edit", {
              a: "edit",
              t: "element",
              fip: i,
              fname: r,
              d: {
                pn: "timeInteraction",
                v: ze.forms[n].fields[i].timeInteraction
              }
            }, n)), t.data("nls_fa_keydown_time", _())
          }
        },
        loadFormEventListeners: function () {
          v.addJqEventListener(Ie(document), "on", "focus", ze.focusHandler, this.formInputSelector), v.addJqEventListener(Ie(document), "on", "blur", ze.blurHandler, this.formInputSelector), v.addJqEventListener(Ie(document), "on", "change", ze.changeHandler, this.formInputSelector), v.addJqEventListener(Ie(document), "on", "keydown", ze.keyDownHandler, this.formInputSelector), v.addJqEventListener(Ie(document), "on", "mouseenter", ze.mouseEnterHandler, this.formInputSelector), v.addJqEventListener(Ie(document), "on", "mouseleave", ze.mouseLeaveHandler, this.formInputSelector), v.addJqEventListener(Ie(document), "on", "mousedown", ze.mouseDownHandler, this.formInputSelector), v.addJqEventListener(Ie(document), "on", "mouseup", ze.mouseUpHandler, this.formInputSelector), v.addJqEventListener(Ie(document), "on", "submit", this.onFormSubmit, "form")
        },
        markSuccess: function (e, t) {
          var n = Ie(e),
            i = ze.getFormName(n);
          i && (e = ze.forms[i]) && (e.success = t, I.ftu = !0, ze.trackFormSubmission(n))
        },
        isFormSuccess: function (e) {
          var t = ze.forms[e];
          return t && (0 === t.success || !1 === t.success) ? 0 : 1
        },
        trackFormSubmission: function (e) {
          if (1 !== e.data("nls_fa_tracked") && this.addForm(e), 1 !== e.data("nls_fa_tracked") || 1 === e.data("nls_fa_active")) {
            var t = e.data("nls_fa_name");
            if (t && ze.forms[t] && 1 !== ze.forms[t].submitted) {
              0 === ze.forms[t].interacted && (ze.forms[t].interacted = 1, ze.addChanges("edit", {
                a: "edit",
                t: "form",
                d: {
                  pn: "interacted",
                  v: 1
                }
              }, t)), ze.isFormSuccess(t) ? (ze.forms[t].submitted = 1, ze.addChanges("edit", {
                a: "edit",
                t: "form",
                d: {
                  pn: "submitted",
                  v: 1
                }
              }, t)) : ze.forms[t].failed || (ze.forms[t].failed = 1, ze.addChanges("edit", {
                a: "edit",
                t: "form",
                d: {
                  pn: "failed",
                  v: 1
                }
              }, t)), ae.sendRecordingData();
              for (var n = S.get("Date"), i = new n, r = i.getTime() + 300; i.getTime() < r;) i = new n
            }
          }
        },
        sendData: function () {
          if (I.fae) {
            var e, t, n, i, r, o = ze.lastSentForms,
              s = ze.staggerChanges();
            for (var a in o || (ze.lastSentForms = ze.forms), s.edit)
              if (Object.prototype.hasOwnProperty.call(s.edit, a))
                for (var d in n = s.edit[a], r = ze.lastSentForms[a], n) Object.prototype.hasOwnProperty.call(n, d) && ("timeHesitation" !== (e = n[d]).d.pn && "timeInteraction" !== e.d.pn || (i = r && r.fields[e.fip] ? r.fields[e.fip][e.d.pn] : 0, (t = e.d.v - i) <= 0 || (s.edit[a][d].d.v = t)));
            if (ze.lastSentForms = Ie.extend(!0, {}, ze.forms), !Ie.isEmptyObject(s)) {
              var c = S.get("JSON"),
                l = {
                  fa_changes: c.stringify(s)
                };
              return I.analyze && (l.f = c.stringify(ze.f)), l
            }
          }
        },
        init: function () {
          ae.formSubmitCallbacks.push(this.sendData.bind(this)), this.loadForms(), Pe || (this.loadFormEventListeners(), Pe = !0), this.changes = {}, Ae.init(ze)
        }
      };

      function We() {
        var e = document.querySelectorAll("select, input, label");
        if (e.length) {
          var t = _e.createEvent(document, "vwo_element_added");
          t.data = e, _e.dispatchEvent(document, t)
        }
      }

      function Fe(e) {
        e && (ze._mapElements = e, We())
      }
      I.formAnalysis = ze, I.mapElements = Fe;
      var Ue = window.VWO = window.VWO || [],
        Be = window.console || {
          log: function () {},
          error: function () {}
        },
        je = {
          processEvent: function (t, e) {
            try {
              var n = t[0],
                i = t.slice(1),
                r = -1 !== n.indexOf(".");
              if (r && 0 === n.indexOf(e) || !r) {
                n = "VWO." + n;
                var o = eval(n),
                  s = void 0;
                return s = n.split("."), s.splice(-1), s = eval(s.join(".")), o ? (o.apply(s, i), 1) : 0
              }
              return 0
            } catch (e) {
              return Be.error("Error occured in VWO Process Event (" + (t && t[0]) + "): ", e), 0
            }
          },
          addPushListener: function (i) {
            var r, o = Ue.push;
            Ue.push = function () {
              for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
              var n = e[0];
              return o.apply(Ue, e), Ue[Ue.length - 1] === n && (r = je.processEvent(n, i), Ue[Ue.length - 1] === n && r && Ue.splice(-1)), Ue.length
            }
          },
          init: function (e) {
            for (var t = 0; t < Ue.length;) 1 === je.processEvent(Ue[t], e) ? Ue.splice(t, 1) : t++;
            je.addPushListener(e)
          }
        },
        qe = {
          RECORDING_INITIATED: "rI"
        },
        Ye = {
          overRideInsertRule: function (i) {
            var r = CSSStyleSheet.prototype.insertRule;
            CSSStyleSheet.prototype.insertRule = function () {
              for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
              var n = [];
              try {
                r.apply(this, e)
              } catch (e) {
                throw new Error(e)
              } finally {
                n.push({
                  parentSelector: E(this.ownerNode),
                  rule: e[0],
                  index: e[1]
                }), i.addMutation({
                  time: _() - I.startTime,
                  insertedRules: [{
                    addedStyles: n
                  }]
                })
              }
            }
          },
          processInsertRules: function () {
            for (var t = Ye.getCurrentInsertedRules(), o = this, e = function (e) {
                var r = t[e];
                [].forEach.call(r.cssRules, function (e, t) {
                  var n = E(r.ownerNode),
                    i = [];
                  i.push({
                    parentSelector: n,
                    rule: e.cssText,
                    index: t
                  }), o.html.insertedRules.push({
                    addedStyles: i
                  })
                })
              }, n = 0; n < t.length; n++) e(n)
          },
          getCurrentInsertedRules: function () {
            var n = [];
            return [].forEach.call(document.styleSheets, function (e) {
              var t;
              !e.href && e.cssRules && 0 !== e.cssRules.length && (void 0 !== e.ownerNode.innerText ? t = e.ownerNode.innerText : void 0 !== e.ownerNode.innerHTML && (t = e.ownerNode.innerHTML), (t.match(/{/g) || []).length < e.cssRules.length && n.push(e))
            }), n
          },
          init: function (e) {
            this.overRideInsertRule(e)
          }
        },
        Xe = d;

      function Je(n, e, i) {
        var r;
        i = i || function () {
          for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
          return e[0]
        }, Xe.each(e, function (e, t) {
          r = i(t.name);
          try {
            n.setAttribute(r, t.value)
          } catch (e) {}
        })
      }

      function Ke(e) {
        switch (e) {
          case "src":
            e = "__nls-src";
            break;
          case "srcset":
            e = "__nls-srcset"
        }
        return e
      }

      function Ge(e) {
        if (!e) return e;
        var t = e.nodeName && e.nodeName.toLowerCase();
        if ("video" === t) {
          var n = document.createElement("__nls-video");
          return Je(n, e.attributes), n
        }
        if ("img" !== t) return e.cloneNode(!1);
        var i = document.createElement("img");
        return Je(i, e.attributes, Ke), i
      }

      function $e(e, t) {
        if (!e) return e;
        var n = Ge(e);
        if (!n || !n.childNodes.length)
          for (e = e.firstChild; e;) e.childNodes && e.childNodes.length ? $e(e, n) : n.appendChild(Ge(e)), e = e.nextSibling;
        return t && t.appendChild(n), n
      }

      function Qe() {
        this.doctype = {}, this.htmlEl = {}, this.headEl = {}, this.bodyEl = {};
        var e = S.get("Array"),
          t = window._vwo_code;
        this.html = {
          version: 3,
          timedout: t && t.lT ? 1 : t && t.sT ? 2 : 0,
          idleToAction: I.saveNewRecordingInitiatedOnce,
          beforeDoctype: new e,
          insertedRules: new e,
          doctype: {
            present: !1,
            name: "",
            publicId: "",
            systemId: ""
          },
          beforeHtml: new e,
          html: {
            present: !1,
            attributes: {}
          },
          beforeHead: new e,
          head: {
            present: !1,
            attributes: {},
            html: ""
          },
          beforeBody: new e,
          body: {
            present: !1,
            attributes: {},
            html: ""
          },
          afterBody: new e,
          afterHtml: new e
        }
      }
      Qe.prototype.serializeNode = function (e, t, n, i) {
        var r = S.get("Array"),
          o = S.get("Node");
        if (null === e) return null;
        var s = {
          nodeType: e.nodeType
        };
        switch (I.extractLinkHrefForSnapshotting(e), s.nodeType) {
          case o.COMMENT_NODE:
          case o.TEXT_NODE:
            s.textContent = e.textContent, n && s.textContent && s.textContent.trim() && (s.textContent = M.getMaskedValue(s.textContent));
            break;
          case o.ELEMENT_NODE:
            M.isElementWhitelisted(e) ? i = !(n = !1) : !i && M.isElementBlacklisted(e, I.Recording.anonymizeKeys) && (n = !0), s.tagName = e.tagName, s.attributes = {};
            for (var a = 0; a < e.attributes.length; a++) {
              var d = e.attributes[a];
              s.attributes[d.name] = d.value
            }
            if (e.childNodes.length) {
              s.childNodes = new r;
              for (var c = e.firstChild; c; c = c.nextSibling) s.childNodes.push(this.serializeNode(c, t, n, i))
            }
        }
        return s
      }, Qe.prototype.handleBaseElement = function () {
        for (var e, t = document.getElementsByTagName("base"), n = 0; n < t.length; n++)
          if ((e = t[n]).hasAttribute("href")) {
            var i = e.getAttribute("href");
            null != i && (this.html.base = 1)
          }
      }, Qe.prototype.handleTextNodes = function (e) {
        var t, n = S.get("Node");
        e.nodeType === n.TEXT_NODE && "" === e.textContent ? (t = document.createComment("!!-nlsTN-!!"), e.parentNode.replaceChild(t, e), e = t) : e.nodeType === n.TEXT_NODE && e.previousSibling && e.previousSibling.nodeType === n.TEXT_NODE && (t = document.createComment("!!-nlsCN-!!"), e.parentNode.insertBefore(t, e));
        for (var i = e.firstChild; i; i = i.nextSibling) this.handleTextNodes(i);
        return e
      }, Qe.prototype.processDoctype = function () {
        this.html.doctype.present = !0;
        for (var e = this.doctype.previousSibling; e; e = e.previousSibling) this.html.beforeDoctype.push(this.serializeNode(e, "beforeDoctype"));
        this.html.beforeDoctype.reverse(), this.html.doctype.name = this.doctype.name, this.html.doctype.publicId = this.doctype.publicId, this.html.doctype.systemId = this.doctype.systemId
      }, Qe.prototype.processHtml = function () {
        var e;
        for (this.html.html.present = !0, e = this.htmlEl.previousSibling; e && (!this.doctype || e !== this.doctype); e = e.previousSibling) this.html.beforeHtml.push(this.serializeNode(e, "beforeHtml"));
        this.html.beforeHtml.reverse();
        for (var t = 0; t < this.htmlEl.attributes.length; t++) {
          var n = this.htmlEl.attributes[t];
          this.html.html.attributes[n.name] = n.value
        }
        for (e = this.htmlEl.nextSibling; e; e = e.nextSibling) this.html.afterHtml.push(this.serializeNode(e, "afterHtml"));
        this.html.afterHtml.reverse()
      }, Qe.prototype.processBaseElement = function () {
        this.handleBaseElement()
      }, Qe.prototype.processHead = function () {
        this.html.head.present = !0, this.processBaseElement();
        for (var e = this.headEl.previousSibling; e && (!this.htmlEl || e !== this.htmlEl) && (!this.doctype || e !== this.doctype); e = e.previousSibling) this.html.beforeHead.push(this.serializeNode(e, "beforeHead"));
        this.html.beforeHead.reverse();
        for (var t = 0; t < this.headEl.attributes.length; t++) {
          var n = this.headEl.attributes[t];
          this.html.head.attributes[n.name] = n.value
        }
        for (var i = this.headEl.cloneNode(!0), r = i.firstChild; r; r = r.nextSibling) r = this.handleTextNodes(r);
        this.html.head.nodes = this.serializeNode(i)
      }, Qe.prototype.processBody = function () {
        var e;
        for (this.html.body.present = !0, e = this.bodyEl.previousSibling; e && (!this.headEl || e !== this.headEl) && (!this.htmlEl || e !== this.htmlEl) && (!this.doctype || e !== this.doctype); e = e.previousSibling) this.html.beforeBody.push(this.serializeNode(e, "beforeBody"));
        this.html.beforeBody.reverse();
        for (var t = 0; t < this.bodyEl.attributes.length; t++) {
          var n = this.bodyEl.attributes[t];
          this.html.body.attributes[n.name] = n.value
        }
        for (var i = $e(this.bodyEl), r = i.firstChild; r; r = r.nextSibling) r = this.handleTextNodes(r);
        for (Xe("input,option", i).each(function (e, t) {
            Xe(t, i).attr("value") && Xe(t, i).attr("value", M.handleProtected(t, I.Recording.anonymizeKeys)), Xe(t, i).attr("label") && Xe(t, i).attr("label", M.handleProtected(t, I.Recording.anonymizeKeys, "label"))
          }), this.html.body.nodes = this.serializeNode(i), e = this.bodyEl.nextSibling; e; e = e.nextSibling) this.html.afterBody.push(this.serializeNode(e, "afterBody"));
        this.html.afterBody.reverse()
      }, Qe.prototype.init = function (e) {
        e && Qe.bind(this)(), this.doctype = document.doctype, this.htmlEl = document.getElementsByTagName("html")[0], this.headEl = document.getElementsByTagName("head")[0], this.bodyEl = document.getElementsByTagName("body")[0], this.doctype && this.processDoctype(), this.htmlEl && this.processHtml(), Ye.processInsertRules.call(this), this.headEl && this.processHead(), this.html.base ? I.baseAdjustment = {
          offset: 0
        } : this.html.head.present ? I.baseAdjustment = {
          offset: 1,
          afterEl: this.headEl.childNodes[0]
        } : I.baseAdjustment = {
          offset: 2,
          afterEl: this.bodyEl
        }, this.bodyEl && this.processBody()
      }, I.GetHtml = new Qe, I.GetHtml.__ = 1;
      var Ze = I.GetHtml,
        et = {
          INIT: "nls.init"
        },
        tt = d;

      function nt() {
        I.recordingData.totals.touches++
      }

      function it() {
        I.recordingData.totals.keyPresses++
      }

      function rt(e) {
        "HTML" !== e.target.nodeName && I.recordingData.totals.clicks++
      }

      function ot(e) {
        var t = e.target.nodeName,
          n = e.pageX,
          i = e.pageY;
        "HTML" !== t && (I.recordingData.mouse.lastMove.docX === n && I.recordingData.mouse.lastMove.docY === i || (I.recordingData.totals.movements++, I.recordingData.mouse.lastMove.docX = n, I.recordingData.mouse.lastMove.docY = i))
      }
      var st = w(ae.sendRecordingData.bind(ae), 100);

      function at() {
        var e = I.getScrollPercentage();
        e > I.recordingData.totals.scroll && 0 < e && (I.recordingData.totals.scroll = e, st())
      }

      function dt() {
        v.addJqEventListener(tt(window), "on", "scroll", at), v.addEventListener(document, "mouseup", rt), v.addEventListener(document, "keyup", it), v.addEventListener(document, "mousemove", ot), v.addEventListener(document, "touchstart", nt)
      }
      var ct = {
        init: dt,
        __: 1
      };
      I.EventListners = ct, ct.__ = 1;
      var lt = function () {
          var e = D.get("nlssid" + I.ids.account);
          e ? (I.ids.session = e, I.returnVisitor = !0) : (I.ids.session = window._vwo_pa.sId, D.create("nlssid" + I.ids.account, I.ids.session, null, I.getCookieDomain()), I.returnVisitor = !1)
        },
        ut = function () {
          var e = parseInt(D.get("nlsrid" + I.ids.account), 10);
          e = isNaN(e) ? 1 : e + 1, I.ids.recording = e, D.create("nlsrid" + I.ids.account, e, 365, I.getCookieDomain())
        },
        ht = !1,
        ft = function () {
          var e = navigator.userAgent.toLowerCase();
          return -1 !== e.indexOf("msie") && parseInt(e.split("msie")[1], 10)
        },
        mt = function () {
          var e = {},
            t = I.tags.eTags.get(),
            n = {
              f: I.tags.eTagsV2.f.get(),
              r: I.tags.eTagsV2.r.get(),
              h: I.tags.eTagsV2.h.get()
            },
            i = I.tags.uTags.get(),
            r = S.get("JSON");
          return t && (e.eTags = r.stringify(t)), (n.f || n.r || n.h) && (e.eTagsV2 = r.stringify(n)), i && (e.uTags = r.stringify(i)), e
        };
      I.getTags = mt;
      var gt = function (t, n) {
          /bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent) || (I.ids.session || (lt(), ut()), void 0 !== I.ids.session && void 0 !== I.returnVisitor && function () {
            for (var e in ft() || I.GetHtml.init(n), ht || (I.EventListners.init(), ht = !0), ae.formSubmitCallbacks.push(mt), t) Object.prototype.hasOwnProperty.call(t, e) && I[t[e]].init(n);
            I.triggerLibEvent(et.INIT), ae.saveNewRecording(function () {
              I.saveNewRecordingInitiatedOnce = !0, I.sRD = I.sRD || w(ae.sendRecordingData.bind(ae), I.cDT);
              var e = setInterval(I.sRD, I.heartBeatFrequency);
              v.pushTimers(e, "interval"), I.htmlRequestSuccess = !0
            })
          }())
        },
        pt = {
          init: gt
        },
        vt = d;
      Ze.__ = 1;
      var _t = window._vwo_exp || {},
        wt = window._vwo_exp_ids || [],
        yt = "ANALYZE_HEATMAP",
        bt = "ANALYZE_RECORDING",
        Tt = "ANALYZE_FORM",
        Et = {},
        Nt = window.VWO,
        St = Nt.data && Nt.data.mrp || 20,
        Dt, kt = !0,
        Rt = !1,
        Ot = !1,
        Ct = !1,
        At = !1,
        It = function () {
          for (var e in Nt._) {
            if (Object.prototype.hasOwnProperty.call(Nt._, e) && "function" == typeof Nt._[e])
              if (0 <= Nt._[e].toString().indexOf('unshift(["jI"]')) return Nt._[e]
          }
        },
        xt = Nt._.triggerEvent || It() || function () {};
      Et[Tt] = "fe", Et[yt] = "he", Et[bt] = "re";
      var Lt = function (e) {
          return window._vwo_pa = window._vwo_pa || {}, !(!window._vwo_pa || !window._vwo_pa[e] || 1 !== window._vwo_pa[e].r && 1 !== window._vwo_pa[e].fae && 1 !== window._vwo_pa[e].hs)
        },
        Mt = function (e) {
          if (_t[e]) {
            var t = _t[e].type;
            return 0 <= [yt, bt].indexOf(t) ? (_t[e].main && (I.hs = I.hs || t === yt, I.r = I.r || t === bt), !0) : t === Tt && (I.fae = !0)
          }
        },
        Ht = function () {
          for (var e, t = wt.length; t--;)
            if (e = _t[wt[t]].type, 0 <= [yt, bt, Tt].indexOf(e)) return !0;
          return !1
        },
        Pt = function () {
          I.stopRecording = I.enums.formAnalysis.PERMANENT_STATE
        },
        Vt = function (e, t, n, i, r) {
          var o = D.get("nlssid" + I.ids.account);
          if (!Ht() && o) I.ids.session = o, I.ids.recording = parseInt(D.get("nlsrid" + I.ids.account) || 1, 10), I.returnVisitor = !0;
          else {
            var s = r || t;
            if (St < s) return void Pt();
            i && (I.stopRecording = !1), I.ids.session = e, I.ids.recording = s, I.returnVisitor = n, I.newSession = !!i, Ot = !0, Ct || Dt(), kt && o && (D.erase("nlssid" + I.ids.account, I.getCookieDomain()), D.erase("nlsrid" + I.ids.account, I.getCookieDomain())), kt = !1, n && I.saveNewRecordingInitiatedOnce && ae.saveNewRecording()
          }
        },
        zt = function () {
          I.ready = !1, I.r = !1, I.hs = !1, I.fae = !1, I.ids.experiment = {}, Ot = !1, I.saveNewRecordingInitiatedOnce = !1, Ct = !1, I.htmlRequestSuccess = !1, I.Recording.resetData(), I.ids.re = {}, I.ids.he = {}, I.ids.fe = {}
        },
        Wt = function (e) {
          var t, n, i, r, o = e[0];
          if ("rH" === o || "vS" === o) {
            if (t = e[1], n = +e[2] || 1, i = Mt(t), !I.ids.experiment[t] && (Lt(t) || i))
              if (i)
                if (r = _t[t].type, _t[t].main || r === Tt) I.ids[Et[r]][t] = M.getUUID(), I.ready = !0, I.analyze = !0, r === Tt ? (I.tags.eTags.add(t, n), I.tags.eTagsV2.f.add(t)) : r === bt && (I.Recording.anonymizeKeys = void 0 !== _t[t].aK ? _t[t].aK : I.Recording.anonymizeKeys, I.Recording.bl = _t[t].bl, I.Recording.wl = _t[t].wl), Ct || Dt();
                else switch (I.tags.eTags.add(t, n), r) {
                  case yt:
                    I.tags.eTagsV2.h.add(t);
                    break;
                  case bt:
                    I.tags.eTagsV2.r.add(t)
                } else I.Recording.anonymizeKeys = I.Recording.anonymizeKeys || window._vwo_pa[t].aK, I.fae = I.fae || window._vwo_pa[t].fae, I.hs = I.hs || window._vwo_pa[t].hs, I.r = I.r || window._vwo_pa[t].r, I.ids.experiment[t] = M.getUUID(), I.ready = !0, Ct || Dt()
          } else "tSC" === o ? Vt(e[1], e[2], e[3], e[4], e[5]) : "tSE" === o ? Pt() : "uC" === o && (ae.sendRecordingData(!1, I.Recording && I.Recording.currentUrl), zt())
        },
        Ft = function (e) {
          vt.each(e, function (e, t) {
            Wt(t)
          })
        },
        Ut = function () {
          window._vwo_evq = window._vwo_evq || [], Ft(window._vwo_evq);
          var n = window._vwo_evq.push,
            i = window._vwo_evq.unshift;
          window._vwo_evq.push = function () {
            for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
            return Wt(e[0]), n.apply(window._vwo_evq, e)
          }, window._vwo_evq.unshift = function () {
            for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
            return Wt(e[0]), i.apply(window._vwo_evq, e)
          }
        },
        Bt = function () {
          return window.Worker && window.URL && window.Blob
        },
        jt = function () {
          return !!I.ready && (!(I.analyze && !Ot) && (!!I.faultyWorker || !!Bt() && !!I.workerUrl))
        },
        qt = function (e) {
          !Ct && jt() && At && (Ct = !0, I.ready && I.r && xt(qe.RECORDING_INITIATED), pt.init(e, Rt), Rt = !0)
        },
        Yt = function (n) {
          Dt = w(function () {
            qt(n)
          }, 50), Ut();
          var e = window._vwo_worker_cb,
            t = e ? "-" + e : "";
          if (!Nt.nls) {
            Nt.nls = I;
            var i = window._vwo_worker_url || "https://dev.visualwebsiteoptimizer.com/analysis/worker" + t + ".js";
            return Bt() && vt.ajax({
              url: i,
              dataType: "text",
              success: function (e) {
                try {
                  var t = new window.Blob([e], {
                    type: "text/javascript"
                  });
                  I.workerUrl = window.URL.createObjectURL(t)
                } catch (e) {
                  I.faultyWorker = !0
                }
                qt(n)
              }
            }), vt(document).ready(function () {
              setTimeout(function () {
                At = !0, qt(n), je.init("nls")
              }, 500)
            }), window._vwo_evq = window._vwo_evq || [], I.ajax = q, window.__nls = I
          }
        },
        Xt = Object.freeze({
          __proto__: null,
          init: Yt
        }),
        Jt = {
          BUTTON: 1,
          A: 1,
          INPUT: 1,
          TEXTAREA: 1,
          SELECT: 1,
          OPTION: 1
        };

      function Kt() {
        var e = S.get("Array");
        this.nextId = 1, this.nodes = new e, this.ID_PROP = "nlsNodeId"
      }

      function Gt(e) {
        this.observerCallback(e)
      }

      function $t(e) {
        var t = S.get("Array");
        this.target = e || document, this.mutations = new t, this.index = 0, this.stagger = !0, this.knownNodes = new Kt
      }
      Kt.prototype.add = function (e, t, n) {
        var i = 0;
        if (I.baseAdjustment.afterEl === e && (i = I.baseAdjustment.offset), this.nextId = this.nextId + i, e[this.ID_PROP] = this.nextId, (n || M.ntDdClk(e) || 1 === Jt[e.nodeName && e.nodeName.toUpperCase && e.nodeName.toUpperCase()]) && (e._vwo_nd = 1, n = !0), this.nodes[this.nextId] = e, this.nextId++, t && e.childNodes.length)
          for (var r = e.firstChild; r; r = r.nextSibling) this.add(r, !0, n);
        return e[this.ID_PROP]
      }, Kt.prototype.delete = function (e) {
        var t = this.getId(e);
        delete this.nodes[t], delete e[this.ID_PROP]
      }, Kt.prototype.getId = function (e) {
        return e[this.ID_PROP]
      }, Kt.prototype.getNode = function (e) {
        return this.nodes[e]
      }, $t.prototype.observerCallback = function (e) {
        var t = new(S.get("Array"));
        e.forEach(function (e) {
          (e = this.processMutation(e)) && t.push(e)
        }, this), t.length && this.addMutation({
          time: _() - I.startTime,
          mutations: t
        })
      }, $t.prototype.processMutation = function (e) {
        switch (e.type) {
          case "childList":
            return this.processChildList(e);
          case "attributes":
            return this.processAttributes(e);
          case "characterData":
            return this.processCharacterData(e);
          default:
            return
        }
      }, $t.prototype.processChildList = function (e) {
        var t, n = S.get("Array"),
          i = new n,
          r = new n;
        for (t = 0; t < e.addedNodes.length; t++) i = this.processAddedNode(e.addedNodes[t], i);
        for (t = 0; t < e.removedNodes.length; t++) {
          var o = e.removedNodes[t];
          o.parentNode && o.parentElement || !this.knownNodes.getId(o) || (r.push(this.serializeNode(o)), this.knownNodes.delete(o))
        }
        return i.length || r.length ? {
          type: "childList",
          addedNodes: i,
          removedNodes: r
        } : null
      }, $t.prototype.processAddedNode = function (e, t) {
        var n = S.get("Node"),
          i = S.get("Array");
        if (t = t || new i, e.tagName && "form" === e.tagName.toLowerCase() && I.formAnalysis._addForm(null, e), e.tagName && ("input" === e.tagName.toLowerCase() || "select" === e.tagName.toLowerCase())) {
          var r = _e.createEvent(document, "vwo_element_added");
          r.data = e, _e.dispatchEvent(document, r)
        }
        if (e.parentNode && e.parentNode.nodeType !== n.DOCUMENT_FRAGMENT_NODE) {
          var o = this.serializeNode(e);
          o.previousSibling = this.serializeNode(e.previousSibling), o.parentNode = this.serializeNode(e.parentNode), t.push(o);
          for (var s = e.firstChild; s; s = s.nextSibling) t = this.processAddedNode(s, t)
        }
        return t
      }, $t.prototype.processAttributes = function (e) {
        var t = e.target,
          n = e.attributeName;
        if (!t.parentNode) return null;
        this.knownNodes.getId(t.parentNode) || this.serializeNodeWrapper(t.parentNode);
        var i = this.serializeNode(t);
        return i.type = "attributes", i.name = n, i.value = "value" === n || "label" === n ? M.handleProtected(t, I.Recording.anonymizeKeys, n) : t.getAttribute(n), "jetzoom-blank" !== t.className && "jetzoom-lens" !== t.className || 142952 !== window._vwo_acc_id && 230507 !== window._vwo_acc_id || (i.value = "", i.name = "vwo-" + n), i
      }, $t.prototype.processCharacterData = function (e) {
        var t = e.target;
        if (!t.parentNode || !this.knownNodes.getId(t.parentNode)) return null;
        var n = this.serializeNode(t);
        return n.type = "characterData", n.textContent = M.getNodeProperty(t, t.textContent, I.Recording.anonymizeKeys), n
      }, $t.prototype.serializeNode = function (e) {
        var t = S.get("Node"),
          n = S.get("Array");
        if (null === e) return null;
        I.extractLinkHrefForSnapshotting(e);
        var i = this.knownNodes.getId(e);
        if (i) return {
          id: i
        };
        var r = {
          nodeType: e.nodeType,
          id: this.knownNodes.add(e)
        };
        switch (r.nodeType) {
          case t.DOCUMENT_TYPE_NODE:
            r.name = e.name, r.publicId = e.publicId, r.systemId = e.systemId;
            break;
          case t.COMMENT_NODE:
          case t.TEXT_NODE:
            r.textContent = M.getNodeProperty(e, e.textContent, I.Recording.anonymizeKeys);
            break;
          case t.ELEMENT_NODE:
            r.tagName = e.tagName, r.attributes = new n;
            for (var o = 0; o < e.attributes.length; o++) {
              var s = e.attributes[o];
              r.attributes.push({
                name: s.name,
                value: "value" === s.name || "label" === s.name ? M.handleProtected(e, I.Recording.anonymizeKeys, s.name) : s.value
              })
            }
        }
        return r
      }, $t.prototype.serializeNodeWrapper = function (e) {
        null !== e && (this.serializeNode(e), e.parentNode && !this.knownNodes.getId(e.parentNode) && this.serializeNodeWrapper(e.parentNode))
      }, $t.prototype.addMutation = function (e) {
        this.mutations.push(e)
      }, $t.prototype.init = function (e) {
        e && $t.bind(this)(), this.knownNodes.add(this.target);
        for (var t = this.target.firstChild; t; t = t.nextSibling) this.knownNodes.add(t, !0);
        var n;
        if ("undefined" != typeof MutationObserver ? n = MutationObserver : "undefined" != typeof WebKitMutationObserver && (n = window.WebKitMutationObserver), n) {
          this.observer ? this.observer.disconnect() : this.observer = new n(Gt.bind(this));
          this.observer.observe(this.target, {
            childList: !0,
            attributes: !0,
            characterData: !0,
            subtree: !0
          });
          var i = this;
          window.addEventListener("unload", function () {
            i.observer.disconnect()
          }), Ye.init(this)
        }
      }, I.Mutations = new $t(document);
      var Qt = I.Mutations;
      I.__es6hack = 1, Qt.__es6hack = 1, I.__es6hack = 1, Yt(["Recording", "formAnalysis", "Mutations"])
    }();

  });
})();
window.VWO = window.VWO || [];
VWO.v_o = "3.0.94";
var IS_SAFARI_ITP = !1;
! function () {
  VWO.v_t = "6.0.176",
    function () {
      var a = function (a, b) {
        var c = function () {
          a() ? b() : setTimeout(c, 100)
        };
        c()
      };
      a(function () {
        return VWO && VWO._ && VWO._.libLoaded
      }, function () {
        ! function () {
          var a = {},
            b = {},
            c = {};
          a = function (a) {
            var b = {
              TRACK_PAGE_COOKIE_NAME: "_vwo_p",
              FUNNEL_EXPIRY: 100,
              INITIAL_PRICING_VERSION: 0,
              FEATURE_BUCKET_INDEX: 1,
              SAMPLING_VERSION_INDEX: 2,
              TRACK_GLOBAL_COOKIE_EXPIRY_STATE_INDEX: 3,
              FUNNEL_INFORMATION_INDEX: 2,
              GOAL_INFORMATION_INDEX: 3,
              ANALYZE_INFORMATION_INDEX: 4,
              CRO_START_TIMESTAMP_INDEX: 5,
              PAGE_ID_INFORMATION_INDEX: 1,
              ANALYSE_SERVER_NAME_INDEX: 2,
              TRACK_PAGE_ID_INFORMATION_INDEX: 3
            };
            return VWO._.commonUtil.extend(b, VWO._.CookieEnum), b
          }(a), b = function (a, b) {
            var c = VWO._.commonUtil,
              d = {
                analyze: {}
              },
              e = 0,
              f = function () {
                var a = j.getDataStore(),
                  c = {};
                if (a) {
                  var d = a.split(":")[b.ANALYZE_INFORMATION_INDEX];
                  c = i(d)
                }
                return c
              },
              g = function () {
                var a = j.getDataStore();
                a && (a = a.split(":"), a[b.ANALYZE_INFORMATION_INDEX] = h(d.analyze), j.setDataStore(a.join(":")))
              },
              h = function (a) {
                for (var b = c.getKeys(a), d = b.length, e = ""; d--;) e += b[d] + "_" + a[b[d]] + (0 === d ? "" : ",");
                return e
              },
              i = function (a) {
                var b, c, d, f = {};
                if (!a) return f;
                for (a = a.split(","), e = 0; e < a.length; e++) b = a[e].split("_"), c = b[0], d = b[1], f[c] = d;
                return f
              },
              j = {
                init: function () {
                  d.analyze = f()
                },
                includeAnalyzeCampaign: function (a) {
                  d.analyze[a] = "1", g()
                },
                excludeAnalyzeCampaign: function (a) {
                  d.analyze[a] = "0", g()
                },
                isAnalyzeCampaignIncluded: function (a) {
                  if ("1" === d.analyze[a] || 1 === d.analyze[a]) return "1"
                },
                isAnalyzeCampaignExcluded: function (a) {
                  return "0" === d.analyze[a] || 0 === d.analyze[a]
                }
              };
            return VWO._.commonUtil.extend(j, VWO._.commonCookieHandler), j
          }(b, a), c = function (a, b, c) {
            if (window.___vwo = 1, !VWO._.track.loaded) {
              var d = VWO._.utils,
                e = VWO._.CampaignEnum,
                f = VWO._.GoalsEnum,
                g = VWO._.libUtils,
                h = VWO._.cookies,
                i = VWO._.EventsEnum,
                j = VWO._.triggerEvent,
                k = VWO._.commonUtil,
                l = VWO._.coreLib,
                m = VWO._.vwoLib,
                n = (VWO._.campaign, VWO._.listener),
                o = VWO._.sessionInfoService,
                p = VWO._.tags,
                q = window._vwo_acc_id,
                r = window._vwo_exp,
                s = window._vwo_exp_ids;
              c.FUNNEL_EXPIRY = VWO.FUNNEL_EXPIRY_CUSTOM || 100;
              var t = {
                setUp: function () {
                  t.preProcessData()
                },
                init: function () {
                  return t.initiated || g.doesUuidCookiesExist() || (h.erase(c.TRACK_SESSION_COOKIE_NAME), h.erase(c.TRACK_GLOBAL_COOKIE_NAME)), t.expireGlobalCookie(), t.expireGoals(), t.createGlobalCookieReturnEligibility() ? (t.isUserBucketed() ? t.startSession() : j(i.RECORDING_NOT_ELIGIBLE, "USER_NOT_BUCKETED"), t.expireFunnels(k.getServerStartTimestamp(!0)), b.init(), t.initiated = !0, t.visitorRetracked = !1, !0) : (j(i.RECORDING_NOT_ELIGIBLE, "URL_NOT_MATCHING"), !1)
                },
                preProcessData: function () {
                  VWO.data.url = VWO.data.url || {}, VWO.data.url.i = VWO.data.url.i || ".*"
                },
                isUserEligible: function () {
                  var a = l.compareUrlWithIncludeExcludeRegex(l.getCurrentUrl(), VWO.data.url.i, VWO.data.url.e);
                  return a.didMatch
                },
                expireGlobalCookie: function () {
                  t.shouldExpireGlobalCookie() && (h.erase(c.TRACK_GLOBAL_COOKIE_NAME), h.erase(c.TRACK_SESSION_COOKIE_NAME))
                },
                getLatestSamplingVersion: function () {
                  return window.VWO.data.pvn || c.INITIAL_PRICING_VERSION
                },
                getCpt: function () {
                  return window.VWO.data.cpt || 0
                },
                updateTrackPageId: function () {
                  var a = t.getTrackPageId() + 1;
                  return t.markTrackPageId(a), a
                },
                getTrackPageId: function () {
                  var a = o.getSNCookieValueByIndex(c.TRACK_PAGE_ID_INFORMATION_INDEX);
                  return a ? parseInt(a, 10) : 0
                },
                markTrackPageId: function (a) {
                  o.setSNCookieValueByIndex(c.TRACK_PAGE_ID_INFORMATION_INDEX, a)
                },
                getCroStartTimestamp: function () {
                  return b.getDataInfoByIndex(c.CRO_START_TIMESTAMP_INDEX)
                },
                setCroStartTimestamp: function () {
                  var a = k.getCurrentTimestamp(!0) - o.getFirstSessionId();
                  b.setDataInfoByIndex(c.CRO_START_TIMESTAMP_INDEX, a)
                },
                shouldExpireGlobalCookie: function () {
                  var a, d, e = b.getDataStore(),
                    f = b.getMetaInfoByIndex(c.TRACK_GLOBAL_COOKIE_EXPIRY_STATE_INDEX);
                  if (e) {
                    var g = k.getServerStartTimestamp(!0);
                    a = o.getFirstSessionId();
                    var h = t.getCroStartTimestamp();
                    if (d = 24 * c.TRACK_GLOBAL_COOKIE_EXPIRY * 60 * 60 + h + a, d < g) return !o.getSessionStore() || (f || b.setMetaInfoByIndex(c.TRACK_GLOBAL_COOKIE_EXPIRY_STATE_INDEX, 1), !1);
                    var i = t.getCpt();
                    if (i > a) return !0;
                    var j = t.getLatestSamplingVersion(),
                      l = b.getMetaInfoByIndex(c.SAMPLING_VERSION_INDEX) || c.INITIAL_PRICING_VERSION;
                    if (l < j);
                    else if (Math.abs(l) < Math.abs(j) && t.isUserBucketed()) return !0
                  }
                  return !1
                },
                _markFunnelValue: function (a, b, d) {
                  this._markFeatureValue(c.FUNNEL_INFORMATION_INDEX, a, [b, d, o.getRelativeSessionId(), r[a].v])
                },
                _isFunnelValue: function (a, b, d) {
                  return this._isFeatureValue(c.FUNNEL_INFORMATION_INDEX, a, [b, d])
                },
                expireFunnels: function (a) {
                  var d, e, f, g, h, i, j = b.getDataStore(),
                    k = o.getFirstSessionId();
                  if (j) {
                    for (j = j.split(":"), d = j[c.FUNNEL_INFORMATION_INDEX].split(","), e = d.length; e--;) f = d[e].split("_"), g = f[0], h = +f[3] + 24 * c.FUNNEL_EXPIRY * 60 * 60 + k, i = +f[4], (h < a || r[g] && r[g].v > i) && d.splice(e, 1);
                    j[c.FUNNEL_INFORMATION_INDEX] = d.join(","), j = j.join(":"), b.setDataStore(j)
                  }
                },
                expireGoals: function () {
                  var a = o.getSessionStore();
                  a && !t.visitorRetracked || b.deleteDataStoreInfoByIndex(c.GOAL_INFORMATION_INDEX)
                },
                getSessionIdOfFunnel: function (a) {
                  var c = b.getDataStore(),
                    d = c.match(new RegExp("[:,]" + a + "_[^_]*_._([^_]*)_[^,:]*"));
                  return d && d[1] ? +d[1] + o.getFirstSessionId() : 0
                },
                _markFeatureValue: function (a, c, d, e) {
                  var f = e ? b.getMetaStore() : b.getDataStore(),
                    g = f.split(":"),
                    h = c,
                    i = g[a],
                    j = g.length;
                  if (!i)
                    for (; j <= a;) g[j] = "", j++;
                  i = g[a];
                  var k = i.match(new RegExp("(?:^|,)(" + c + "_[^,]+)"));
                  "undefined" == typeof d && (d = []), d instanceof Array || (d = [d]);
                  for (var l = 0; l < d.length; l++) h += "_" + d[l];
                  k ? g[a] = g[a].replace(new RegExp("(^|,)(" + c + "_[^,]+)"), "$1" + h) : g[a] = g[a] + (0 === g[a].length ? "" : ",") + h, f = g.join(":"), e ? b.setMetaStore(f) : b.setDataStore(f)
                },
                _isFeatureValue: function (a, d, e, f) {
                  var g, h, i = f ? b.getMetaStore() : b.getDataStore(),
                    j = i.split(":"),
                    k = j[a];
                  if ("undefined" == typeof e && (e = []), e instanceof Array || (e = [e]), a === c.FUNNEL_INFORMATION_INDEX) {
                    g = e[1];
                    var l = e[0];
                    l = l || "[^_]*", g = "undefined" == typeof g || null === g ? "." : g, h = new RegExp("(,|^)" + d + "_" + l + "_" + g)
                  } else g = e[0], g = "undefined" == typeof g || null === g ? "." : g, h = new RegExp("(,|^)" + d + "_" + g);
                  return !!h.test(k) && "1"
                },
                _markGoalValue: function (a, b) {
                  this._markFeatureValue(c.GOAL_INFORMATION_INDEX, a, b)
                },
                _isGoalValue: function (a, b) {
                  return this._isFeatureValue(c.GOAL_INFORMATION_INDEX, a, b)
                },
                isCroEnabled: function () {
                  var a = h.get(c.TRACK_GLOBAL_COOKIE_NAME);
                  if (!a) return !1;
                  var d = b.getMetaStore().split(":") || [];
                  return !(!d[c.FEATURE_BUCKET_INDEX] && !d[c.SAMPLING_VERSION_INDEX]) || void 0
                },
                createGlobalCookieReturnEligibility: function () {
                  if (!t.isCroEnabled()) {
                    if (!t.isUserEligible()) return !1;
                    h.get(c.TRACK_GLOBAL_COOKIE_NAME) || (g.createUUIDCookie(), o.createGlobalCookie()), t.setCroStartTimestamp()
                  }
                  return t.markFeatureLevelBucketing(), t.setSamplingVersion(), !0
                },
                markFeatureLevelBucketing: function () {
                  for (var a = o.getPcTraffic(), b = window._vwo_pc_custom || window.VWO.data.pc, d = k.getKeys(b), e = d.length; e--;) t._isFeatureValue(c.FEATURE_BUCKET_INDEX, d[e], null, 1) || t._markFeatureValue(c.FEATURE_BUCKET_INDEX, d[e], +(a < b[d[e]]), !0)
                },
                setSamplingVersion: function () {
                  b.setMetaInfoByIndex(c.SAMPLING_VERSION_INDEX, t.getLatestSamplingVersion())
                },
                isUserBucketed: function () {
                  for (var a = window.VWO.data.pc, b = k.getKeys(a), c = b.length; c--;)
                    if (t.isFeatureBucketed(b[c])) return !0
                },
                isFeatureBucketed: function (a) {
                  return !a || t._isFeatureValue(c.FEATURE_BUCKET_INDEX, a, 1, !0)
                },
                excludeFunnel: function (a) {
                  t._markFunnelValue(a, 0, 0)
                },
                includeFunnel: function (a) {
                  t._markFunnelValue(a, 0, 1)
                },
                includeAnalyzeCampaign: function (a) {
                  b.includeAnalyzeCampaign(a)
                },
                excludeAnalyzeCampaign: function (a) {
                  b.excludeAnalyzeCampaign(a)
                },
                excludeGoal: function (a) {
                  t._markGoalValue(a, 0)
                },
                includeGoal: function (a) {
                  t._markGoalValue(a, 1)
                },
                shouldAddGoalInFunnel: function (a, d) {
                  d = parseInt(d, 10);
                  var e, f = t.getGoalIndexInFunnel(a, d);
                  if (f < 0) return !1;
                  var g, h, i, j, k, m, n = r[a].g[0].id === d,
                    o = b.getDataStore().split(":")[c.FUNNEL_INFORMATION_INDEX].split(",");
                  for (g = o.length; g--;)
                    if (h = o[g].split("_"), i = h[0], i === a) {
                      if (m = !0, j = +h[1], k = +h[2], !k) return !1;
                      e = t.getGoalIndexInFunnel(a, j) + 1 === f
                    } return n && !m && (l.runCampaigns({
                    keepElementLoadedRunning: !1,
                    expIds: [a],
                    isManual: !0
                  }), t.isFunnelIncluded(a) && (e = !0)), e
                },
                getGoalIndexInFunnel: function (a, b) {
                  var c;
                  for (c = 0; c < r[a].g.length; c++)
                    if (r[a].g[c].id === b) return c;
                  return -1
                },
                getGoalsString: function (a) {
                  var b, c = "";
                  for (b = 0; b < a.length; b++) c = c + a[b].id + ("REVENUE_TRACKING" === a[b].type ? "_1" : "") + (b === a.length - 1 ? "" : ",");
                  return c
                },
                getGtAndF: function (a) {
                  for (var b, c, f = s.length, g = {}; f--;) b = s[f], r[b].type === e.FUNNEL_CAMPAIGN && this.shouldAddGoalInFunnel(b, a) && (t._markFunnelValue(b, a, 1), g[b] = this.getGoalsString(r[b].g) + ":" + t.getSessionIdOfFunnel(b));
                  return c = k.getKeys(g), "&gt=" + +!t.isGoalTriggered(a) + "_" + c.join(",") + "&f=" + d.jsonStringify(g)
                },
                startSession: function () {
                  var a, b, d, e, f, h, k = document.URL,
                    l = "s.gif?account_id=" + q + g.getUUIDString(g.createUUIDCookie()),
                    m = 1;
                  o.isSessionInfoSynced() ? (o.updateAndSyncPageId(), h = t.updateTrackPageId(), a = p.getTags(), b = p.getEgTags(), f = o.getSessionId(), m = VWO._.pageId, e = f > o.getFirstSessionId(), l = l + "&s=" + f + "&p=" + m, window._vis_debug || g.sendCall(l + (a ? "&tags=" + a : "") + (b ? "&eg=" + b : "") + "&update=1&cq=1")) : (m = 1, p.refresh(), a = p.getTags(), b = p.getEgTags(), o.getSessionStore() ? (o.updateAndSyncPageId(), m = VWO._.pageId, o.setSNCookieValueByIndex(c.SESSION_SYNCED_STATE_INDEX, 1)) : (d = o.getRelativeSessionTimestamp(this), o.initializeSession(d + ":" + m + ":::1"), VWO._.pageId = m), h = t.updateTrackPageId(), f = o.getSessionId(), l = l + "&s=" + f + "&p=" + m, e = f > o.getFirstSessionId(), window._vis_debug || g.sendCall(l + "&ed=" + g.extraData(!0) + "&cu=" + encodeURIComponent(o.getInfo().cu || k) + (a ? "&tags=" + a : "") + (b ? "&eg=" + b : "") + "&r=" + +e + "&cq=1")), o.setVisitorInformation(), t.setAnalyzeServerName(), j(i.TRACK_SESSION_CREATED, f, m, e, 1 === h, h), o.updateSession()
                },
                setAnalyzeServerName: function () {
                  var a = o.getSNCookieValueByIndex(c.ANALYSE_SERVER_NAME_INDEX);
                  a ? window.VWO.data.asn = a : (window.VWO.data.as && o.setSNCookieValueByIndex(c.ANALYSE_SERVER_NAME_INDEX, window.VWO.data.as), window.VWO.data.asn = window.VWO.data.as || "dev.visualwebsiteoptimizer.com")
                },
                isGoalIncluded: function (a) {
                  return this._isGoalValue(a, 1) || this._isGoalValue(a, 2)
                },
                isGoalExcluded: function (a) {
                  return this._isGoalValue(a, 0)
                },
                isAnalyzeCampaignExcluded: function (a) {
                  return b.isAnalyzeCampaignExcluded(a)
                },
                isAnalyzeCampaignIncluded: function (a) {
                  return b.isAnalyzeCampaignIncluded(a)
                },
                isFunnelIncluded: function (a) {
                  return t._isFunnelValue(a, void 0, 1)
                },
                isFunnelExcluded: function (a) {
                  return t._isFunnelValue(a, void 0, 0)
                },
                markGoalTriggered: function (a, b) {
                  var c = r[a].goals[b];
                  t._markGoalValue(b, 2), c.type === f.SEPARATE_PAGE && (c.pageVisited = 1)
                },
                isGoalTriggered: function (a) {
                  return t._isGoalValue(a, 2)
                },
                shouldTriggerGoal: function (a, b) {
                  var c = r[a].goals[b],
                    d = !1;
                  if (t._isGoalValue(b, 0)) return !1;
                  if (t._isGoalValue(b, 1) && (d = !c.pageVisited), t._isGoalValue(b, 2) && (d = !1), !c.pageVisited && !d)
                    for (var g, h = s.length; h--;) g = s[h], r[g].type === e.FUNNEL_CAMPAIGN && this.shouldAddGoalInFunnel(g, b) && (d = !0);
                  return c.type === f.SEPARATE_PAGE && (c.pageVisited = !0), d
                },
                loaded: !0,
                initiated: !1
              };
              k.extend(VWO._.track, t), t = VWO._.track;
              var u, v, w = function () {
                  (3 !== VWO.data.tcVersion || u) && (t.setUp(), t.init() && l.runCampaigns({
                    keepElementLoadedRunning: !1,
                    expIds: k.filter(s, function (a) {
                      return g.isSessionBasedCampaign(a)
                    }),
                    isManual: !1
                  }))
                },
                x = function () {
                  (3 !== VWO.data.tcVersion || u) && v && (t.initiated || (w(), m.init("track")))
                };
              n.onEventReceive(i.POST_URL_CHANGE, w), n.onEventReceive(i.RETRACK_VISITOR, function () {
                t.visitorRetracked = !0, t.init(), l.runCampaigns(!1, k.filter(s, function (a) {
                  try {
                    window._vwo_exp[a].combination_chosen
                  } catch (b) {
                    window.VWO._.customError && window.VWO._.customError({
                      msg: "LOGGING: experiment id " + a + "not found in " + window._vwo_exp_ids,
                      url: "track-lib.ts",
                      lineno: 879,
                      colno: 9
                    })
                  }
                  return window._vwo_exp && window._vwo_exp[a] ? g.isSessionBasedCampaign(a) && ((window._vwo_exp[a].combination_chosen = void 0) || 1) : g.isSessionBasedCampaign(a)
                })), t.visitorRetracked = !1
              }), n.onEventReceive(i.NEW_SESSION_CREATED, function () {
                t.visitorRetracked = !0
              }), n.onEventReceive(i.NOT_REDIRECTING, function () {
                v || (v = !0, x())
              }), n.onEventReceive(i.UPDATE_SETTINGS_CALL, function () {
                u || (u = !0, x())
              })
            }
            return t
          }(c, b, a)
        }()
      })
    }()
}();