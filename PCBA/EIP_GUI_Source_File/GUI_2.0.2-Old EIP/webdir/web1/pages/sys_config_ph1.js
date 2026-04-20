
function On_Version_Change() {
    let selTxt = $('#cbGUIVersion').find(":selected").text();
    let selVal = $('#cbGUIVersion').find(":selected").val();
    //alert(`txt => ${selTxt}, val => ${selVal}`);
    if (selVal == 'gen_1') {
      alert(`The Data Set Structure has already been set for the selected version.`);
    }
  
    if (selVal == 'gen_2') {
      let msg = `Are you sure to switch to version ${selTxt}?`
      if (confirm(msg)) {
        let hexVal = '00'
        $.post(`/adi/update.json?inst=997&value=${hexVal}`, (data, status) => {
          if (data.result == 0) {
            alert("Value updated successfully.\n Please refresh the page after 30 seconds to see the changes.");
            location.reload(true);
          }
          else
            alert("Error occurred while updating.")
        })
          .done(function () {
            //alert( "second success" );
          })
          .fail(function () {
            alert("Value updated successfully.\n Please refresh the page after 30 seconds to see the changes...");
            location.reload(true);
            //alert( "error" );
          })
          .always(function () {
          });
  
  
      }
    }
  }