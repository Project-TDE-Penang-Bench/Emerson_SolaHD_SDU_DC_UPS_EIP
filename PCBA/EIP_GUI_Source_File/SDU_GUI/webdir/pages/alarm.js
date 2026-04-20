if (objEventDataOperation != null)
    clearInterval(objEventDataOperation);
if (objOverviewDataOperation != null)
    clearInterval(objOverviewDataOperation);
if (objSettingDataOperation != null)
    clearInterval(objSettingDataOperation);
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

var urlAlarmEnable = "/adi/data.json?inst=400&count=2";
var urlAlarmThresholdVal = "/adi/data.json?inst=402&count=3";
var minTemp, maxTemp;

// Alarm configuration object
var alarmConfig = {
    cbHighIntTemp: {
        textBox: 'tbHighIntTemp',
        button: 'btnHighIntTemp',
        name: 'High Internal Temperature',
        bitPosition: 0
    },
    cbLowBatterySoCAlarm: {
        textBox: 'tbLowBatterySoCAlarm',
        button: 'btnLowBatterySoCAlarm',
        name: 'Low Battery SOC',
        bitPosition: 1
    },
    cbLowBatteryRunTimeAlarm: {
        textBox: 'tbLowBatteryRunTimeAlarm',
        button: 'btnLowBatteryRunTimeAlarm',
        name: 'Low Battery Runtime',
        bitPosition: 2
    }
};

$('#tbHighIntTemp').on('input', function () {
    let value = $(this).val();
    // Allow only whole numbers (no decimals) and limit to 3 digits
    value = value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    if (value.length > 3) {
        value = value.substring(0, 3); // Limit to 3 digits
    }
    $(this).val(value); // Update the input value
});

$(async () => {
    let tempUnit = await fnGetConfigTempUnit(); // Call the function to get the temperature unit
    $('#adi-454').text(tempUnit); // Set the return value to the label
    if (tempUnit == "\u2103") { // Celsius
        $('#tbHighIntTemp').prop('min', thresholdTempMinDC);
        $('#tbHighIntTemp').prop('max', thresholdTempMaxDC);
        minTemp = thresholdTempMinDC;
        maxTemp = thresholdTempMaxDC;
    }
    else if (tempUnit == "\u2109") { // Fahrenheit
        $('#tbHighIntTemp').prop('min', thresholdTempMinDF);
        $('#tbHighIntTemp').prop('max', thresholdTempMaxDF);
        minTemp = thresholdTempMinDF;
        maxTemp = thresholdTempMaxDF;
    }
    else {
        $('#adi-454').text("Unknown"); // Unknown unit
    }

    // Attach event handlers
    Object.keys(alarmConfig).forEach(checkboxId => {
        $(`#${checkboxId}`).change(async function () {
            await handleAlarmChange(checkboxId, $(this).is(':checked'));
        });
    });
});

//Set\Update High Internal Temperature value.
$('#btnHighIntTemp').click(async function () {
    let value = $('#tbHighIntTemp').val();
    let tempUnit = await fnGetConfigTempUnit(); // Call the function to get the temperature unit
    //let stringUnit = (tempUnit === "\u2103") ? "Celsius" : (tempUnit === "\u2109") ? "Fahrenheit" : "Unknown";
    let previousValue = $('#adi-402').text();

    if (value < minTemp || value > maxTemp) {
        alert(`You have entered an invalid value.\nPlease enter a value between ${minTemp} and ${maxTemp}.`);
        return;
    }
    if (confirm(`Are you sure to set the High Internal Temperature to ${value} ${tempUnit}?`)) {
        // Convert to hexadecimal and pad to 4 hex digits
        let hex = ((value & 0xFFFF).toString(16)).toUpperCase().padStart(4, '0');
        let adiUpdate = await fnUpdateADIData(402, endianess.swaphex(hex));
        if (adiUpdate) {
            let hexArr = await fnFetchAPIData("/adi/data.json?inst=402&count=1") || [];
            if (hexArr.length > 0) {
                let updateValue = parseInt(endianess.swaphex(hexArr[0]), 16);
                $('#adi-402').text(updateValue);
                $('#tbHighIntTemp').val(''); // Clear the input field
                alert("You have successfully updated the High Internal Temperature Alarm.");
                await doEventLogs("High Internal Temperature Alarm", "Alarm", "Information"
                    , "Threshold Change", "Alarm Management", "User Action", `Value changed to ${updateValue} ${tempUnit} from ${previousValue} ${tempUnit}.`);
            }
            else {
                alert("Failed to fetch updated High Internal Temperature value.");
            }
        }
        else {
            alert("Failed to update High Internal Temperature value.");
            await doEventLogs("High Internal Temperature Alarm", "Alarm", "Error"
                , "Threshold Change Failed", "Alarm Management", "User Action", `Attempted to change value from ${previousValue} ${tempUnit} to ${value} ${tempUnit}.`);
        }
    }
});

$('#btnLowBatterySoCAlarm').click(async function () {
    let value = $('#tbLowBatterySoCAlarm').val();
    let previousValue = $('#adi-403').text();
    if (value < thresholdLowBatPercentMin || value > thresholdLowBatPercentMax) {
        alert(`You have entered an invalid value.\nPlease enter a value between ${thresholdLowBatPercentMin}% and ${thresholdLowBatPercentMax}%.`);
        return;
    }
    // Convert to hexadecimal and pad to 4 hex digits
    let hex = (value & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
    if (confirm(`Are you sure to set the Low Battery SoC Alarm to ${value}%?`)) {
        let adiUpdate = await fnUpdateADIData(403, endianess.swaphex(hex));
        if (adiUpdate) {
            let hexArr = await fnFetchAPIData("/adi/data.json?inst=403&count=1") || [];
            if (hexArr.length > 0) {
                let updateValue = parseInt(endianess.swaphex(hexArr[0]), 16);
                $('#adi-403').text(updateValue); // Update the displayed value
                $('#tbLowBatterySoCAlarm').val(''); // Clear the input field
                alert("Low Battery SoC Alarm value updated successfully.");
                await doEventLogs("Low Battery SoC Alarm", "Alarm", "Information"
                    , "Threshold Change", "Alarm Management", "User Action", `Value changed from ${previousValue}% to ${updateValue}%.`);
            }
            else {
                alert("Failed to fetch updated Low Battery SoC Alarm value.");
            }
        }
        else {
            alert("Failed to update Low Battery SoC Alarm value.");
            await doEventLogs("Low Battery SoC Alarm", "Alarm", "Error"
                , "Threshold Change Failed", "Alarm Management", "User Action", `Attempted to change value from ${previousValue}% to ${value}%.`);
        }
    }
});

$('#btnLowBatteryRunTimeAlarm').click(async function () {
    let value = $('#tbLowBatteryRunTimeAlarm').val();
    let previousValue = $('#adi-404').text();
    if (value < thresholdLowBatRuntimeMin || value > thresholdLowBatRuntimeMax) {
        alert(`You have entered an invalid value.\nPlease enter a value between ${thresholdLowBatRuntimeMin} and ${thresholdLowBatRuntimeMax} minutes.`);
        return;
    }
    // Convert to hex
    let hex = (value & 0xFFFFFFFF).toString(16).padStart(8, '0');

    if (confirm(`Are you sure to set the Low Battery Run Time Alarm to ${value} second(s)?`)) {
        let adiUpdate = await fnUpdateADIData(404, endianess.swaphex(hex));
        if (adiUpdate) {
            let hexArr = await fnFetchAPIData("/adi/data.json?inst=404&count=1") || [];
            if (hexArr.length > 0) {
                let updateValue = parseInt(endianess.swaphex(hexArr[0]), 16) >>> 0; // Unsigned right shift
                $('#adi-404').text(updateValue); // Update the displayed value
                $('#tbLowBatteryRunTimeAlarm').val(''); // Clear the input field
                alert("Low Battery Run Time Alarm value updated successfully.");
                await doEventLogs("Low Battery Run Time Alarm", "Alarm", "Information"
                    , "Threshold Change", "Alarm Management", "User Action", `Value changed from ${previousValue} to ${updateValue} seconds.`);
            }
            else {
                alert("Failed to fetch updated Low Battery Run Time Alarm value.");
            }
        }
        else {
            alert("Failed to update Low Battery Run Time Alarm value.");
            await doEventLogs("Low Battery Run Time Alarm", "Alarm", "Error"
                , "Threshold Change Failed", "Alarm Management", "User Action", `Attempted to change value from ${previousValue} to ${value} seconds.`);
        }
    }
});

fetch(urlAlarmEnable).then(async (response) => {
    try {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let jsonAlarmEnable = await response.json() || [];
        let alarmEnbBit = jsonAlarmEnable[1];
        let alarmEnble = endianess.swaphex(alarmEnbBit);

        let alarmBinaruy = (parseInt(alarmEnble, 16).toString(2)).padStart(4, '0');
        let alarmEnbBitArr = Array.from(alarmBinaruy);
        alarmEnbBitArr = alarmEnbBitArr.reverse(); // Reverse the array to match bit positions
        Array.from(alarmEnbBitArr).forEach((item, idx) => {
            switch (idx) {
                case 0://High Internal Temperature  
                    if (item == '1') {
                        $('#cbHighIntTemp').prop('checked', true);
                        $('#tbHighIntTemp').prop('disabled', false);
                        $('#btnHighIntTemp').prop('disabled', false);
                    } else {
                        $('#cbHighIntTemp').prop('checked', false);
                        $('#tbHighIntTemp').prop('disabled', true);
                        $('#btnHighIntTemp').prop('disabled', true);
                    }
                    break;
                case 1://Low Battery SOC Alarm
                    if (item == '1') {
                        $('#cbLowBatterySoCAlarm').prop('checked', true);
                        $('#tbLowBatterySoCAlarm').prop('disabled', false);
                        $('#btnLowBatterySoCAlarm').prop('disabled', false);
                    } else {
                        $('#cbLowBatterySoCAlarm').prop('checked', false);
                        $('#tbLowBatterySoCAlarm').prop('disabled', true);
                        $('#btnLowBatterySoCAlarm').prop('disabled', true);
                    }
                    break;
                case 2://Low Battery Runtime Alarm
                    if (item == '1') {
                        $('#cbLowBatteryRunTimeAlarm').prop('checked', true);
                        $('#tbLowBatteryRunTimeAlarm').prop('disabled', false);
                        $('#btnLowBatteryRunTimeAlarm').prop('disabled', false);
                    } else {
                        $('#cbLowBatteryRunTimeAlarm').prop('checked', false);
                        $('#tbLowBatteryRunTimeAlarm').prop('disabled', true);
                        $('#btnLowBatteryRunTimeAlarm').prop('disabled', true);
                    }
                    break;
            }
        });
    }
    catch (error) {
        console.error('Error fetching data:', error);
    }
});

fetch(urlAlarmThresholdVal).then(async (response) => {
    try {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let jsonAlarmThresholdVal = await response.json() || [];
        Array.from(jsonAlarmThresholdVal).forEach((item, idx) => {
            switch (idx) {
                case 0://High Internal Temperature 
                    $('#adi-402').text(parseInt(endianess.swaphex(item), 16));
                    break;
                case 1://Low Battery SOC Alarm
                    $('#adi-403').text(parseInt(endianess.swaphex(item), 16));
                    break;
                case 2://Low Battery Runtime Alarm
                    $('#adi-404').text(parseInt(endianess.swaphex(item), 16) >>> 0);
                    break;
            }
        });
    }
    catch (error) {
        console.error('Error fetching data:', error);
    }
});

async function fnFetchAlarmEnableData() {
    try {
        const response = await fetch(urlAlarmEnable);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let alarmEnableData = await response.json() || [];
        let alarmEnble = endianess.swaphex(alarmEnableData[1]);

        let alarmBinaruy = (parseInt(alarmEnble, 16).toString(2)).padStart(4, '0');
        let alarmEnbBitArr = Array.from(alarmBinaruy);
        return alarmEnbBitArr.reverse();
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

// Generic function to handle alarm state changes
async function handleAlarmChange(checkboxId, isChecked) {
    const config = alarmConfig[checkboxId];
    const action = isChecked ? 'enable' : 'disable';

    //Store the current state of the checkbox
    const previousState = !isChecked;

    if (confirm(`Are you sure you want to ${action} the alarm for ${config.name}?`)) {
        // Update UI elements
        $(`#${config.textBox}`).prop('disabled', !isChecked);
        $(`#${config.button}`).prop('disabled', !isChecked);
        // Fetch current alarm enable data
        let arryBit = await fnFetchAlarmEnableData();
        let arryBitCopy = [...arryBit]; // Create a copy of the array for comparison
        arryBitCopy[config.bitPosition] = isChecked ? '1' : '0';
        let bitStr = arryBitCopy.reverse().join(''); // Reverse back to original order and join to string

        let hstring = parseInt(bitStr, 2).toString(16).toUpperCase().padStart(8, '0');
        let hexValue = endianess.swaphex(hstring);
        let adiUpdate = await fnUpdateADIData(401, hexValue);
        if (!adiUpdate) {
            alert(`Failed to ${action} the alarm for ${config.name}.`);
        } else {
            alert(`You have successfully ${action}d the alarm for ${config.name}.`);
            //do logs
            //doEventLogs(LogName,Source,Level,Opcode,TaskCategory,Keywords,Description )
            await doEventLogs(config.name, "Alarm", "Information", "State Change", "Alarm Management", "User Action", `Alarm ${action.toUpperCase()}D`);
        }
    }
    else {
        // Revert the checkbox to its previous state
        $(`#${checkboxId}`).prop('checked', previousState);
    }
}
