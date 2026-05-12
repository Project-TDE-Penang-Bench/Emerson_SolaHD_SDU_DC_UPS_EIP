if (objEventDataOperation != null)
    clearInterval(objEventDataOperation);
if (objOverviewDataOperation != null)
    clearInterval(objOverviewDataOperation);
if (objParaDataOperation != null)
    clearInterval(objParaDataOperation);
if (objMeasurementDataOperation != null)
    clearInterval(objMeasurementDataOperation);
if (objTimerDataOperation != null)
    clearInterval(objTimerDataOperation);
if (objAlarmParaDataOperation != null)
    clearInterval(objAlarmParaDataOperation);
if(objPCShutdownDataOperation != null)
    clearInterval(objPCShutdownDataOperation);


var urlSettingMetaData = "/adi/metadata.json?inst=450&count=5";
var urlSettingData = "/adi/data.json?inst=450&count=5";
var settingRefreshRate = 5000; // 5 second
var configSettingMeta = [];
var configSettingData = [];

fetch(urlSettingMetaData).then(async (response) => {
    try {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let jsonConfigMetaData = await response.json();
        configSettingMeta = jsonConfigMetaData;
        objSettingDataOperation = await setInterval(async () => {
            fnFillSettingData();
            $('#spinnerSysTemp').hide();
        }, settingRefreshRate);

    }
    catch (error) {
        console.error('Error fetching data:', error);
    }
});

async function fnFillSettingData() {
    let configSettingData = await fnFetchAPIData(urlSettingData) || [];
    configSettingMeta.forEach((item, idx) => {
        switch (item.instance) {
            case 450://User System Name
            case 451://User Device Name
                let adiValue = hexToAscii(configSettingData[idx]);
                $(`#adi-${item.instance}`).html(adiValue);
                break;
            // case 453://Battery Type
            //     if (configSettingData[idx] == '0000')
            //         $("#adi-453").html("VRLA");
            //     else if (configSettingData[idx] == '0100')
            //         $("#adi-453").html("LiFePO4");
            //     else
            //         $("#adi-453").html("Unknown");
            //     break;
            case 454://System Temperature Unit
                if (configSettingData[idx] == '0000')
                    $("#adi-454").html("\u2103"); // Celsius
                else if (configSettingData[idx] == '0100')
                    $("#adi-454").html("\u2109"); // Fahrenheit
                else
                    $("#adi-454").html("Unknown");
                break;
        }

    });
}


async function fnUpdateSysTemperature() {
    let msg = "Are you sure to set the System Temperature Unit to Degrees ";
    let hexVal = '0000';
    let Unit = "\u2103"; // Celsius 

    if ($("#cbSysTemp").val() == 'dC') {
        msg += `Celsius(\u2103)?`;
        hexVal = '0000';
        Unit = "\u2103";
    }
    else {
        msg += `Fahrenheit(\u2109)?`;
        hexVal = '0100';
        Unit = "\u2109";
    }
    if (confirm(msg)) {
        let resVal = await fnUpdateConfiData(sysTempUnitInst, hexVal);
        if (resVal) {
            alert("System Temperature Unit updated successfully.");
            $("#adi-454").text(Unit);
            await doEventLogs('System Temperature Unit Updated', 'Settings', 'Information', 'Update', 'System Temperature Unit',"User Action",`"System Temperature Unit" has been updated to ${Unit} by user.`);
            //    doEventLogs('UPS Menu Enabled               ', 'UPS Config', 'Information', 'Enable', 'UPS Switch',"User Action", '"UPS Switch" has been enabled by user.');
        }
        else {
            alert("Failed to update the System Temperature Unit.");
            await doEventLogs('System Temperature Unit Update Failed', 'Settings', 'Error', 'Update', 'System Temperature Unit',"User Action", '"System Temperature Unit" failed to be updated by user.');
        }
    }
}

async function fnUpdateBatteryType() {
    let msg = "Are you sure to set the Battery Type to ";
    let hexVal = '0000';
    let option = "VRLA"; // Default

    if ($("#cbBatteryType").val() == 'VRLA') {
        msg += `VRLA?`;
        hexVal = '0000';
        option = "VRLA";
    }
    else if ($("#cbBatteryType").val() == 'LiFePO4') {
        msg += `LiFePO4?`;
        hexVal = '0100';
        option = "LiFePO4";
    }
    else if ($("#cbBatteryType").val() == 'BAT-EM') {
        msg += `BAT-EM?`;
        hexVal = '0200';
        option = "BAT-EM";
    }
    if (confirm(msg)) {
        let resVal = await fnUpdateConfiData(batteryTypeInst, hexVal);
        if (resVal) {
            alert("Battery Type updated successfully.");
            $("#adi-453").text(option);
            await doEventLogs('Battery Type Updated', 'Settings', 'Information', 'Update', 'Battery Type',"User Action", `"Battery Type" has been updated to ${option} by user.`);
        }
        else {
            alert("Failed to update the Battery Type.");
            await doEventLogs('Battery Type Update Failed', 'Settings', 'Error', 'Update', 'Battery Type',"User Action", '"Battery Type" failed to be updated by user.');
        }
    }
}

async function fnUpdateSystemName() {
    let newSystemName = $("#tbUserSystemName").val();
    if (newSystemName.length = 0 || newSystemName == "")
        return

    let msg = `Are you sure to set the User System Name to ${newSystemName}?`;

    let hexVal = '00000000';
    if ($("#tbUserSystemName").val() != '')
        hexVal = textToHex32($("#tbUserSystemName").val()); // Convert to 32 bit hex value  
    else
        return;

    if (confirm(msg)) {
        let resVal = await fnUpdateConfiData(userSystemNameInst, hexVal);
        if (resVal) {
            alert("USer System Name updated successfully.");
            $("#adi-450").text(newSystemName);
            $("#tbUserSystemName").val('');
            await doEventLogs('User System Name Updated', 'Settings', 'Information', 'Update', 'User System Name',"User Action", `"User System Name" has been updated to ${newSystemName} by user.`);
            //    doEventLogs('UPS Menu Enabled        ', 'UPS Config', 'Information', 'Enable', 'UPS Switch',"User Action", '"UPS Switch" has been enabled by user.');
        }
        else {
            alert("Failed to update the System Name.");
            await doEventLogs('User System Name Update Failed', 'Settings', 'Error', 'Update', 'User System Name',"User Action", '"User System Name" failed to be updated by user.');
        }
    }
}

async function fnUpdateDeviceName() {
    let newDeviceName = $("#tbUserDeviceName").val();
    let msg = `Are you sure to set the User Device Name to ${newDeviceName}?`;
    let hexVal = '00000000';
    if ($("#tbUserDeviceName").val() != '')
        hexVal = textToHex32($("#tbUserDeviceName").val());
    else
        return;

    if (confirm(msg)) {
        let resVal = await fnUpdateConfiData(userDeviceNameInst, hexVal);
        if (resVal) {
            alert("User Device Name updated successfully.");
            $("#adi-451").text(newDeviceName);
            $("#tbUserDeviceName").val('');      
            await doEventLogs('User Device Name Updated', 'Settings', 'Information', 'Update', 'User Device Name',"User Action", `"User Device Name" has been updated to ${newDeviceName} by user.`);      
        }
        else {
            alert("Failed to update the Device Name.");
            await doEventLogs('User Device Name Update Failed', 'Settings', 'Error', 'Update', 'User Device Name',"User Action", '"User Device Name" failed to be updated by user.');
        }
    }
}

async function fnUpdateConfiData(inst, value) {
    const url = `/adi/update.json?inst=${inst}&value=${value}`;
    let returnValue = false;
    await $.ajax({
        url: url,
        type: "POST",
        contentType: "application/json",
        success: function (response) {
            if (response.result == 0)
                returnValue = true;
            else
                returnValue = false;
        },
        error: function (xhr, status, error) {
            returnValue = false;
        }
    });
    return returnValue;
}