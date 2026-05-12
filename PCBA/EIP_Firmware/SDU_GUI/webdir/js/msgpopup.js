function customAlert(message, title = "Alert") {
    $("#modal-title").text(title);
    $("#modal-message").text(message);
    $("#modal-cancel").hide(); // Hide the Cancel button
    $("#customModal").fadeIn();

    return new Promise((resolve) => {
        $("#modal-ok").off("click").on("click", function () {
            $("#customModal").fadeOut();
            resolve(true); // Resolve the promise when OK is clicked
        });
    });
}

function customConfirm(message, title = "Confirm") {
    $("#modal-title").text(title);
    $("#modal-message").text(message);
    $("#modal-cancel").show(); // Show the Cancel button
    $("#customModal").fadeIn();

    return new Promise((resolve) => {
        $("#modal-ok").off("click").on("click", function () {
            $("#customModal").fadeOut();
            resolve(true); // Resolve the promise with true when OK is clicked
        });

        $("#modal-cancel").off("click").on("click", function () {
            $("#customModal").fadeOut();
            resolve(false); // Resolve the promise with false when Cancel is clicked
        });
    });
}