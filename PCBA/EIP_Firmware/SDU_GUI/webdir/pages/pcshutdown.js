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

var pcShutdownHexData = [];
var pcshutdownRefreshRate = 3000; // 3 second

urlShoutdownData = "adi/data.json?inst=455&count=4";
urlUPSSwitchData = "adi/data.json?inst=462&count=1";

fetch(urlShoutdownData).then(async (response) => {
    try {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let jsonShutdownData = await response.json() || [];
        pcShutdownHexData = jsonShutdownData;
        Array.from(jsonShutdownData).forEach((item, idx) => {
            switch (idx) {
                case 0://PC Shutdown 455
                    if (item == '0000') {
                        $('#cbPCShutdown').prop('checked', false);
                        // Disable all inputs, buttons, and checkboxes inside the tbody
                        $('#pcshutdown-rows').find('input, button').prop('disabled', true);
                        $('#trPreBatPow').find('input, button').prop('disabled', true);
                    }
                    else if (item == '0100') {
                        $('#cbPCShutdown').prop('checked', true);
                    }
                    break;
                case 1: //456
                    let keepPCOnFlag = item.substring(0, 4);
                    if (keepPCOnFlag == '0000') {
                        $('#cbKeepPCALAP').prop('checked', false);
                        if($('#cbPCRestartDelay').is(':checked')) {
                            // Disable all inputs, buttons, and checkboxes inside the tbody
                            $('#trPreBatPow').find('input, button').prop('disabled', false);
                        }
                    }
                    else if (keepPCOnFlag == '0100') {
                        $('#cbKeepPCALAP').prop('checked', true);
                        // Disable all inputs, buttons, and checkboxes inside the tbody
                        $('#trPreBatPow').find('input, button').prop('disabled', true);
                    }
                    else {
                        $('#trPreBatPow').find('input, button').prop('disabled', true);
                    }
                    let preBatteryPowerFlag = item.substring(4, 8);
                    if (preBatteryPowerFlag == '0000') {
                        $('#cbPreBatteryPow').prop('checked', false);
                    }
                    else if (preBatteryPowerFlag == '0100') {
                        if ($('#cbPCShutdown').is(':checked')) {
                            $('#cbPreBatteryPow').prop('checked', true);
                            $('#cbKeepPCALAP').prop('checked', false);
                            $('#cbKeepPCALAP').prop('disabled', true);
                            $('#trPreBatPow').find('input[type="number"], button').prop('disabled', false);
                        }
                    }
                    // get the minute and second values
                    let minute = item.substring(8, 12);
                    let second = item.substring(12, 16);
                    minute = endianess.swaphex(minute);
                    second = endianess.swaphex(second);
                    // convert hex to decimal
                    let minuteDecimal = parseInt(minute, 16) & 0xFFFF;
                    let secondDecimal = parseInt(second, 16) & 0xFFFF;
                    //minuteDecimal = endianess.swaphex(minuteDecimal);
                    //secondDecimal = endianess.swaphex(secondDecimal);
                    $('#lblPreBatteryMMSS').text(`${minuteDecimal}:${secondDecimal}`);

                    break;
                case 2://Shutdown Delay 457                    
                    if (item == '0000') {
                        $('#cbShutdownDelayCount').prop('checked', false);
                    }
                    else if (item == '0100') {
                        $('#cbShutdownDelayCount').prop('checked', true);
                    }
                    else {
                        $('#cbShutdownDelayCount').prop('checked', false);
                    }
                    break;
                case 3://PC Restart 458  
                    if (item.substring(0, 4) == '0000') {
                        $('#cbPCRestartDelay').prop('checked', false);
                        $('#trPCRestartDelay').find('input[type="number"], button').prop('disabled', true);
                    }
                    else if (item.substring(0, 4) == '0100') {
                        $('#cbPCRestartDelay').prop('checked', true);
                        //$('#trPCRestartDelay').find('input, button').prop('disabled', false);
                        $('#trPCRestartDelay').find('input[type="number"], button').prop('disabled', false);
                        $('#tbPCRestartDelay').val('');
                    }
                    else {
                        $('#cbPCRestartDelay').prop('checked', false);
                    }
                    // get the second values
                    let secondRestart = item.substring(4, 8);
                    secondRestart = endianess.swaphex(secondRestart);
                    // convert hex to decimal
                    let secondRestartDecimal = parseInt(secondRestart, 16) & 0xFFFF;
                    $('#lblPCRestartDelaySS').text(`${secondRestartDecimal}`);
                    break;
            }
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});

async function fnFetchUPSSwitchData() {
    try {
        let response = await fetch(urlUPSSwitchData);
        if (!response.ok) throw new Error('Network response was not ok');
        let data = await response.json();
        // Process the data as needed
        if (data.length > 0) {
            // Do something with the data
            console.log('UPS switch data:', data[0]);
            if(data[0] == '0000') {
                $('#cbToggle_UPS_Switch').prop('checked', false);
            } else if(data[0] == '0100') {
                $('#cbToggle_UPS_Switch').prop('checked', true);
            }
        }
    } catch (error) {
        console.error('Error fetching UPS switch data:', error);
    }
}

objPCShutdownDataOperation = setInterval(async () => {
    await fnFetchUPSSwitchData();
}, pcshutdownRefreshRate);

$('#cbPCShutdown').change(async function () {
    if ($(this).is(':checked')) {
        confirm('Are you sure you want to enable PC Shutdown?'); {
            // Enable all inputs, buttons, and checkboxes inside the tbody
            $('#pcshutdown-rows').find('input, button').prop('disabled', false);
            let retVal = fnUpdateADIData(455, '0100');
            if (retVal) {
                alert('You have successfully enabled PC Shutdown.');
                doEventLogs('PC Shutdown Enabled', 'UPS Config', 'Information', 'Enable', 'PC Shutdown','User Action', 'PC Shutdown has been enabled by user.');
            } else {
                console.error('Failed to enable PC Shutdown configuration');
                await doEventLogs('PC Shutdown Enable Failed', 'UPS Config', 'Error', 'Enable', 'PC Shutdown','User Action', 'PC Shutdown failed to be enabled by user.');
            }
        }
    } else {
        // Checkbox is unchecked
        confirm('Are you sure you want to disable PC Shutdown?'); {
            // Disable all inputs, buttons, and checkboxes inside the tbody
            $('#pcshutdown-rows').find('input, button').prop('disabled', true);
            let retVal = fnUpdateADIData(455, '0000');
            if (retVal) {
                alert('You have successfully disabled PC Shutdown.');
                doEventLogs('PC Shutdown Disabled', 'UPS Config', 'Information', 'Disable', 'PC Shutdown','User Action', 'PC Shutdown has been disabled by user.');
            } else {
                console.error('Failed to disable PC Shutdown configuration');
                await doEventLogs('PC Shutdown Disable Failed', 'UPS Config', 'Error', 'Disable', 'PC Shutdown','User Action', 'PC Shutdown failed to be disabled by user.');
            }
        }
    }
});

$('#cbKeepPCALAP').change(async function () {
    if ($(this).is(':checked')) {
        if (confirm('Are you sure you want to enable "Keep PC ON as long as possible"?')) {
            // Checkbox is checked, disable the row and its controls
            $('#trPreBatPow').find('input, button').prop('disabled', true);
            $('#cbPreBatteryPow').prop('checked', false);
            let retVal = await fnFetchAPIData('/adi/data.json?inst=456&count=1') || [];
            let keepPCOnRestVal = retVal[0].substring(8);
            let newValue = '01000000' + keepPCOnRestVal;
            let isUpdated = await fnUpdateADIData(456, newValue);
            if (isUpdated) {
                alert('You have successfully updated "Keep PC ON as long as possible".');
                await doEventLogs('Keep PC ON as long as possible Enabled', 'UPS Config', 'Information', 'Enable', 'Keep PC ON as long as possible','User Action', '"Keep PC ON as long as possible" has been enabled by user.');
            }
            else {
                alert('Failed to update "Keep PC ON as long possible" configuration.');
                await doEventLogs('Keep PC ON as long possible Enable Failed', 'UPS Config', 'Error', 'Enable', 'Keep PC ON as long possible','User Action', '"Keep PC ON as long possible" failed to be enabled by user.');
            }
        }
        else {
            $(this).prop('checked', false); // Uncheck the checkbox if the user cancels
        }

    } else {
        if (confirm('Are you sure you want to disable "Keep PC on as long as possible"?')) {
            // Checkbox is unchecked, enable the row and its controls
            $('#trPreBatPow').find('input, button').prop('disabled', false);
            let retVal = await fnFetchAPIData('/adi/data.json?inst=456&count=1') || [];
            let keepPCOnRestVal = retVal[0].substring(4);
            let newValue = '0000' + keepPCOnRestVal;
            let isUpdated = await fnUpdateADIData(456, newValue);
            if (isUpdated) {
                $('#trPreBatPow').find('input[type="number"], button').prop('disabled', true);
                $('#cbPreBatteryPow').prop('checked', false); // Uncheck the checkbox if the user cancels
                $('#cbPreBatteryPow').prop('disabled', false);
                alert('You have successfully disabled "Keep PC ON as long as possible".');
                await doEventLogs('Keep PC ON as long as possible Disabled', 'UPS Config', 'Information', 'Disable', 'Keep PC ON as long as possible','User Action', '"Keep PC ON as long as possible" has been disabled by user.');
            }
            else {
                alert('Failed to disable "Keep PC ON as long as possible" configuration.');
                await doEventLogs('Keep PC ON as long as possible Disable Failed', 'UPS Config', 'Error', 'Disable', 'Keep PC ON as long as possible','User Action', '"Keep PC ON as long as possible" failed to be disabled by user.');
            }

        }
        else {
            $(this).prop('checked', true); // Recheck the checkbox if the user cancels
        }
    }
});

$('#cbPreBatteryPow').change(async function () {
    if ($(this).is(':checked')) {
        if (confirm('Are you sure you want to enable Preserve Battery Power?')) {
            let retVal = await fnFetchAPIData('/adi/data.json?inst=456&count=1') || [];
            let keepPCOnRestVal = retVal[0].substring(8);
            let newValue = '00000100' + keepPCOnRestVal;
            let isUpdated = await fnUpdateADIData(456, newValue);
            if (isUpdated) {
                $('#cbKeepPCALAP').prop('checked', false); // Check the checkbox if the user confirms
                // Checkbox is checked, enable all controls in the row
                $('#trPreBatPow').find('input[type="number"], button').prop('disabled', false);
                $('#cbKeepPCALAP').prop('disabled', true); 
                alert('You have successfully enabled Preserve Battery Power.');
                await doEventLogs('Preserve Battery Power Enabled', 'UPS Config', 'Information', 'Enable', 'Preserve Battery Power','User Action', '"Preserve Battery Power" has been enabled by user.');
            }
            else {
                $(this).prop('checked', false); // Uncheck the checkbox if the user cancels
                $('#trPreBatPow').find('input[type="number"], button').prop('disabled', true);
                alert('Failed to enable Preserve Battery Power.');
                await doEventLogs('Preserve Battery Power Enable Failed', 'UPS Config', 'Error', 'Enable', 'Preserve Battery Power','User Action', '"Preserve Battery Power" failed to be enabled by user.');
            }
        }
        else {
            $(this).prop('checked', false); // Uncheck the checkbox if the user cancels
        }
    }
    else {
        if (confirm('Are you sure you want to disable Preserve Battery Power?')) {
            let retVal = await fnFetchAPIData('/adi/data.json?inst=456&count=1') || [];
            let keepPCOnRestVal = retVal[0].substring(8);
            let newValue = '01000000' + keepPCOnRestVal;
            let isUpdated = await fnUpdateADIData(456, newValue);
            if (isUpdated) {
                $('#cbKeepPCALAP').prop('checked', true); // Uncheck the checkbox if the user cancels
                $('#cbKeepPCALAP').prop('disabled', false);
                // Checkbox is unchecked, disable all controls in the row
                $('#trPreBatPow').find('input[type="number"], button').prop('disabled', true);
                alert('You have successfully disabled Preserve Battery Power.');
                await doEventLogs('Preserve Battery Power Disabled', 'UPS Config', 'Information', 'Disable', 'Preserve Battery Power','User Action', '"Preserve Battery Power" has been disabled by user.');
            }
            else {
                $(this).prop('checked', true); // Recheck the checkbox if the user cancels
                alert('Failed to disable Preserve Battery Power.');
                $(this).prop('checked', true);
                await doEventLogs('Preserve Battery Power Disable Failed', 'UPS Config', 'Error', 'Disable', 'Preserve Battery Power','User Action', '"Preserve Battery Power" failed to be disabled by user.');
            }
        }
        else {
            $(this).prop('checked', true); // Recheck the checkbox if the user cancels
        }
    }
});

$('#btnPreBatteryPower').click(async function () {
    //first check if the minute & second values are valid
    if ($('#tbPreBatteryPowMinute').val() > 120 || $('#tbPreBatteryPowMinute').val() < 0) {
        alert('Please enter valid minute value (0-120)');
        return;
    }
    else if ($('#tbPreBatteryPowSecond').val() > 59 || $('#tbPreBatteryPowSecond').val() < 0) {
        alert('Please enter valid second value (0-59)');
        return;
    }
    //let check combined value of minute & second
    if ($('#tbPreBatteryPowMinute').val() == '')
        $('#tbPreBatteryPowMinute').val(0);
    if ($('#tbPreBatteryPowSecond').val() == '')
        $('#tbPreBatteryPowSecond').val(0);

    let totalTime = parseInt($('#tbPreBatteryPowMinute').val()) * 60 + parseInt($('#tbPreBatteryPowSecond').val());
    if (totalTime > 120 * 60 || totalTime < 0) {
        alert('Please enter time value up to 120 minutes');
        return;
    }
    //convert minute to hex value
    if ($('#tbPreBatteryPowMinute').val().trim() === '')
        $('#tbPreBatteryPowMinute').val('0');
    let minute = parseInt($('#tbPreBatteryPowMinute').val()).toString(16).padStart(4, '0');
    //convert second to hex value 
    if ($('#tbPreBatteryPowSecond').val().trim() === '')
        $('#tbPreBatteryPowSecond').val('0');
    let second = parseInt($('#tbPreBatteryPowSecond').val()).toString(16).padStart(4, '0');
    let retVal = await fnFetchAPIData('/adi/data.json?inst=456&count=1') || [];
    let keepPCOnRestVal = retVal[0].substring(0, 8);
    //let newValue = keepPCOnRestVal + minute + second + 'FFFF'; // Assuming the last 4 bits are 'FFFF'
    let newValue = keepPCOnRestVal + (endianess.swaphex(minute)) + (endianess.swaphex(second));

    if (confirm('Are you sure you want to update Preserve Battery Power?')) {
        let isUpdated = await fnUpdateADIData(456, newValue);
        if (isUpdated) {
            //fetch the updated data
            let retVal = await fnFetchAPIData('/adi/data.json?inst=456&count=1') || [];
            let minuteHex = retVal[0].substring(8, 12);
            let secondHex = retVal[0].substring(12, 16);
            minuteHex = endianess.swaphex(minuteHex);
            secondHex = endianess.swaphex(secondHex);
            // convert hex to decimal
            let minuteDecimal = parseInt(minuteHex, 16) & 0xFFFF;
            let secondDecimal = parseInt(secondHex, 16) & 0xFFFF;
            $('#lblPreBatteryMMSS').text(`${minuteDecimal}:${secondDecimal}`);
            $('#tbPreBatteryPowMinute').val('');
            $('#tbPreBatteryPowSecond').val('');
            alert('You have successfully updated Preserve Battery Power.');
            await doEventLogs('Preserve Battery Power Updated', 'UPS Config', 'Information', 'Update', 'Preserve Battery Power','User Action', `"Preserve Battery Power" has been updated to ${minuteDecimal} minutes and ${secondDecimal} seconds by user.`);
        }
        else {
            alert('Failed to update Preserve Battery Power.');
            await doEventLogs('Preserve Battery Power Update Failed', 'UPS Config', 'Error', 'Update', 'Preserve Battery Power','User Action', '"Preserve Battery Power" failed to be updated by user.');
        }
    }
    else {
        return;
    }
});

$('#tbPreBatteryPowMinute').on('input', function () {
    let value = $(this).val();
    // Allow only whole numbers (no decimals) and limit to 3 digits
    value = value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    if (value.length > 3) {
        value = value.substring(0, 3); // Limit to 3 digits
    }
    $(this).val(value); // Update the input value
});

$('#tbPreBatteryPowSecond').on('input', function () {
    let value = $(this).val();
    // Allow only whole numbers (no decimals) and limit to 3 digits
    value = value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    if (value.length > 3) {
        value = value.substring(0, 2); // Limit to 3 digits
    }
    $(this).val(value); // Update the input value
});

$('#tbPreBatteryPowMinute').blur(function () {
    let value = $(this).val().trim();
    if (value === '') {
        return;
    }
    else if (parseInt(value) > 120) {
        alert('Please enter valid minute value (0-120)');
        $(this).val(''); // Set to maximum value if out of range
        $(this).focus();
    }
});

$('#tbPreBatteryPowSecond').blur(function () {
    let value = $(this).val().trim();
    if (value === '') {
        return;
    }
    else if (parseInt(value) > 59) {
        alert('Please enter valid second value (0-59)');
        $(this).val(''); // Set to maximum value if out of range
        $(this).focus(); // Set focus back to the input field
    }
});

$('#cbShutdownDelayCount').change(async function () {
    if ($(this).is(':checked')) {
        if (confirm('Are you sure to enable "Shutdown Delay Counter" configuration?')) {
            let newValue = '0100';
            let isUpdated = await fnUpdateADIData(457, newValue);
            if (isUpdated) {
                alert('"Shutdown Delay Counter" configuration updated successfully.');
                await doEventLogs('Shutdown Delay Counter Enabled', 'UPS Config', 'Information', 'Enable', 'Shutdown Delay Counter','User Action', '"Shutdown Delay Counter" has been enabled by user.');
            }
            else {
                alert('Failed to update "Shutdown Delay Counter" configuration.');
                await doEventLogs('Shutdown Delay Counter Enable Failed', 'UPS Config', 'Error', 'Enable', 'Shutdown Delay Counter','User Action', '"Shutdown Delay Counter" failed to be enabled by user.');
            }
        }
        else {
            $(this).prop('checked', false); // Uncheck the checkbox if the user cancels
        }

    } else {
        if (confirm('Are you sure to disable "Shutdown Delay Counter" configuration?')) {
            let newValue = '0000';
            let isUpdated = await fnUpdateADIData(457, newValue);
            if (isUpdated) {
                alert('"Shutdown Delay Counter" configuration disabled successfully.');
                await doEventLogs('Shutdown Delay Counter Disabled', 'UPS Config', 'Information', 'Disable', 'Shutdown Delay Counter','User Action', '"Shutdown Delay Counter" has been disabled by user.');
            }
            else {
                alert('Failed to disable "Shutdown Delay Counter" configuration.');
                await doEventLogs('Shutdown Delay Counter Disable Failed', 'UPS Config', 'Error', 'Disable', 'Shutdown Delay Counter','User Action', '"Shutdown Delay Counter" failed to be disabled by user.');
            }
        }
        else {
            $(this).prop('checked', true); // Recheck the checkbox if the user cancels
        }
    }
});

$('#cbPCRestartDelay').change(async function () {
    if ($(this).is(':checked')) {
        if (confirm('Are you sure to enable "PC Re-start Delay" configuration?')) {
            // Checkbox is checked, disable the row and its controls
            $('#trPCRestartDelay').find('input[type="number"], button').prop('disabled', false);
            let retVal = await fnFetchAPIData('/adi/data.json?inst=458&count=1') || [];
            let newValue = '0100' + retVal[0].substring(4, 8); // Assuming the last 4 bits are 'FFFF'
            let isUpdated = await fnUpdateADIData(458, newValue);
            if (isUpdated) {
                alert('"PC Re-start Delay" configuration updated successfully.');
                $('#tbPCRestartDelay').val(''); // Clear the input field
                await doEventLogs('PC Re-start Delay Enabled', 'UPS Config', 'Information', 'Enable', 'PC Re-start Delay','User Action', '"PC Re-start Delay" has been enabled by user.');
            }
            else {
                alert('Failed to update "PC Re-start Delay" configuration.');
                await doEventLogs('PC Re-start Delay Enable Failed', 'UPS Config', 'Error', 'Enable', 'PC Re-start Delay',"User Action", '"PC Re-start Delay" failed to be enabled by user.');
            }
        }
        else {
            $(this).prop('checked', false); // Uncheck the checkbox if the user cancels
        }

    } else {
        if (confirm('Are you sure to disable "PC Re-start Delay" configuration?')) {
            $('#trPCRestartDelay').find('input[type="number"], button').prop('disabled', true);
            let retVal = await fnFetchAPIData('/adi/data.json?inst=458&count=1') || [];
            let newValue = '0000' + retVal[0].substring(4, 8);;
            let isUpdated = await fnUpdateADIData(458, newValue);
            if (isUpdated) {
                alert('"PC Re-start Delay" configuration disabled successfully.');
                $('#tbPCRestartDelay').val(''); // Clear the input field
                await doEventLogs('PC Re-start Delay Disabled', 'UPS Config', 'Information', 'Disable', 'PC Re-start Delay','User Action', '"PC Re-start Delay" has been disabled by user.');
            }
            else {
                alert('Failed to disable "PC Re-start Delay" configuration.');
                await doEventLogs('PC Re-start Delay Disable Failed', 'UPS Config', 'Error', 'Disable', 'PC Re-start Delay',"User Action", '"PC Re-start Delay" failed to be disabled by user.');
            }
        }
        else {
            $(this).prop('checked', true); // Recheck the checkbox if the user cancels
        }
    }
});

$('#tbPCRestartDelay').blur(function () {
    let value = $(this).val().trim();
    if (value === '') {
        return;
    }
    else if (parseInt(value) > 120) {
        alert('Please enter valid minute value (0-60)');
        $(this).val(''); // Set to maximum value if out of range
        $(this).focus();
    }
});

$('#tbPCRestartDelay').on('input', function () {
    let value = $(this).val();
    // Allow only whole numbers (no decimals) and limit to 2 digits
    value = value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    if (value.length > 2) {
        value = value.substring(0, 2); // Limit to 2 digits
    }
    $(this).val(value); // Update the input value
});

$('#btnPCRestartDelay').click(async function () {
    if ($('#tbPCRestartDelay').val().trim() === '') {
        alert('Please enter a value for PC Restart Delay.');
        $('#tbPCRestartDelay').focus(); // Set focus back to the input field
        return;
    }
    //first check if the minute & second values are valid
    if ($('#tbPCRestartDelay').val() > 60 || $('#tbPCRestartDelay').val() < 0) {
        alert('Please enter valid second value (0-60)');
        $(this).val(''); // Set to maximum value if out of range   
        $(this).focus(); // Set focus back to the input field
        return;
    }
    if (confirm('Are you sure you want to update "PC Restart Delay"?')) {
        //convert minute to hex value
        if ($('#tbPCRestartDelay').val().trim() === '')
            $('#tbPCRestartDelay').val('0');
        let second = parseInt($('#tbPCRestartDelay').val()).toString(16).padStart(4, '0');
        //let newValue = '0100' + second; // Assuming the last 4 bits are 'FFFF'
        let newValue = '0100' + endianess.swaphex(second);
        let isUpdated = await fnUpdateADIData(458, newValue);
        if (isUpdated) {
            //fetch the updated data
            let retVal = await fnFetchAPIData('/adi/data.json?inst=458&count=1') || [];
            let secondHex = retVal[0].substring(4, 8);
            secondHex = endianess.swaphex(secondHex);
            let secondDecimal = parseInt(secondHex, 16) & 0xFFFF;
            $('#lblPCRestartDelaySS').text(`${secondDecimal}`); 
            $('#tbPCRestartDelay').val(''); // Clear the input field
            $('#cbPCRestartDelay').prop('checked', true); // Check the checkbox if the user confirms           
            alert('You have successfully updated PC Restart Delay.');
            await doEventLogs('PC Restart Delay Updated', 'UPS Config', 'Information', 'Update', 'PC Restart Delay',"User Action", `"PC Restart Delay" has been updated to ${secondDecimal} seconds by user.`);
        }
        else {
            alert('Failed to update PC Restart Delay.');
            await doEventLogs('PC Restart Delay Update Failed', 'UPS Config', 'Error', 'Update', 'PC Restart Delay',"User Action", '"PC Restart Delay" failed to be updated by user.');
        }
    }
    else {
        $(this).prop('checked', false); // Uncheck the checkbox if the user cancels
        return;
    }

});  

$('#cbToggle_UPS_Switch').change(async function () {
    // Toggle the visibility of the menu
    if($(this).is(':checked')) {       
       if (confirm('Are you sure you want to enable UPS Menu?')) {
           // Checkbox is checked, disable the row and its controls
           let retVal = await fnUpdateADIData(462, '0100');
           if (retVal) {
               $('#cbToggle_UPS_Switch').prop('checked', true);
               alert('You have successfully enabled UPS Menu.');
               await doEventLogs('UPS Menu Enabled', 'UPS Config', 'Information', 'Enable', 'UPS Switch',"User Action", '"UPS Switch" has been enabled by user.');
           } else {
               console.error('Failed to enable UPS Menu configuration');
               await doEventLogs('UPS Menu Enable Failed', 'UPS Config', 'Error', 'Enable', 'UPS Switch',"User Action", '"UPS Switch" failed to be enabled by user.');
           }
       }
    } else {
        if (confirm('Are you sure you want to disable UPS Menu?')) {
            // Checkbox is unchecked, enable the row and its controls
            let retVal = await fnUpdateADIData(462, '0000');
            if (retVal) {
               $('#cbToggle_UPS_Switch').prop('checked', false);
                alert('You have successfully disabled UPS Menu.');
                await doEventLogs('UPS Menu Disabled', 'UPS Config', 'Information', 'Disable', 'UPS Switch','User Action', '"UPS Switch" has been disabled by user.');
            } else {
                console.error('Failed to disable UPS Menu configuration');
                await doEventLogs('UPS Menu Disable Failed', 'UPS Config', 'Error', 'Disable', 'UPS Switch','User Action', '"UPS Switch" failed to be disabled by user.');
            }
        } else {
            $(this).prop('checked', true); // Recheck the checkbox if the user cancels
        }
    }
});

$('#btnBatteryTestStart').click(async function () {
    if (confirm('Are you sure you want to start Battery Test?')) {
        let isUpdated = await fnUpdateADIData(459, '0100');  
        if (isUpdated) {
            alert('You have successfully started Battery Test.');
            await doEventLogs('Battery Test Started', 'UPS Config', 'Information', 'Start', 'Battery Test','User Action', 'Battery Test has been started by user.');
        } else {
            alert('Failed to start Battery Test.');
            await doEventLogs('Battery Test Start Failed', 'UPS Config', 'Error', 'Start', 'Battery Test', 'User Action', '"Battery Test" failed to be started by user.');
        }
    }
    else {
        return; // If the user cancels, exit the function
    }
});
