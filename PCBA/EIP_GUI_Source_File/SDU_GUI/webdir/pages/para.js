if (objEventDataOperation != null)
    clearInterval(objEventDataOperation);
if (objOverviewDataOperation != null)
    clearInterval(objOverviewDataOperation);
if (objSettingDataOperation != null)
    clearInterval(objSettingDataOperation);
if(objPCShutdownDataOperation != null)
    clearInterval(objPCShutdownDataOperation);

var paraRefreshRate = 2000; // 2 second
var urlParaMeta = `adi/metadata.json?inst=100&count=7`;
var urlParaData = `adi/data.json?inst=100&count=7`;
var paraMeta = [];
var urlMeasurement = `adi/metadata.json?inst=150&count=5`;
var urlMeasurementData = `adi/data.json?inst=150&count=5`;
var measurementMeta = [];
var urlTimer = `adi/metadata.json?inst=200&count=3`;
var urlTimerData = `adi/data.json?inst=200&count=3`;
var timerMeta = [];
var urlAlarmMeta = `adi/metadata.json?inst=402&count=3`;
var urlAlarmData = `adi/data.json?inst=402&count=3`;
var alarmMeta = [];
var urlAlarmMeta1 = `adi/metadata.json?inst=400&count=1`;
var urlAlarmData1 = `adi/data.json?inst=400&count=1`;
var alarmMeta1 = [];

fetch(urlParaMeta).then(async (response) => {
    try {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let jsonParaMeta = await response.json();
        paraMeta = jsonParaMeta;
        objParaDataOperation = setInterval(async () => {
            await fnFillParaData();
        }, paraRefreshRate);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});

fetch(urlMeasurement).then(async (response) => {
    try {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let jsonMeasurementMeta = await response.json();
        measurementMeta = jsonMeasurementMeta;
        objMeasurementDataOperation = setInterval(async () => {
            await fnFillMeasurementData();
        }, paraRefreshRate);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});

fetch(urlTimer).then(async (response) => {
    try {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let jsonTimerMeta = await response.json();
        timerMeta = jsonTimerMeta;
        objTimerDataOperation = setInterval(async () => {
            await fnFillTimerData();
        }, paraRefreshRate);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});

fetch(urlAlarmMeta).then(async (response) => {
    try {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let jsonAlarmMeta = await response.json();
        alarmMeta = jsonAlarmMeta;
        objAlarmParaDataOperation = setInterval(async () => {
            await fnFillAlaramData();
        }, paraRefreshRate);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});

async function fnFillAlaramData() {
    //debugger;
    let alarmData = await fnFetchAPIData(urlAlarmData) || [];
    // alarmMeta.forEach(async (item, idx) => {
    //     switch (item.instance) {
    //         case 402://Alarm Status
    //             let valTempHex = endianess.swaphex(alarmData[idx]);
    //             let tempUnit = await fnGetConfigTempUnit();
    //             let floatTempValue = SINT16ToDecimal(valTempHex);
    //             $("#adi-402").html(floatTempValue.toFixed(2));
    //             $("#adi-402-Unit").html(tempUnit);
    //             break;
    //         case 403:
    //             let valHex = endianess.swaphex(alarmData[idx]);
    //             let value = valHex.padStart(4, '0').slice(-4);
    //             $(`#adi-403`).html((parseInt(value, 16) & 0xFFFF).toFixed(2));
    //             break;
    //         case 404:
    //             let vHex = endianess.swaphex(alarmData[idx]);
    //             let val = vHex.padStart(8, '0').slice(-8);
    //             $(`#adi-404`).html((parseInt(val, 16) >>> 0).toFixed(2));
    //             break;
    //     }
    // });
    await AlarmStatus();
}

async function AlarmStatus() {
   response = await fnFetchAPIData(urlAlarmData1) || [];
   let alarmStatusHex = endianess.swaphex(response[0]);
   //console.log(`alarmStatusHex: ${alarmStatusHex}`);
   let alarmStatusBin = parseInt(alarmStatusHex, 16).toString(2).padStart(4, '0');
   //console.log(`alarmStatusBin: ${alarmStatusBin}`);
   let alarmStatusBinReversedArray = alarmStatusBin.split("").reverse();
   //console.log(`alarmStatusBinReversedArray: ${alarmStatusBinReversedArray}`);
   let alarmStatusBinArray = alarmStatusBinReversedArray.slice(0, 3);
   //console.log(`alarmStatusBinArray: ${alarmStatusBinArray}`);
   alarmStatusBinArray.forEach((item, idx) => {
       switch (idx) {
           case 0:
               //console.log(`Alarm Status Bit 0: ${item}`);
               $(`#adi-400-${idx}`).html(item == 1 ? "Enabled" : "");
               break;
           case 1:
               //console.log(`Alarm Status Bit 1: ${item}`);
               $(`#adi-400-${idx}`).html(item == 1 ? "Enabled" : "");
               break;
           case 2:
               //console.log(`Alarm Status Bit 2: ${item}`);
               $(`#adi-400-${idx}`).html(item == 1 ? "Enabled" : "");
               break;
       }
   });
}

async function fnFillTimerData() {
    let timerData = await fnFetchAPIData(urlTimerData) || [];
    timerMeta.forEach((item, idx) => {
        switch (item.instance) {
            case 200://Timer 1
            case 201://Timer 2
            case 202://Timer 3
                let timerHex = endianess.swaphex(timerData[idx]);
                let timerValue = timerHex.padStart(8, '0').slice(-8);
                let timerValueDecimal = parseInt(timerValue, 16) >>> 0;
                $(`#adi-${item.instance}`).html((timerValueDecimal / 3600).toFixed(2));
                break;
        }
    });
}

async function fnFillMeasurementData() {
    let measurementData = await fnFetchAPIData(urlMeasurementData) || [];
    measurementMeta.forEach(async (item, idx) => {
        switch (item.instance) {
            case 150://Input Voltage
            case 151://Output Voltage
            case 152://Battery Voltage
            case 153://Output Current
                let valHex = endianess.swaphex(measurementData[idx]);
                let floatValue = hexToFloat32(valHex);
                $(`#adi-${item.instance}`).html(floatValue.toFixed(2));
                break;
            case 154://Internal Temperature
                let valTempHex = endianess.swaphex(measurementData[idx]);
                let tempUnit = await fnGetConfigTempUnit();
                let floatTempValue = SINT16ToDecimal(valTempHex);
                $("#adi-154").html(floatTempValue.toFixed(2));
                $("#adi-15InTempUnit").html(tempUnit);
                break;
                break;
        }
    });
}

async function fnFillParaData() {
    let paraData = await fnFetchAPIData(urlParaData) || [];
    paraMeta.forEach((item, idx) => {
        switch (item.instance) {
            case 100://Output and Battery LED Status
                let tempReverse = endianess.swaphex(paraData[idx]);
                let outputLED = tempReverse.substring(0, 4);
                let batteryLED = tempReverse.substring(4, 8);
                //OutputState
                switch (outputLED) {
                    case '0000':
                    case '0004':
                    case '0010':
                    case '0080':
                        $("#adi-100-1").html("Abnormal Output");
                        break;
                    case '0002':
                    case '0008':
                        $("#adi-100-1").html("Normal Output");
                        break;
                    default:
                        $("#adi-100-1").html("Unknown Output State");
                }
                //BatteryState
                switch (batteryLED) {
                    case '0000':
                    case '0080':
                    case '0220':
                        $("#adi-100-2").html("Abnormal Battery");
                        break;
                    case '0001':
                    case '0004':
                    case '0008':
                    case '0200':
                        $("#adi-100-2").html("Normal Battery");
                        break;
                    default:
                        $("#adi-100-2").html("Unknown Battery State");
                }
                break;
            case 101:// Comm LED Status;  
                let inputHex = endianess.swaphex(paraData[idx]);
                let binValue = parseInt(inputHex, 16).toString(2).padStart(8, '0');
                let binArray = binValue.split("");
                let retVal = '';
                binArray.forEach((item, idx) => {
                    if (item == 1) {
                        switch (idx) {
                            case 7:
                                retVal += '<span >NS: No Connection</span><br/>';
                                break;
                            case 6:
                                retVal += '<span >NS: Connected</span><br/>';
                                break;
                            case 5:
                                retVal += '<span >NS: Connection Timeout</span><br/>';
                                break;
                            case 4:
                                retVal += '<span >NS: Duplicate IP</span><br/>';
                                break;
                            case 3:
                                retVal += '<span >MS: Standby</span><br/>';
                                break;
                            case 2:
                                retVal += '<span >MS: Device Operational</span><br/>';
                                break;
                            case 1:
                                retVal += '<span>MS: Major Recoverable Fault </span><br/>';
                                break;
                            case 0:
                                retVal += '<span >MS: Major Unrecoverable Fault</span><br/>';
                                break;
                            default:
                                retVal = "";
                        }
                    }
                });
                $("#adi-101").html(retVal);
                break;
            case 102://Event Flags   
                //debugger;             
                let eventHex = endianess.swaphex(paraData[idx]);
                let eventBin = parseInt(eventHex, 16).toString(2).padStart(16, '0');
                let eventBinReversedArray = eventBin.split("").reverse();
                let eventBinArray = eventBinReversedArray.slice(0, 9);
                eventBinArray.forEach((item, idx) => {                    
                    if (item == 1)
                        $(`#adi-102-${idx}`).html("Enabled");
                    else
                        $(`#adi-102-${idx}`).html("");
                });
                break;
            case 103://Mode Of Operation
                if (paraData[idx] == '0000')
                    $("#adi-103").html("Line Mode");
                else if (paraData[idx] == '0100')
                    $("#adi-103").html("Battery/Backup Mode");
                else
                    $("#adi-103").html("Unknown");
                break;
            case 104://Battery Charge
                let swpHex = endianess.swaphex(paraData[idx]);
                swpHex = '0064';
                $("#adi-104").html(parseInt(swpHex, 16));
                break;
            case 105://Battery Healtht
                switch (paraData[idx]) {
                    case '0000':
                        $("#adi-105").html("Battery Good");
                        break;
                    case '0100':
                        $("#adi-105").html("Needs Replacement");
                        break;
                    case '0200':
                        $("#adi-105").html("Replace Now");
                        break;
                    default:
                        break;
                }
                break;
            case 106://PC Shutdown Status Flags
                //debugger;
                let statusShutdownHex = endianess.swaphex(paraData[idx]);
                let statusShutdownBin = parseInt(statusShutdownHex, 16).toString(2).padStart(16, '0');
                let revercedArray = statusShutdownBin.split("").reverse();
                let statusShutdownBinArray = revercedArray.slice(0, 3); // (statusShutdownBin.substring(0, 3)).split("");
                statusShutdownBinArray.forEach((item, idx) => {
                    if (item == 1)
                        $(`#adi-106-${idx}`).html("Enabled");
                    else
                        $(`#adi-106-${idx}`).html("");
                });
                break;
        }
    });
}

function toggleFlag(row, flagDivId) {
    const flagDiv = document.getElementById(flagDivId);
    const toggleIcon = row.querySelector('.toggle-icon');
    if (flagDiv.style.display === 'none' || flagDiv.style.display === '') {
        flagDiv.style.display = 'table-row';
        toggleIcon.textContent = '▼';
    } else {
        flagDiv.style.display = 'none';
        toggleIcon.textContent = '▶';
    }
}