//debugger;
$.getJSON('/module/info.json', function (a) {
  $("#info-content").html(tmpl("tmpl-info", a));
  $('#header_SCM_Cnn').css({ display: 'none' });
})
.fail(() => {
  $('#header_SCM_Cnn').css({ display: 'block' });
})
;
function convertUptime(a, b) {
  var c = parseInt("" + a + b),
      c = Math.floor(c / 1e3),
      d = Math.floor(c / 60),
      e = Math.floor(d / 60);
  return Math.floor(e / 24) + " days, " + (e % 24) + "h:" + (d % 60) + "m:" + (c % 60) + "s";
}
function convertVersion(a, b, c) {
  a += ".";
  return 10 > b ? a + "0" + b : a + b;
}
