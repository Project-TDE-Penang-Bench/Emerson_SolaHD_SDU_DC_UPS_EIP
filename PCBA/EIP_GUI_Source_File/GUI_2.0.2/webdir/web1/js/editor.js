var $jscomp = {
  scope: {},
  findInternal: function (k, y, q) {
    k instanceof String && (k = String(k));
    for (var u = k.length, A = 0; A < u; A++) {
      var x = k[A];
      if (y.call(q, x, A, k)) return { i: A, v: x };
    }
    return { i: -1, v: void 0 };
  },
};
$jscomp.defineProperty =
  "function" == typeof Object.defineProperties
    ? Object.defineProperty
    : function (k, y, q) {
        if (q.get || q.set)
          throw new TypeError("ES3 does not support getters and setters.");
        k != Array.prototype && k != Object.prototype && (k[y] = q.value);
      };
$jscomp.getGlobal = function (k) {
  return "undefined" != typeof window && window === k
    ? k
    : "undefined" != typeof global && null != global
    ? global
    : k;
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.polyfill = function (k, y, q, u) {
  if (y) {
    q = $jscomp.global;
    k = k.split(".");
    for (u = 0; u < k.length - 1; u++) {
      var A = k[u];
      A in q || (q[A] = {});
      q = q[A];
    }
    k = k[k.length - 1];
    u = q[k];
    y = y(u);
    y != u &&
      null != y &&
      $jscomp.defineProperty(q, k, {
        configurable: !0,
        writable: !0,
        value: y,
      });
  }
};
$jscomp.polyfill(
  "Array.prototype.find",
  function (k) {
    return k
      ? k
      : function (k, q) {
          return $jscomp.findInternal(this, k, q).v;
        };
  },
  "es6-impl",
  "es3"
);
var editor = (function () {
  function k(a, f) {
    return a.length > f ? a.substring(0, f - 3) + "..." : a;
  }
  function y(a) {
    for (var f = [], d = 0; d < a.length; d++)
      (f[d] = "0" + a[d].charCodeAt(0).toString(16).toUpperCase()),
        (f[d] = f[d].substr(-2));
    return f;
  }
  function q(a) {
    a = a.constructor === Array ? a[0] : a;
    14 < a.toString().length && (a = a.toExponential(8));
    return a;
  }
  function u(a, f) {
    if (null == a.numsubelements) return !1;
    var d;
    d = 1 < a.datatype.length ? f : 0;
    var e =
      (a.datatype[d] == abp.OCTET || a.datatype[d] == abp.CHAR) &&
      1 < a.numsubelements[f];
    return (a.datatype[d] == abp.CHAR && 1 < a.numelements) || e;
  }
  function A(a) {
    var f,
      d,
      e = null;
    1 < a.datatype.length
      ? ((f = abp.parseStruct(a.max, a.datatype, z, a.numsubelements)),
        (d = abp.parseStruct(a.min, a.datatype, z, a.numsubelements)),
        null != a["default"] &&
          (e = abp.parseStruct(a["default"], a.datatype, z, a.numsubelements)))
      : ((f = abp.parseArray(a.max, a.datatype[0], z, a.numsubelements[0])),
        (d = abp.parseArray(a.min, a.datatype[0], z, a.numsubelements[0])),
        null != a["default"] &&
          (e = abp.parseArray(
            a["default"],
            a.datatype[0],
            z,
            a.numsubelements[0]
          )));
    for (var c = [], b = 0; b < a.numelements; b++) {
      var l = {};
      1 < a.datatype.length
        ? ((l.datatype = a.datatype[b]),
          (l.descriptor = a.descriptor[b]),
          (l.numsubelements = a.numsubelements[b]),
          (l.min = d[b]),
          (l.max = f[b]),
          (l.elementname = null != a.elementname ? a.elementname[b] : null),
          (l.isStringType = u(a, b)),
          (l["default"] = null != a["default"] ? e[b] : null))
        : ((l.datatype = a.datatype[0]),
          (l.descriptor = a.descriptor[0]),
          (l.numsubelements = a.numsubelements[0]),
          (l.elementname = null != a.elementname ? a.elementname[0] : null),
          (l.isStringType = u(a, 0)),
          l.isStringType
            ? ((l.min = d), (l.max = f))
            : ((l.min = d[0]), (l.max = f[0])),
          (l["default"] = null != a["default"] && null != e ? e[0] : null));
      c.push(l);
    }
    return c;
  }
  function x(a, f, d) {
    var e = $("<option/>");
    f && e.attr("value", f);
    e.text(a);
    d && e.attr("selected", !0);
    return e;
  }
  function L(a, f, d) {
    var e = !1,
      c;
    for (c in f) c == d && (e = !0), a.append(x(f[c], c, c == d));
    e || a.append(x(c + " (no string available)", c, !0));
  }
  function N(a, f, d, e, c) {
    var b = $("<select/>");
    e.append(b);
    b.change(function () {
      b.attr("class", "adi-field-input-edit");
      $(".adi-field-input").attr("disabled", "disabled");
      $(".adi-field-checkbox").attr("disabled", "disabled");
      d.find("button").removeAttr("disabled");
    });
    b.keydown(function (a) {
      13 == a.which && d.find("button").click();
      if (27 == a.which || 9 == a.which)
        b.attr("class", "adi-field-input"),
          $(".adi-field-input").removeAttr("disabled"),
          $(".adi-field-checkbox").removeAttr("disabled"),
          d.find("button").attr("disabled", "disabled"),
          adi.isReadable(f) && b.val(c);
    });
    var l = function (a) {
      var b = 0,
        d;
      for (d in a) if ((b++, 1 < b)) return !0;
      return !1;
    };
    adi
      .enumStrings(a.instance, c)
      .then(function (e) {
        if (l(e)) L(b, e, c);
        else {
          b.append(x(e[c], c, !0));
          var k = $("<img/>"),
            r = x("Loading parameter strings...");
          b.empty();
          k.attr("src", "img/indicator_tiny.gif");
          b.append(r);
          b.attr("readonly", !0);
          d.append(k);
          adi.enumStrings(a.instance).then(function (a) {
            r.remove();
            k.remove();
            L(b, a, c);
          });
        }
        adi.isWritable(f) || b.removeAttr("readonly");
      })
      .then(null, function (a) {
        alert("error " + a);
      });
    b.adiValue = function () {
      return parseInt(b.val(), 10);
    };
    b.adiReadOnly = function (a) {
      a ? b.attr("readonly", !0) : b.removeAttr("readonly");
    };
    return b;
  }
  function E(a, f, d, e, c) {
    var b = $("<input/>");
    b.attr("type", "text");
    b.attr("spellcheck", "false");
    "string" == typeof c &&
      ((a = c.match(/\0/)), null != a && (c = c.substr(0, a.index)));
    b.keydown(function (a) {
      adi.isWritable(f) &&
        (13 == a.which && d.find("button").click(),
        27 == a.which || 9 == a.which
          ? (b.attr("class", "adi-field-input"),
            $(".adi-field-input").removeAttr("disabled"),
            $(".adi-field-checkbox").removeAttr("disabled"),
            d.find("button").attr("disabled", "disabled"),
            adi.isReadable(f) ? b.val(c) : b.val(""))
          : (b.attr("class", "adi-field-input-edit"),
            $(".adi-field-input").attr("disabled", "disabled"),
            $(".adi-field-checkbox").attr("disabled", "disabled"),
            d.find("button").removeAttr("disabled")));
    });
    adi.isReadable(f) && b.attr("value", c);
    e.append(b);
    b.adiValue = function () {
      return b.val();
    };
    b.adiReadOnly = function (a) {
      a ? b.attr("readonly", !0) : b.removeAttr("readonly");
    };
    return b;
  }
  function O(a, f, d, e, c) {
    var b = E(a, f, d, e, c);
    b.adiValue = function () {
      return parseInt(b.val());
    };
    return b;
  }
  function M(a, f, d, e, c) {
    var b = E(a, f, d, e, c);
    b.adiValue = function () {
      return parseInt(b.val());
    };
    return b;
  }
  function P(a, f, d, e, c) {
    var b = E(a, f, d, e, c);
    b.adiValue = function () {
      return new Big(b.val());
    };
    return b;
  }
  function Q(a, f, d, e, c) {
    var b = E(a, f, d, e, c);
    b.adiValue = function () {
      return parseFloat(b.val());
    };
    return b;
  }
  function R(a, f, d, e, c) {
    var b = $("<input/>");
    b.attr("type", "checkbox");
    b.change(function () {
      b.attr("class", "adi-field-checkbox-edit");
      $(".adi-field-checkbox").attr("disabled", "disabled");
      $(".adi-field-input").attr("disabled", "disabled");
      d.find("button").removeAttr("disabled");
    });
    b.keydown(function (a) {
      13 == a.which && d.find("button").click();
      if (27 == a.which || 9 == a.which)
        b.attr("class", "adi-field-checkbox"),
          $(".adi-field-checkbox").removeAttr("disabled"),
          $(".adi-field-input").removeAttr("disabled"),
          d.find("button").attr("disabled", "disabled"),
          adi.isReadable(f) && c
            ? b.prop("checked", !0)
            : b.prop("checked", !1);
    });
    adi.isReadable(f) && c && b.attr("checked", "checked");
    e.append(b);
    b.adiValue = function () {
      return b.prop("checked");
    };
    b.adiReadOnly = function (a) {
      a ? b.attr("disabled", !0) : b.removeAttr("disabled");
    };
    return b;
  }
  function K(a) {
    var f = $("<div/>");
    f.text(a);
    f.adiValue = function () {
      return null;
    };
    f.adiReadOnly = function (a) {};
    return f;
  }
  function S(a, f, d, e) {
    var c = $("<button/>");
    c.addClass("adi-setbtn");
    c.text("Set");
    c.attr("disabled", "disabled");
    c.click(function () {
      var b = f.adiValue(),
        c;
      c = A(a);
      var k;
      if (c[e].datatype != abp.CHAR || 1 < a.datatype.length) k = e;
      if (c[e].datatype == abp.CHAR) {
        var q = b.split("");
        c = abp.encodeArray(q, c[e].datatype, z);
      } else if (u(a, e)) {
        for (var q = b.split(" "), r = 0; r < q.length; r++)
          q[r] = parseInt(q[r], 16);
        c = abp.encodeArray(q, c[e].datatype, z);
      } else {
        if (c[e].datatype != abp.FLOAT && isNaN(b)) {
          alert(
            'Failed to encode value "' +
              b +
              '". Please verify that it is formatted correctly.'
          );
          return;
        }
        c = abp.encodeValue(b, c[e].datatype, z);
      }
      null == c
        ? alert(
            'Failed to encode value "' +
              b +
              '". Please verify that it is formatted correctly.'
          )
        : adi.setValue(a, c, k).then(
            function (b) {
              d.find("button").attr("disabled", "disabled");
              0 != b &&
                alert(
                  "Error (" +
                    abp.errorToString(b) +
                    ") updating parameter " +
                    a.instance
                );
            },
            function (a) {
              alert(a);
            }
          );
    });
    return c;
  }
  function C(a) {
    return "object" == typeof a && "error" in a;
  }
  function T(a) {
    var f = "Fatal processing error(s): ";
    C(a.instance) &&
      (f +=
        "No instance available (" + abp.errorToString(a.instance.error) + ") ");
    C(a.datatype[0]) &&
      (f +=
        "No datatype available (" +
        abp.errorToString(a.datatype[0].error) +
        ") ");
    C(a.numelements) &&
      (f +=
        "No array size available (" +
        abp.errorToString(a.numelements.error) +
        ") ");
    C(a.descriptor[0]) &&
      (f +=
        "No descriptor field available (" +
        abp.errorToString(a.descriptor[0].error) +
        ") ");
    return f;
  }
  var z, D, H;
  return {
    init: function (a, f, d) {
      H = a;
      D = f;
      z = d == abp.FORMAT_LE;
    },
    paginate: function (a, f) {
      0 > a && (a = 0);
      a >= D && (a = D - (a % f));
      a + f >= D && (f = Math.max(D - a, 0));
      return adi.fetch(a, f).then(function (d) {
        H.empty();
        for (var e = 0; e < d.length; e++) {
          var c = $("<tr/>");
          c.attr("class", e % 2 ? "row-1" : "row-2");
          var b = $("<td/>"),
            l = $("<td/>"),
            u = $("<td/>"),
            x = $('<td colspan="2"/>');
          b.text(d[e].instance);
          null == d[e].name && (d[e].name = "Parameter #" + d[e].instance);
          l.text(d[e].name);
          l.addClass("name-col");
          b.addClass("order-col");
          var r = d[e];
          if (
            C(r.instance) ||
            C(r.datatype[0]) ||
            C(r.numelements) ||
            C(r.descriptor[0])
          )
            x.text(T(d[e]));
          else {
            var r = e,
              g = d[e];
            if (null == g.numsubelements) {
              g.numsubelements = [];
              for (var p = 0; p < g.datatype.length; p++)
                g.numsubelements[p] = 1;
            }
            if (null == g.min) {
              for (
                var m = Array(g.datatype.length), p = 0;
                p < g.datatype.length;
                p++
              ) {
                m[p] = Array(g.numsubelements[p]);
                for (var t = 0; t < g.numsubelements[p]; t++)
                  m[p][t] = abp.getTypeMin(g.datatype[p]);
              }
              g.min = abp.encodeStruct(m, g.datatype, z);
            }
            if (null == g.max) {
              m = Array(g.datatype.length);
              for (p = 0; p < g.datatype.length; p++)
                for (
                  m[p] = Array(g.numsubelements[p]), t = 0;
                  t < g.numsubelements[p];
                  t++
                )
                  m[p][t] = abp.getTypeMax(g.datatype[p]);
              g.max = abp.encodeStruct(m, g.datatype, z);
            }
            d[r] = g;
            1 < d[e].datatype.length &&
              null != d[e].elementname &&
              (c.append(b),
              c.append(l),
              c.append(u),
              c.append(x),
              H.append(c),
              (c = $("<tr/>")),
              c.attr("class", e % 2 ? "row-1" : "row-2"),
              (b = $("<td/>")),
              (l = $("<td/>")),
              (u = $("<td/>")),
              (x = $('<td colspan="2"/>')),
              b.addClass("order-col"),
              l.addClass("name-col"));
            g = d[e];
            p = g.numelements;
            r =
              1 < g.datatype.length
                ? C(g.rawvalue)
                  ? Array(g.datatype.length)
                  : abp.parseStruct(g.rawvalue, g.datatype, z, g.numsubelements)
                : C(g.rawvalue)
                ? Array(g.numelements)
                : abp.parseArray(
                    g.rawvalue,
                    g.datatype[0],
                    z,
                    g.numsubelements[0]
                  );
            m = A(g);
            g.datatype[0] == abp.CHAR && 1 == g.datatype.length && (p = 1);
            for (var t = Array(p), h = 0; h < p; h++) {
              var v = "inst" + g.instance + "_" + h,
                n;
              m[h].isStringType
                ? ((n = " "),
                  m[h].datatype == abp.CHAR && (n = ""),
                  (n = 1 < g.datatype.length ? r[h].join(n) : r.join(n)))
                : (n = r ? r[h] : 0);
              t[h] = $("<div/>").attr("id", v);
              var v = $("<div/>"),
                B = !0;
              1 < m[h].numsubelements &&
                m[h].datatype != abp.CHAR &&
                m[h].datatype != abp.OCTET &&
                (B = !1);
              if (B) {
                switch (m[h].datatype) {
                  case abp.BOOL:
                  case abp.BOOL1:
                    n = R(g, m[h].descriptor, t[h], v, n);
                    break;
                  case abp.ENUM:
                    n = N(g, m[h].descriptor, t[h], v, n);
                    break;
                  case abp.UINT8:
                  case abp.SINT8:
                  case abp.UINT16:
                  case abp.SINT16:
                  case abp.UINT32:
                  case abp.SINT32:
                    n = O(g, m[h].descriptor, t[h], v, n);
                    break;
                  case abp.CHAR:
                    n = E(g, m[h].descriptor, t[h], v, n);
                    break;
                  case abp.OCTET:
                    n = m[h].isStringType
                      ? E(g, m[h].descriptor, t[h], v, n)
                      : M(g, m[h].descriptor, t[h], v, n);
                    break;
                  case abp.BIT1:
                  case abp.BIT2:
                  case abp.BIT3:
                  case abp.BIT4:
                  case abp.BIT5:
                  case abp.BIT6:
                  case abp.BIT7:
                  case abp.BITS8:
                  case abp.BITS16:
                  case abp.BITS32:
                    n = M(g, m[h].descriptor, t[h], v, n);
                    break;
                  case abp.FLOAT:
                    n = Q(g, m[h].descriptor, t[h], v, n);
                    break;
                  case abp.UINT64:
                  case abp.SINT64:
                    n = P(g, m[h].descriptor, t[h], v, n);
                    break;
                  default:
                    (n = abp.isPadType(m[h].datatype)
                      ? K("Reserved")
                      : K("Unknown")),
                      v.append(n);
                }
                if (!abp.isPadType(m[h].datatype)) {
                  var B = void 0,
                    D,
                    I,
                    w = m[h],
                    F = null,
                    J = $("<span/>"),
                    G = 0;
                  J.attr("class", "tooltiptext");
                  switch (w.datatype) {
                    case abp.FLOAT:
                    case abp.UINT64:
                    case abp.SINT64:
                      I = q(w.min);
                      D = q(w.max);
                      null != w["default"] && (F = q(w["default"]));
                      break;
                    case abp.CHAR:
                      I = y(w.min);
                      D = y(w.max);
                      null != w["default"] && (F = y(w["default"]));
                      break;
                    default:
                      (I = w.min), (D = w.max), (F = w["default"]);
                  }
                  w.datatype != abp.BOOL1 &&
                    w.datatype != abp.BOOL &&
                    w.datatype != abp.BIT1 &&
                    ((B = k("Min: " + I, 20) + "<br/>" + k("Max: " + D, 20)),
                    (G += 2));
                  null != F && ((B += "<br/>" + k("Default: " + F, 20)), G++);
                  adi.isNvsParameter(w.descriptor) &&
                    ((B += "<br/>Non-Volatile"), G++);
                  0 == G
                    ? (B = null)
                    : (J.html(B),
                      J.attr(
                        "style",
                        "margin-top:-" + (7 * G - 4).toString() + "px;"
                      ),
                      (B = J));
                  null != B && (v.addClass("tooltip"), v.append(B));
                }
              } else (n = K("Unsupported")), v.append(n);
              t[h].append(v);
              adi.isWritable(m[h].descriptor) &&
                !abp.isPadType(m[h].datatype) &&
                t[h].append(S(g, n, t[h], h));
              n.adiReadOnly(!adi.isWritable(m[h].descriptor));
              m[h].datatype == abp.BOOL || m[h].datatype == abp.BOOL1
                ? n.addClass("adi-field-checkbox")
                : abp.isPadType(m[h].datatype)
                ? n.addClass("adi-field-text")
                : n.addClass("adi-field-input");
            }
            r = t;
            for (g = 0; g < r.length; g++)
              d[e].datatype[g] != abp.PAD0 &&
                (u.attr("class", "right"),
                null != d[e].elementname &&
                  (l.html(d[e].elementname[g]),
                  "" != d[e].elementname[g] &&
                    1 < r.length &&
                    ((p = e % 2 ? "alt-1" : "alt-2"),
                    l.addClass(p),
                    u.addClass(p),
                    x.addClass(p))),
                1 < r.length && u.append(g + ":"),
                x.append(r[g]),
                b.addClass("order-col"),
                l.addClass("name-col"),
                c.append(b),
                c.append(l),
                c.append(u),
                c.append(x),
                H.append(c),
                (c = $("<tr/>")),
                c.attr("class", e % 2 ? "row-1" : "row-2"),
                (b = $("<td/>")),
                (l = $("<td/>")),
                (u = $("<td/>")),
                (x = $('<td colspan="2"/>')));
          }
        }
        return { offset: a, count: f };
      });
    },
  };
})();
