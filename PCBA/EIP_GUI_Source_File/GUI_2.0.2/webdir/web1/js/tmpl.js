(function (e) {
  var a = function (b, d) {
    var c = /[^\w\-\.:]/.test(b)
      ? new Function(
          a.arg + ",tmpl",
          "var _e=tmpl.encode" +
            a.helper +
            ",_s='" +
            b.replace(a.regexp, a.func) +
            "';return _s;"
        )
      : (a.cache[b] = a.cache[b] || a(a.load(b)));
    return d
      ? c(d, a)
      : function (b) {
          return c(b, a);
        };
  };
  a.cache = {};
  a.load = function (a) {
    return document.getElementById(a).innerHTML;
  };
  a.regexp = /([\s'\\])(?![^%]*%\})|(?:\{%(=|#)([\s\S]+?)%\})|(\{%)|(%\})/g;
  a.func = function (a, d, c, f, e, g) {
    if (d)
      return { "\n": "\\n", "\r": "\\r", "\t": "\\t", " ": " " }[a] || "\\" + a;
    if (c) return "=" === c ? "'+_e(" + f + ")+'" : "'+" + f + "+'";
    if (e) return "';";
    if (g) return "_s+='";
  };
  a.encReg = /[<>&"'\x00]/g;
  a.encMap = {
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    '"': "&quot;",
    "'": "&#39;",
  };
  a.encode = function (b) {
    return String(b).replace(a.encReg, function (b) {
      return a.encMap[b] || "";
    });
  };
  a.arg = "o";
  a.helper =
    ",print=function(s,e){_s+=e&&(s||'')||_e(s);},include=function(s,d){_s+=tmpl(s,d);}";
  "function" === typeof define && define.amd
    ? define(function () {
        return a;
      })
    : (e.tmpl = a);
})(this);
