var $jscomp = {
  scope: {},
  findInternal: function (a, b, c) {
    a instanceof String && (a = String(a));
    for (var d = a.length, e = 0; e < d; e++) {
      var f = a[e];
      if (b.call(c, f, e, a)) return { i: e, v: f };
    }
    return { i: -1, v: void 0 };
  },
};
$jscomp.defineProperty =
  "function" == typeof Object.defineProperties
    ? Object.defineProperty
    : function (a, b, c) {
        if (c.get || c.set)
          throw new TypeError("ES3 does not support getters and setters.");
        a != Array.prototype && a != Object.prototype && (a[b] = c.value);
      };
$jscomp.getGlobal = function (a) {
  return "undefined" != typeof window && window === a
    ? a
    : "undefined" != typeof global && null != global
    ? global
    : a;
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.polyfill = function (a, b, c, d) {
  if (b) {
    c = $jscomp.global;
    a = a.split(".");
    for (d = 0; d < a.length - 1; d++) {
      var e = a[d];
      e in c || (c[e] = {});
      c = c[e];
    }
    a = a[a.length - 1];
    d = c[a];
    b = b(d);
    b != d &&
      null != b &&
      $jscomp.defineProperty(c, a, {
        configurable: !0,
        writable: !0,
        value: b,
      });
  }
};
$jscomp.polyfill(
  "Array.prototype.find",
  function (a) {
    return a
      ? a
      : function (a, c) {
          return $jscomp.findInternal(this, a, c).v;
        };
  },
  "es6-impl",
  "es3"
);
var ipconfignames = {
    addr: "IP Address",
    subnet: "Subnet Mask",
    gateway: "Gateway Address",
    hostname: "Host Name",
    domainname: "Domain name",
    dns1: "DNS Server #1",
    dns2: "DNS Server #2",
  },
  ifcountersnames = {
    inoctets: "In Octets",
    inucast: "In Ucast Packets",
    innucast: "In NUcast Packets",
    indiscards: "In Discards",
    inerrors: "In Errors",
    inunknown: "In Unknown Protos",
    outoctets: "Out Octets",
    outucast: "Out Ucast Packets",
    outnucast: "Out NUcast Packets",
    outdiscards: "Out Discards",
    outerrors: "Out Errors",
  },
  mediacountersnames = {
    align: "Alignment Errors",
    fcs: "FCS Errors",
    singlecoll: "Single Collisions",
    multicoll: "Multiple Collisions",
    latecoll: "Late Collisions",
    excesscoll: "Excessive Collisions",
    sqetest: "SQE Test Errors",
    deferredtrans: "Deferred Transmissions",
    macrecerr: "MAC Receive Errors",
    mactranserr: "MAC Transmit Errors",
    cserr: "Carrier Sense Errors",
    toolong: "Frame Size Too Long",
  };
function addNwSpecAccordionEntries(a) {
  $(a).each(function (a, c) {
    $(".accordion").append(tmpl("tmpl-accordion", c));
    $("#" + c.identifier).bind("onshow", showNetworkSpecificStats);
    $("#" + c.identifier).trigger("onshow");
  });
}
function initAccordion() {
  $(".accordion > dt > a").click(function () {
    $(this).find("span").toggleClass("closed", "open");
    var a = $(this).parent().next();
    a.toggle();
    a.is(":visible") && a.trigger("onshow");
    return !1;
  });
}
function showNetworkSpecificStats() {
  var a = $(this).attr("id");
  $.getJSON(dev.jsonURL("/network/nwstats.json"), { get: a }).done(function (
    b
  ) {
    $("#" + a).html(tmpl("tmpl-nwspecific-data", b));
  });
}
function portMode(a) {
  var b;
  a.link
    ? ((b = a.speed ? "100" : "10"), (b += a.duplex ? " FDX" : " HDX"))
    : (b = "No Link");
  return b;
}
$.getJSON(dev.jsonURL("/network/ipstatus.json")).done(function (a) {
  var b = {};
  if (a.hasOwnProperty("dhcp")) {
    b.dhcp = "DHCP";
    for (var c in ipconfignames) b[c] = ipconfignames[c];
    a.dhcp = a.dhcp ? "Enabled" : "Disabled";
  } else b = ipconfignames;
  a = { heading: "Current IP Settings", names: b, data: a };
  $("#ipconf").html(tmpl("tmpl-table2col-ipconfig", a));
});
$.getJSON(dev.jsonURL("/network/ethstatus.json")).done(function (a) {
  a.mac = a.mac.match(/.{1,2}/g).join(":");
  a.comm1 = portMode(a.comm1);
  var b = { mac: "MAC Address" };
  a.comm2
    ? ((a.comm2 = portMode(a.comm2)),
      (b.comm1 = "Port 1"),
      (b.comm2 = "Port 2"))
    : (b.comm1 = "Port status");
  a = { heading: "Current Ethernet Status", names: b, data: a };
  $("#ethconf").html(tmpl("tmpl-table2col", a));
});
$(".accordion").html("");
$.ajax(dev.jsonURL("/network/ifcounters.json"), {
  async: !1,
  dataType: "json",
}).done(function (a) {
  3 != a.error &&
    $(".accordion").append(
      tmpl("tmpl-accordion", {
        title: "Interface Counters",
        identifier: "ifcounters",
      })
    );
});
$.ajax(dev.jsonURL("/network/mediacounters.json"), {
  async: !1,
  dataType: "json",
}).done(function (a) {
  3 != a.error &&
    $(".accordion").append(
      tmpl("tmpl-accordion", {
        title: "Media Counters",
        identifier: "mediacounters",
      })
    );
});
$.ajax(dev.jsonURL("/network/nwstats.json"), {
  async: !1,
  dataType: "json",
}).done(function (a) {
  addNwSpecAccordionEntries(a);
  initAccordion();
});
$("#ifcounters").bind("onshow", function () {
  var a = {},
    b = [],
    c = $(this);
  b.push(
    $.getJSON(dev.jsonURL("/network/ifcounters.json"), { port: 0 }).done(
      function (b) {
        a.port0 = b;
      }
    )
  );
  b.push(
    $.getJSON(dev.jsonURL("/network/ifcounters.json"), { port: 1 }).done(
      function (b) {
        b.error || (a.port1 = b);
      }
    )
  );
  b.push(
    $.getJSON(dev.jsonURL("/network/ifcounters.json"), { port: 2 }).done(
      function (b) {
        b.error || (a.port2 = b);
      }
    )
  );
  var d = { names: ifcountersnames, data: a };
  $.when.apply($, b).done(function () {
    a.port1 && a.port2
      ? ((d.heading = ["Port 1", "Port 2", "Internal"]),
        c.html(tmpl("tmpl-table4col-refresh", d)))
      : ((d.data = d.data.port0),
        (d.heading = "\u00a0"),
        c.html(tmpl("tmpl-table2col-refresh", d)));
  });
});
$("#mediacounters").bind("onshow", function () {
  var a = {},
    b = [],
    c = $(this);
  b.push(
    $.getJSON(dev.jsonURL("/network/mediacounters.json"), { port: 1 }).done(
      function (b) {
        a.port1 = b;
      }
    )
  );
  b.push(
    $.getJSON(dev.jsonURL("/network/mediacounters.json"), { port: 2 }).done(
      function (b) {
        b.error || (a.port2 = b);
      }
    )
  );
  var d = { names: mediacountersnames, data: a };
  $.when.apply($, b).done(function () {
    a.port2
      ? ((d.heading = ["Port 1", "Port 2"]),
        c.html(tmpl("tmpl-table3col-refresh", d)))
      : ((d.data = d.data.port1),
        (d.heading = "\u00a0"),
        c.html(tmpl("tmpl-table2col-refresh", d)));
  });
});
$("#ifcounters").trigger("onshow");
$("#mediacounters").trigger("onshow");
