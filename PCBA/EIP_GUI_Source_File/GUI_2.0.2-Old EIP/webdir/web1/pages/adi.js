var devInfo,
  entriesPerPage = 68;
function lockControls() {
  $("#refresh-adi").attr("disabled", "disabled");
  $("#page").attr("disabled", "disabled");
  devInfo.numadis > entriesPerPage &&
    ($("#first").attr("class", "adi-arrow-inactive"),
    $("#prev").attr("class", "adi-arrow-inactive"),
    $("#next").attr("class", "adi-arrow-inactive"),
    $("#last").attr("class", "adi-arrow-inactive"));
}
function unlockControls(a) {
  $("#refresh-adi").removeAttr("disabled");
  $("#page").removeAttr("disabled");
  displayPageControls(a, entriesPerPage, devInfo.numadis);
}
function paginate(a, b, c) {
  lockControls();
  $("#adi-status").html('<img src="img/indicator_tiny.gif"> Loading ...');
  return editor.paginate((a - 1) * b, b).then(
    function (b) {
      $("#adi-status").text("");
      $("#page").val(a);
      unlockControls(a);
      return b;
    },
    function (b) {
      unlockControls(a);
      $("#adi-status").text("Error: " + b);
    }
  );
}
function parseUserPage(a) {
  var b = Math.ceil(devInfo.numadis / entriesPerPage),
    c = parseInt($("#page").val());
  if (isNaN(c)) return a;
  1 > c ? (c = 1) : c > b && (c = b);
  return c;
}
function displayPageControls(a, b, c) {
  c > b &&
    ($("#first").removeAttr("class"),
    $("#last").removeAttr("class"),
    $("#prev").removeAttr("class"),
    $("#next").removeAttr("class"),
    $("#page").removeAttr("class"),
    $("#first").unbind("click"),
    $("#prev").unbind("click"),
    $("#next").unbind("click"),
    $("#last").unbind("click"),
    1 == a
      ? ($("#prev").attr("class", "adi-arrow-inactive"),
        $("#first").attr("class", "adi-arrow-inactive"))
      : ($("#prev").removeAttr("class"),
        $("#prev").bind("click", prevClick),
        $("#first").bind("click", firstClick)),
    a == Math.ceil(c / b)
      ? ($("#next").attr("class", "adi-arrow-inactive"),
        $("#last").attr("class", "adi-arrow-inactive"))
      : ($("#next").removeAttr("class"),
        $("#next").bind("click", nextClick),
        $("#last").bind("click", lastClick)));
}
function prevClick() {
  var a = parseUserPage(1) - 1;
  paginate(a, entriesPerPage, devInfo.numadis);
}
function firstClick() {
  paginate(1, entriesPerPage, devInfo.numadis);
}
function nextClick() {
  var a = parseUserPage(1) + 1;
  paginate(a, entriesPerPage, devInfo.numadis);
}
function lastClick() {
  paginate(
    Math.ceil(devInfo.numadis / entriesPerPage),
    entriesPerPage,
    devInfo.numadis
  );
}
adi.info().then(
  function (a) {
    devInfo = a;
    editor.init($("#adi-table tbody"), devInfo.numadis, devInfo.dataformat);
    $("#refresh-adi").click(function () {
      var a = parseUserPage(1);
      paginate(a, entriesPerPage, devInfo.numadis);
    });
    $("#page").keydown(function (a) {
      13 == a.which && $("#refresh-adi").click();
    });
    0 < devInfo.numadis
      ? paginate(1, entriesPerPage, devInfo.numadis)
      : (alert("This product has no parameters."), lockControls());
  },
  function (a) {
    alert("Something went terribly wrong: " + a);
  }
);
