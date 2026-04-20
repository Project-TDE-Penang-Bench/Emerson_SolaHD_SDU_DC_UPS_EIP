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

var urlSecurityData = 'adi/data.json?inst=460&count=2';

fetch(urlSecurityData).then(async (response) => {
    try {
        let data = await response.json();
        if (data != null) {
            var factoryResetData = data[0]; // Assuming the factory reset data is in the first instance
            var cyberSecurityData = data[1]; // Assuming the settings are in the first instance

            //factoryResetData= '0100010100';
            //cyberSecurityData = '01';
            if (cyberSecurityData == '00') {
                // Handle the case where cyberSecurityData is '00'
                $('#cbCyberSecurity').prop('checked', false);
                updateCyberSecuritySetting(false);
            }
            else {
                // Handle the case where cyberSecurityData is not '00'
                $('#cbCyberSecurity').prop('checked', true);
                updateCyberSecuritySetting(true);
            }

            setCyberSecuritySetting(factoryResetData);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});

function updateCyberSecuritySetting(isChecked) {
    //var isChecked = $('#cbCyberSecurity').is(':checked');
    if (isChecked) {
        // Handle the case where the checkbox is checked
        $('#security-rows').find('input[type="checkbox"]').prop('disabled', false);
        $('#btnResetSecurity').prop('disabled', false);
    } else {
        // Handle the case where the checkbox is not checked
        $('#security-rows').find('input[type="checkbox"]').prop('disabled', true);
        $('#btnResetSecurity').prop('disabled', true);
    }
}


$('#btnResetSecurity').click(async function () {
    //$('#security-table input[type="checkbox"]').prop('checked', false);
    if (confirm('Are you sure you want to reset Cyber Security Configuration settings?')) {
        // Reset the settings
        let defaultValue = '0000000000'; // Default value to reset to
        if($('#cbPCShutdown').is(':checked'))
            defaultValue = '01' + defaultValue.substring(2);
        else
            defaultValue = '00' + defaultValue.substring(2);

        if($('#cbAlarm').is(':checked'))
            defaultValue = defaultValue.substring(0,2) + '01' + defaultValue.substring(4);
        else
            defaultValue = defaultValue.substring(0,2) + '00' + defaultValue.substring(4);

        if($('#cbEvents').is(':checked'))
            defaultValue = defaultValue.substring(0,4) + '01' + defaultValue.substring(6);  
        else
            defaultValue = defaultValue.substring(0,4) + '00' + defaultValue.substring(6);

        if($('#cbSettings').is(':checked'))
            defaultValue = defaultValue.substring(0,6) + '01' + defaultValue.substring(8);
        else
            defaultValue = defaultValue.substring(0,6) + '00' + defaultValue.substring(8);

        if($('#cbNetwork').is(':checked'))
            defaultValue = defaultValue.substring(0,8) + '01';
        else
            defaultValue = defaultValue.substring(0,8) + '00';

        // let isUpdated = await fnUpdateADIData(460, endianess.swaphex(defaultValue));
        let isUpdated = await fnUpdateADIData(460, defaultValue);

        if (isUpdated) {
            alert('you have successfully reset Cyber Security Configuration settings.');
            await doEventLogs('Cyber Security Configuration Reset', 'Security', 'Information', 'Reset','Cyber Security Configuration','User Action', '"Cyber Security Configuration" settings have been reset by user.');
        }
        else{
            alert('Failed to reset Cyber Security Configuration settings.');
            await doEventLogs('Cyber Security Configuration Reset Failed', 'Security', 'Error', 'Reset', 'Cyber Security Configuration', 'User Action', '"Cyber Security Configuration" settings failed to be reset by user.');
        }
    }   
    else {
        return; // If the user cancels, exit the function
    }
});

$('#cbCyberSecurity').change(async function () {
    var isChecked = $(this).is(':checked');
    var enVal = isChecked ? 'enable' : 'disable';
    if (confirm(`Are you sure you want to ${enVal} Cyber Security?`)) {
        let newValue = isChecked ? '01' : '00';
        let isUpdated = await fnUpdateADIData(461, newValue);
        updateCyberSecuritySetting(isChecked);
        alert(`You have successfully ${enVal}d Cyber Security.`);
        await doEventLogs(`Cyber Security ${enVal}d`, 'Security', 'Information', 'Update', 'Cyber Security','User Action', `"Cyber Security" has been ${enVal}d by user.`);
    }
    else {
        // If the user cancels, revert the checkbox state
        $(this).prop('checked', !isChecked);
    }
});

function setCyberSecuritySetting(currentValue) {
    let swapVal = endianess.swaphex(currentValue);    
    //PC Shutdown
    if (swapVal.substring(0, 2) == '01' ? true : false)
        $('#cbPCShutdown').prop('checked', true);
    else
        $('#cbPCShutdown').prop('checked', false);

    //Alarm
    if ((swapVal.substring(2, 4) == '01' ? true : false))
        $('#cbAlarm').prop('checked', true);
    else
        $('#cbAlarm').prop('checked', false);

    //Events
    if ((swapVal.substring(4, 6) == '01' ? true : false))
        $('#cbEvents').prop('checked', true);
    else
        $('#cbEvents').prop('checked', false);

    //Settings
    if ((swapVal.substring(6, 8) == '01' ? true : false))
        $('#cbSettings').prop('checked', true);
    else
        $('#cbSettings').prop('checked', false);

    //Network
    if ((swapVal.substring(8, 10) == '01' ? true : false))
        $('#cbNetwork').prop('checked', true);
    else
        $('#cbNetwork').prop('checked', false);
}