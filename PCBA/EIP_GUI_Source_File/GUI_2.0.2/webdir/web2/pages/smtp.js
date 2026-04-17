$.getJSON(dev.jsonURL("/services/smtp.json"), null, function (a) {
  $("#smtp-form-content").html(tmpl("tmpl-smtp", a));
});
function validateSmtpForm() {
  $(".validation-error").hide();
  var a = !0,
    b = $("#password").val(),
    c = $("#confirm").val();
  "" !== b && "" === c
    ? ($("#smtp-status").html(
        '<span class="validation-error">Please confirm your password.</span>'
      ),
      (a = !1))
    : b != c &&
      ($("#smtp-status").html(
        '<span class="validation-error">Passwords do not match.</span>'
      ),
      (a = !1));
  return !1 === a ? !1 : !0;
}
$("#save").click(function () {
  validateSmtpForm() &&
    $.getJSON(
      dev.jsonURL("/services/smtp.json"),
      $("#smtp-form").serialize(),
      function (a) {
        0 == a.result
          ? alert("Settings successfully saved!")
          : alert(
              "An error (" + abp.errorToString(a.result) + ") was received"
            );
      }
    );
});
