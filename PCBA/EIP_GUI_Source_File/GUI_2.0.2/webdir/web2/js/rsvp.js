(function () {
  var l, p;
  (function () {
    var e = {},
      b = {};
    l = function (g, f, a) {
      e[g] = { deps: f, callback: a };
    };
    p = function (g) {
      if (b[g]) return b[g];
      b[g] = {};
      for (
        var f = e[g],
          a = f.deps,
          f = f.callback,
          c = [],
          d,
          m = 0,
          k = a.length;
        m < k;
        m++
      )
        "exports" === a[m] ? c.push((d = {})) : c.push(p(a[m]));
      a = f.apply(this, c);
      return (b[g] = d || a);
    };
  })();
  l(
    "rsvp",
    "rsvp/events rsvp/promise rsvp/node rsvp/all rsvp/hash rsvp/defer rsvp/config rsvp/resolve exports".split(
      " "
    ),
    function (e, b, g, f, a, c, d, m, k) {
      e = e.EventTarget;
      g = g.denodeify;
      f = f.all;
      a = a.hash;
      c = c.defer;
      var h = d.config;
      d = m.resolve;
      k.Promise = b.Promise;
      k.EventTarget = e;
      k.all = f;
      k.hash = a;
      k.defer = c;
      k.denodeify = g;
      k.configure = function (a, c) {
        h[a] = c;
      };
      k.resolve = d;
    }
  );
  l("rsvp/async", ["exports"], function (e) {
    var b = "undefined" !== typeof window ? window : {},
      b = b.MutationObserver || b.WebKitMutationObserver;
    if (
      "undefined" !== typeof process &&
      "[object process]" === {}.toString.call(process)
    )
      b = function (a, d) {
        process.nextTick(function () {
          a.call(d);
        });
      };
    else if (b) {
      var g = [],
        f = new b(function () {
          var a = g.slice();
          g = [];
          a.forEach(function (a) {
            a[0].call(a[1]);
          });
        }),
        a = document.createElement("div");
      f.observe(a, { attributes: !0 });
      window.addEventListener("unload", function () {
        f.disconnect();
        f = null;
      });
      b = function (c, d) {
        g.push([c, d]);
        a.setAttribute("drainQueue", "drainQueue");
      };
    } else
      b = function (a, d) {
        setTimeout(function () {
          a.call(d);
        }, 1);
      };
    e.async = b;
  });
  l("rsvp/hash", ["rsvp/defer", "exports"], function (e, b) {
    function g(a) {
      var c = 0,
        d;
      for (d in a) c++;
      return c;
    }
    var f = e.defer;
    b.hash = function (a) {
      var c = {},
        d = f(),
        m = g(a);
      0 === m && d.resolve({});
      var k = function (a) {
          return function (f) {
            c[a] = f;
            0 === --m && d.resolve(c);
          };
        },
        h = function (a) {
          d.reject(a);
        },
        b;
      for (b in a)
        a[b] && "function" === typeof a[b].then
          ? a[b].then(k(b), h)
          : ((c[b] = a[b]), 0 === --m && d.resolve(c));
      return d.promise;
    };
  });
  l("rsvp/node", ["rsvp/promise", "rsvp/all", "exports"], function (e, b, g) {
    function f(a, c) {
      return function (d, f) {
        d
          ? c(d)
          : 2 < arguments.length
          ? a(Array.prototype.slice.call(arguments, 1))
          : a(f);
      };
    }
    var a = e.Promise,
      c = b.all;
    g.denodeify = function (d) {
      return function () {
        var b = Array.prototype.slice.call(arguments),
          k,
          g,
          e = new a(function (a, c) {
            k = a;
            g = c;
          });
        c(b).then(function (a) {
          a.push(f(k, g));
          try {
            d.apply(this, a);
          } catch (n) {
            g(n);
          }
        });
        return e;
      };
    };
  });
  l("rsvp/defer", ["rsvp/promise", "exports"], function (e, b) {
    var g = e.Promise;
    b.defer = function () {
      var f = {},
        a = new g(function (a, d) {
          f.resolve = a;
          f.reject = d;
        });
      f.promise = a;
      return f;
    };
  });
  l("rsvp/config", ["rsvp/async", "exports"], function (e, b) {
    var g = {};
    g.async = e.async;
    b.config = g;
  });
  l("rsvp/all", ["rsvp/defer", "exports"], function (e, b) {
    var g = e.defer;
    b.all = function (f) {
      var a = [],
        c = g(),
        d = f.length;
      0 === d && c.resolve([]);
      for (
        var b = function (f) {
            return function (b) {
              a[f] = b;
              0 === --d && c.resolve(a);
            };
          },
          k = function (a) {
            c.reject(a);
          },
          e = 0;
        e < f.length;
        e++
      )
        f[e] && "function" === typeof f[e].then
          ? f[e].then(b(e), k)
          : ((a[e] = f[e]), 0 === --d && c.resolve(a));
      return c.promise;
    };
  });
  l("rsvp/resolve", ["rsvp/promise", "exports"], function (e, b) {
    var g = e.Promise;
    b.resolve = function (f) {
      return new g(function (a, c) {
        var d;
        try {
          "function" === typeof f || ("object" === typeof f && null !== f)
            ? ((d = f.then), "function" === typeof d ? d.call(f, a, c) : a(f))
            : a(f);
        } catch (m) {
          c(m);
        }
      });
    };
  });
  l("rsvp/promise", ["rsvp/config", "rsvp/events", "exports"], function (
    e,
    b,
    g
  ) {
    function f(c) {
      return a(c) || ("object" === typeof c && null !== c);
    }
    function a(a) {
      return "function" === typeof a;
    }
    function c(b, e) {
      b === e
        ? d(b, e)
        : f(e) && a(e.then)
        ? e.then(
            function (a) {
              e !== a ? c(b, a) : d(b, a);
            },
            function (a) {
              m(b, a);
            }
          )
        : d(b, e);
    }
    function d(a, c) {
      k.async(function () {
        a.trigger("promise:resolved", { detail: c });
        a.isFulfilled = !0;
        a.fulfillmentValue = c;
      });
    }
    function m(a, c) {
      k.async(function () {
        a.trigger("promise:failed", { detail: c });
        a.isRejected = !0;
        a.rejectedReason = c;
      });
    }
    var k = e.config;
    e = b.EventTarget;
    var h = function (a) {
        var d = this,
          b = !1;
        if ("function" !== typeof a)
          throw new TypeError(
            "You must pass a resolver function as the sole argument to the promise constructor"
          );
        if (!(d instanceof h)) return new h(a);
        this.on(
          "promise:resolved",
          function (a) {
            this.trigger("success", { detail: a.detail });
          },
          this
        );
        this.on(
          "promise:failed",
          function (a) {
            this.trigger("error", { detail: a.detail });
          },
          this
        );
        a(
          function (a) {
            b || ((b = !0), c(d, a));
          },
          function (a) {
            b || ((b = !0), m(d, a));
          }
        );
      },
      l = function (d, b, e, g) {
        var k = a(e),
          h,
          l,
          q,
          n;
        if (k)
          try {
            (h = e(g.detail)), (q = !0);
          } catch (r) {
            (n = !0), (l = r);
          }
        else (h = g.detail), (q = !0);
        f(h) && a(h.then)
          ? h.then(
              function (a) {
                c(b, a);
              },
              function (a) {
                m(b, a);
              }
            )
          : k && q
          ? c(b, h)
          : n
          ? m(b, l)
          : "resolve" === d
          ? c(b, h)
          : "reject" === d && m(b, h);
      };
    h.prototype = {
      constructor: h,
      then: function (a, c) {
        var d = new h(function () {});
        this.isFulfilled &&
          k.async(function () {
            l("resolve", d, a, { detail: this.fulfillmentValue });
          }, this);
        this.isRejected &&
          k.async(function () {
            l("reject", d, c, { detail: this.rejectedReason });
          }, this);
        this.on("promise:resolved", function (c) {
          l("resolve", d, a, c);
        });
        this.on("promise:failed", function (a) {
          l("reject", d, c, a);
        });
        return d;
      },
    };
    e.mixin(h.prototype);
    g.Promise = h;
  });
  l("rsvp/events", ["exports"], function (e) {
    var b = function (a, c) {
        this.type = a;
        for (var d in c) c.hasOwnProperty(d) && (this[d] = c[d]);
      },
      g = function (a, c) {
        for (var d = 0, b = a.length; d < b; d++) if (a[d][0] === c) return d;
        return -1;
      },
      f = function (a) {
        var c = a._promiseCallbacks;
        c || (c = a._promiseCallbacks = {});
        return c;
      };
    e.EventTarget = {
      mixin: function (a) {
        a.on = this.on;
        a.off = this.off;
        a.trigger = this.trigger;
        return a;
      },
      on: function (a, c, d) {
        var b = f(this),
          e,
          h;
        a = a.split(/\s+/);
        for (d = d || this; (h = a.shift()); )
          (e = b[h]) || (e = b[h] = []), -1 === g(e, c) && e.push([c, d]);
      },
      off: function (a, c) {
        var d = f(this),
          b,
          e;
        for (a = a.split(/\s+/); (b = a.shift()); )
          c
            ? ((b = d[b]), (e = g(b, c)), -1 !== e && b.splice(e, 1))
            : (d[b] = []);
      },
      trigger: function (a, c) {
        var d, e, g, h;
        if ((d = f(this)[a]))
          for (var l = 0; l < d.length; l++)
            (e = d[l]),
              (g = e[0]),
              (e = e[1]),
              "object" !== typeof c && (c = { detail: c }),
              (h = new b(a, c)),
              g.call(e, h);
      },
    };
  });
  window.RSVP = p("rsvp");
})();
