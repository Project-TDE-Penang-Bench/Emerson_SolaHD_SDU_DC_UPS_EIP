fnChkModBus();
fnGetConfigTempUnit();

function fnSetSysConfigTemp() {
    //alert("hi");
    //let SelOption = $("#cbTempConfig").val() == 'dC'
    let msg = "Are you sure to set the System Temperature Unit to Degrees ";
    let hexVal = '0000';
    //msg += $("#cbTempConfig").val() == 'dC'? 'Celsius(&#8451)?':'Fahrenheit(&#8457)?';
    if ($("#cbTempConfig").val() == 'dC') {
        msg += `Celsius(°C)?`;
        hexVal = '0000';
    }
    else {
        msg += `Fahrenheit(°F)?`;
        hexVal = '0100';
    }

    if (confirm(msg)) {
        $.post(`/adi/update.json?inst=412&value=${hexVal}`, (data, status) => {
            if (data.result == 0) {
                alert("Value updated successfully.");
                fnGetConfigTempUnit();
            }
            else
                alert("Error occurred while updating.")
        });

    }
}

function On_Version_Change() {
    let selTxt = $('#cbGUIVersion').find(":selected").text();
    let selVal = $('#cbGUIVersion').find(":selected").val();
    //alert(`txt => ${selTxt}, val => ${selVal}`);
    if (selVal == 'gen_2') {
        alert(`The Data Set Structure has already been set for the selected version.`);
    }

    if (selVal == 'gen_1') {
        let msg = `Are you sure to switch to version ${selTxt}?`
        if (confirm(msg)) {
            let hexVal = '01'
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



async function fnGetConfigTempUnit() {
    await $.getJSON(
        '/adi/data.json?inst=412&count=1',
        (data, status, xhr) => {
            //debugger;
            $('#header_SCM_Cnn').css({ display: 'none' });
            return data;
        }
    )
        .then((result) => {
            if (result[0] == '0000') {
                $("#cbTempConfig option[value='dC']").attr("selected", "selected");
            }
            else {
                $("#cbTempConfig option[value='dF']").attr("selected", "selected");
            }
        })
        .fail(() => {
            $('#header_SCM_Cnn').css({ display: 'block' });
        });
}

async function fnChkModBus() {
    await $.getJSON(
        '/module/info.json',
        (data, status, xhr) => {
            //debugger;
            //$('#header_SCM_Cnn').css({ display: 'none' });
            return data;
        }
    )
        .then((result) => {

            if (result.networktype === 147) {
                var $rows = $("#tblSysConfig tr");
                $rows.eq(0).hide();
                $rows.eq(1).hide();
                $rows.eq(2).hide();

            }
        })
        .fail(() => {
            // $('#header_SCM_Cnn').css({ display: 'block' });
        });
}