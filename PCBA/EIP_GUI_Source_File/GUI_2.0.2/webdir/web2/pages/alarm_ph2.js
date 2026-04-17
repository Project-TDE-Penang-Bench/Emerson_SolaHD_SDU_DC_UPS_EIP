var alarmRefreshInterval = 2000;
var mpA = new Map();

var sdn1_currtHigh;
var sdn1_tempHigh;

var sdn2_currtHigh;
var sdn2_tempHigh;

var sdn1_alarmFlag;
var sdn2_alarmFlag;

var Current_Max_Limit = 1000;
var Current_Min_Limit = 0;

var PreConfigTempUnit = null;


var url_405_406 = '/adi/data.json?inst=405&count=2'
var url400To406 = '/adi/data.json?inst=400&count=7'
var url_403_406 = '/adi/data.json?inst=403&count=4'

//debugger;
// console.log(`Alarm page...`)
//'/adi/data.json?inst=102&count=2'
fnGet_SDNData('/adi/data.json?inst=300&count=2', 1); //P1|Current High(300), P1|Temp High(301)
fnGet_SDNData('/adi/data.json?inst=332&count=2', 2); //P2|Current High(332), P2|Temp High(333)

fnGet_SDN_AlarmFlag('/adi/data.json?inst=402&count=2');
fnGet_SCM_AlarmFlag('/adi/data.json?inst=405&count=1');
fnGet_RED_AlarmFlag('/adi/data.json?inst=407&count=1');
//fnGet_SCM_Redndcy(url_405_406); //22-Aug-22
//fnGet_SCM_Redndcy(url_403_406); //26-Sep-22
fnGetSet_VinLimit(`/adi/data.json?inst=302&count=1`, 302);
fnGetSet_VinLimit(`/adi/data.json?inst=303&count=1`, 303);
fnGetSet_VinLimit(`/adi/data.json?inst=334&count=1`, 334);
fnGetSet_VinLimit(`/adi/data.json?inst=335&count=1`, 335);

fnGetSet_AvgPerctChange(`/adi/data.json?inst=304&count=1`, 304);
fnGetSet_AvgPerctChange(`/adi/data.json?inst=336&count=1`, 336);

fnGetSet_AvgPerctChange(`/adi/data.json?inst=365&count=1`, 365);

fnGet_SCMTempHi(`/adi/data.json?inst=364&count=1`, 364);



fnStartAlarmContentRefresh();
fnStartAlarmTempRefresh();

function fnStartAlarmContentRefresh() {
    objAlarmContentRefresh = setInterval(() => {
        $("#lbl300").html(mpA.get(300));
        $("#lbl302").html(mpA.get(302));
        $("#lbl303").html(mpA.get(303));
        $("#lbl304").html(mpA.get(304));
        $("#lbl332").html(mpA.get(332));
        //$("#lbl333").html(mpA.get(333));
        $("#lbl334").html(mpA.get(334));
        $("#lbl335").html(mpA.get(335));
        $("#lbl336").html(mpA.get(336));
        //$("#lbl364").html(mpA.get(364));
        $("#lbl365").html(mpA.get(365));
        $("#lblChk_P1_Alarm").html(mpA.get(402));
        $("#lblChk_P2_Alarm").html(mpA.get(403));
        $("#lbl405").html(mpA.get(405));
        $("#lbl407").html(mpA.get(407));
        $("#lbl301").html(mpA.get(301));
        $("#lbl333").html(mpA.get(333));
        $("#lbl364").html(mpA.get(364));
    }
        , alarmRefreshInterval);
}

function fnStopAlarmContentRefresh() {
    if (objAlarmContentRefresh != null)
        clearInterval(objAlarmContentRefresh);
}

function fnStartAlarmTempRefresh() {
    objAlarmTempUnitRefresh = setInterval(async () => {
        await fnGet_ConfigTempUnit();
    }
        , alarmRefreshInterval
    );
}

function fnStopAlarmTempRefresh() {
    if (objAlarmTempUnitRefresh != null)
        clearInterval(objAlarmTempUnitRefresh);
}

function UpdateCurrentPercent(ADI) {
    //debugger;    
    var txtboxName = '#' + ADI.toString();
    var currValue = $(txtboxName).val();
    if (currValue == "") {
        alert("Please insert Current % value.");
        $(txtboxName).focus();
        return;
    }

    if (currValue >= Current_Min_Limit && currValue <= Current_Max_Limit) {
        var popupMSG = null;
        if (ADI == 302)
            popupMSG = "Are you sure to update SDN1 Current %";
        else if (ADI == 318)
            popupMSG = "Are you sure to update SDN2 Current %";
        else if (ADI == 364)
            popupMSG = "Are you sure to update SCM Current %";

        if (popupMSG != null) {
            if (confirm(popupMSG)) {
                var hex = (Math.floor(currValue * 100)).toString(16);
                var hex1 = hex.replace(/^(.(..)*)$/, "0$1").match(/../g).reverse().join("");
                if (hex1.length == 2)
                    hex1 = hex1 + '00';
                $.post(`/adi/update.json?inst=${ADI}&value=${hex1}`, (data, status) => {
                    //alert(JSON.stringify(data));
                    if (data.result == 0) {
                        alert("Value updated successfully.")
                        $(txtboxName).val("");
                        //fnGet_SDNData('/adi/data.json?inst=300&count=2', 1);
                    }
                    else
                        alert("Error occurred while updating.")
                    $(txtboxName).val("");
                });
            }
        }
    }
    else {
        var strMSG = "The input value is outside the range. The allowable range is " + Current_Min_Limit + " to " + Current_Max_Limit + " percentage.";
        alert(strMSG);
        $(txtboxName).focus();
        return;
    }
}

async function GetData_400To406(url) {
    await $.getJSON(
        url,
        (data, status, xhr) => {
            //debugger;
            return data;
        }
    ).then((result) => {

    });
}


async function fnGet_SDN_AlarmFlag(url) {
    await $.getJSON(
        url,
        (data, status, xhr) => {
            //debugger;
            return data;
        }
    )
        .then((result) => {
            var f1, f2;
            f1 = fnGet_EnableDisable(result[0]);
            mpA.set(402, f1);
            f2 = fnGet_EnableDisable(result[1]);
            mpA.set(403, f2);
        });
}

async function fnGet_SCM_AlarmFlag(url) {
    await $.getJSON(
        url,
        (data, status, xhr) => {
            return data;
        }
    )
        .then((result) => {
            var f1;
            f1 = fnGet_EnableDisable(result[0]);
            mpA.set(405, f1);
        });
}
async function fnGet_RED_AlarmFlag(url) {
    await $.getJSON(
        url,
        (data, status, xhr) => {
            return data;
        }
    )
        .then((result) => {
            var f1;
            f1 = fnGet_EnableDisable(result[0]);
            mpA.set(407, f1);
        });
}

async function fnGet_SCM_Redndcy(url) {
    await $.getJSON(url,
        (data, status, xhr) => {
            //debugger;
            return data;
        }
    ).then((result) => {
        // var f1, f2;
        // f1 = fnGet_EnableDisable(result[0]);
        // mpA.set(405, f1);
        // f2 = fnGet_EnableDisable(result[1]);
        // mpA.set(406, f2);
        var ad403, ad404, ad405, ad406
        ad403 = fnGet_EnableDisable(result[0]);
        mpA.set(403, ad403);
        ad404 = fnGet_EnableDisable(result[1]);
        mpA.set(404, ad404);
        ad405 = fnGet_EnableDisable(result[2]);
        mpA.set(405, ad405);
        ad406 = fnGet_EnableDisable(result[3]);
        mpA.set(406, ad406);
    });
}

function fnGet_EnableDisable(inputVal) {
    var retValue;
    if (inputVal == 'FF' || inputVal == '01' || inputVal == 'ff' || inputVal == '0100')
        retValue = "Enable";
    else
        retValue = "Disable";

    return retValue;
}

async function fnGet_SDNData(url, psNum) {
    //debugger;
    //var retVal = null;
    let _psNum = psNum;
    //console.log(`_psNum => ${_psNum}...`);
    await $.getJSON(
        url,
        (data, status, xhr) => {
            //debugger;
            return data;
        }
    )
        .then((result) => {
            //console.log(`result => ${result}`)
            //debugger;
            var v1, v2;
            if (result[0] == 'ffffffff' || result[0] == 'FFFFFFFF')
                v1 = 'NaN';
            else {
                var _v1 = endianess.swaphex(result[0]);
                v1 = (hexToFloat32(_v1)).toFixed(1);
            }


            v2 = Math.round(convertH2D_A((endianess.swaphex(result[1]))));
            //console.log(`_psNum => ${_psNum}...`);
            if (_psNum == 1) {
                sdn1_currtHigh = v1;
                sdn1_tempHigh = v2;
                //mp.set(element.instance, `${hex2a(inputData[idx])}`);
                mpA.set(300, v1);
                mpA.set(301, v2);
                //fnGet_SDNData('/adi/data.json?inst=300&count=2', 1);
            }
            else {
                sdn2_currtHigh = v1;
                sdn2_tempHigh = v2;
                mpA.set(332, v1);
                mpA.set(333, v2);
                //fnGet_SDNData('/adi/data.json?inst=332&count=2', 2);
            }
            //retVal = result;
        })
}


$('.number').keypress(function (event) {
    if ((event.which != 46 || $(this).val().indexOf('.') != -1) &&
        ((event.which < 48 || event.which > 57) &&
            (event.which != 0 && event.which != 8))) {
        event.preventDefault();
    }

    var text = $(this).val();

    if ((text.indexOf('.') != -1) &&
        (text.substring(text.indexOf('.')).length > 1) &&
        (event.which != 0 && event.which != 8) &&
        ($(this)[0].selectionStart >= text.length - 1)) {
        event.preventDefault();
    }
});

$('.numberTemp').keypress(function (event) {
    //debugger;
    // if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which != 45 || $(this).val().indexOf('-') != -1) &&
    //     ((event.which < 48 || event.which > 57) &&
    //         (event.which != 0 && event.which != 8))) {
    //     event.preventDefault();
    // }

    if (event.key != '-') {
        if (isNaN(event.key)) {
            event.preventDefault();
            return false;
        }
    }


    if ((event.which == 46 || $(this).val().indexOf('.') != -1) && (event.which != 45 || $(this).val().indexOf('-') != -1) &&
        ((event.which < 48 || event.which > 57) && (event.which != 0 && event.which != 8))) {
        event.preventDefault();
    }


    let txt = ($(this).val()) + event.key;
    if ((txt.match(/-/g) || []).length > 1)
        event.preventDefault();

    // if ((sintRegEx.test(event.key)))
    //     ;
    // else
    //     event.preventDefault();

    /* if ((text.indexOf('.') != -1) && (text.substring(text.indexOf('.')).length > 1) && (text.indexOf('-') != -1) && (text.substring(text.indexOf('-')).length > 2) &&
        (event.which != 0 && event.which != 8) &&
        ($(this)[0].selectionStart >= text.length - 1)) {
        event.preventDefault();
    } */
});

$('.numVoltgHiLoValidate').keypress(function(event){
    if(event.key == '-' || event.key == '.' || isNaN(event.key)){
        event.preventDefault();
        return false;
    }

});


function btnSDN1CURRENT_HIGH() {
    //debugger;
    if ($("#300").val() == '') {
        alert("Please insert SDN 1 Current High value.");
        $("#300").focus();
        return;
    }
    var tem = $("#300").val();
    var outofTreshhold = fnshowCurrentTresholdLimit(tem)
    if (outofTreshhold) {
        $("#300").focus();
        return;
    }

    var strPopUpMsg = 'Are you sure to update SDN 1 Current High?';
    if (confirm(strPopUpMsg)) {
        //debugger;        
        //var hex = (Math.floor(tem * 10)).toString(16);        
        var hex = Float32ToHex(tem);
        var hex1 = hex.replace(/^(.(..)*)$/, "0$1").match(/../g).reverse().join("");
        hex1 = '00000000' + hex1;
        hex1 = hex1.slice(-8);

        $.post(`/adi/update.json?inst=300&value=${hex1}`, (data, status) => {
            //alert(JSON.stringify(data));
            if (data.result == 0) {
                alert("Value updated successfully.")
                $("#300").val("");
                fnGet_SDNData('/adi/data.json?inst=300&count=2', 1);
            }
            else
                alert("Error occurred while updating.")

        });
    }
}

function btnSDN2CURRENT_HIGH() {
    //debugger;
    if ($("#332").val() == '') {
        alert("Please insert SDN 2 Current High value.");
        $("#332").focus();
        return;
    }
    var tem = $("#332").val();
    var outofTreshhold = fnshowCurrentTresholdLimit(tem)
    if (outofTreshhold) {
        $("#332").focus();
        return;
    }
    var strPopUpMsg = 'Are you sure to update SDN 2 Current High?';
    if (confirm(strPopUpMsg)) {
        //var hex = (Math.floor(tem * 100)).toString(16);        
        var hex = Float32ToHex(tem);
        var hex1 = hex.replace(/^(.(..)*)$/, "0$1").match(/../g).reverse().join("");
        hex1 = '00000000' + hex1;
        hex1 = hex1.slice(-8);
        $.post(`/adi/update.json?inst=332&value=${hex1}`, (data, status) => {
            //alert(JSON.stringify(data));
            if (data.result == 0) {
                alert("Value updated successfully.")
                $("#332").val("");

                fnGet_SDNData('/adi/data.json?inst=332&count=2', 2);
            }
            else
                alert("Error occurred while updating.")
        });
    }
}

function btnSDN1TempHigh_Click() {
    //debugger; 
    if ($("#301").val() == '') {
        alert("Please insert SDN 1 Temperature High value.");
        $("#301").focus();
        return;
    }

    var inputTemp = $('#cbSDN1TempHigh').val();
    //alert(inputTemp);
    var tempInDC = 0.0;
    var strPopUpMsg = '';
    if (inputTemp == 'dF') {
        //(32°F − 32) × 5/9 = 0°C
        var DcTemp = $("#301").val();
        tempInDC = ((DcTemp - 32) * (5 / 9));
        var OutOfInlimit = fnshowTresholdLimit(tempInDC)
        if (OutOfInlimit) {
            $("#301").focus();
            return;
        }
        else
            strPopUpMsg = 'Are you sure to update SDN 1 Temperature High = ' + DcTemp + ' °F (' + tempInDC.toFixed(1) + ' °C)?';
    }
    else {
        tempInDC = $("#301").val();
        var OutOfInlimit = fnshowTresholdLimit(tempInDC)
        if (OutOfInlimit) {
            $("#301").focus();
            return;
        }
        else
            strPopUpMsg = 'Are you sure to update SDN 1 Temperature High = ' + tempInDC + ' °C ?';
    }

    if (confirm(strPopUpMsg)) {

        var tem = tempInDC; // $("#301").val();
        var hex, hex1;
        hex = DecimalHexTwosComplementN(tem * 10);
        hex1 = endianess.swaphex(hex.substring(4));
        if (hex1.length == 2)
            hex1 = hex1 + '00';
        $.post(`/adi/update.json?inst=301&value=${hex1}`, (data, status) => {
            if (data.result == 0) {
                alert("Value updated successfully.")
                $("#301").val("");

                fnGet_SDNData('/adi/data.json?inst=300&count=2', 1);
            }
            else
                alert("Error occurred while updating.")
        });
    }
}

function fnshowTresholdLimit(inTemp) {
    var isOutLimit = true;
    if (inTemp < -50 || inTemp > 150) {
        alert("Please enter temperature high value within threshold limit. \nThreshold Limit as below.\n Minimum :: -50 °C (-58 °F) \n Maximum :: 150 °C ( 302 °F)")
        isOutLimit = true;
    }
    else
        isOutLimit = false;

    return isOutLimit;
}

function btnSDN2TempHigh_Click() {
    //debugger; 
    if ($("#317").val() == '') {
        alert("Please insert SDN 2 Temperature High value.");
        $("#317").focus();
        return;
    }

    var inputTemp = $('#cbSDN2TempHigh').val();
    //alert(inputTemp);
    var tempInDC = 0.0;
    var strPopUpMsg = '';
    if (inputTemp == 'dF') {
        //(32°F − 32) × 5/9 = 0°C
        var DcTemp = $("#317").val();
        tempInDC = ((DcTemp - 32) * (5 / 9));
        var OutOfInlimit = fnshowTresholdLimit(tempInDC)
        if (OutOfInlimit) {
            $("#317").focus();
            return;
        }
        else
            strPopUpMsg = 'Are you sure to update SDN 2 Temperature High = ' + DcTemp + ' °F (' + tempInDC.toFixed(1) + ' °C)?';
    }
    else {
        tempInDC = $("#317").val();
        var OutOfInlimit = fnshowTresholdLimit(tempInDC)
        if (OutOfInlimit) {
            $("#317").focus();
            return;
        }
        else
            strPopUpMsg = 'Are you sure to update SDN 2 Temperature High = ' + tempInDC + ' °C ?';
    }

    if (confirm(strPopUpMsg)) {
        var tem = tempInDC; // $("#317").val();
        var hex, hex1;
        hex = DecimalHexTwosComplementN(tem * 10);
        hex1 = endianess.swaphex(hex.substring(4));
        if (hex1.length == 2)
            hex1 = hex1 + '00';
        $.post(`/adi/update.json?inst=317&value=${hex1}`, (data, status) => {
            //alert(JSON.stringify(data));
            //location.reload()
            if (data.result == 0) {
                alert("Value updated successfully.")
                $("#317").val("");
                fnGet_SDNData('/adi/data.json?inst=316&count=2', 2);
            }
            else
                alert("Error occurred while updating.")
        });


    }

}

function fnshowCurrentTresholdLimit(inCurr) {
    var isOutLimit = true;
    if (inCurr < 0 || inCurr > 200) {
        alert("Please enter current high value within threshold limit. \nThreshold Limit as below.\n Minimum :: 0 Amps \n Maximum :: 200 Amps")
        isOutLimit = true;
    }
    else
        isOutLimit = false;

    return isOutLimit;
}


function P1AlarmEnb() {

    var selVal = $("#cbP1Alarm").val();

    if (selVal == '-1') {
        alert("SDN 1 Alarm Flag value is not selected. Please select it first.")
        $("#cbP1Alarm").focus();
        return;
    }
    else if (selVal == '01') {
        strPopUpMsg = 'Are you sure to enable SDN 1 alarm?';
        inputVal = '0100';
    }
    else {
        strPopUpMsg = 'Are you sure to disable SDN 1 alarm?';
        inputVal = '0000';
    }

    if (confirm(strPopUpMsg)) {
        $.post(`/adi/update.json?inst=402&value=${inputVal}`, (data, status) => {
            //alert(JSON.stringify(data));
            //location.reload()
            if (data.result == 0) {
                alert("Value updated successfully.")
                fnGet_SDN_AlarmFlag('/adi/data.json?inst=402&count=2');
                $("select#cbP1Alarm").prop('selectedIndex', 0);
            }
            else
                alert("Error occurred while updating.")
        });
    }
}

function P2AlarmEnb() {
    var selVal = $("#cbP2Alarm").val();
    if (selVal == '-1') {
        alert("SDN 2 Alarm Flag value is not selected. Please select it first.")
        $("#cbP2Alarm").focus();
        return;
    }
    else if (selVal == '01') {
        strPopUpMsg = 'Are you sure to enable SDN 2 alarm?';
        inputVal = '0100';
    }
    else {
        strPopUpMsg = 'Are you sure to disable SDN 2 alarm?';
        inputVal = '0000';
    }

    if (confirm(strPopUpMsg)) {
        $.post(`/adi/update.json?inst=403&value=${inputVal}`, (data, status) => {
            //alert(JSON.stringify(data));
            //location.reload()
            if (data.result == 0) {
                alert("Value updated successfully.")
                fnGet_SDN_AlarmFlag('/adi/data.json?inst=402&count=2');
                $("select#cbP2Alarm").prop('selectedIndex', 0);
            }
            else
                alert("Error occurred while updating.")
        });
    }
}

function SCMAlarmEnb() {
    var selVal = $("#cbPSCMAlarm").val();
    if (selVal == '-1') {
        alert("SCM Alarm Flag value is not selected. Please select it first.")
        $("#cbPSCMAlarm").focus();
        return;
    }
    else if (selVal == '01') {
        strPopUpMsg = 'Are you sure to enable SCM alarm?';
        inputVal = '0100';
    }
    else {
        strPopUpMsg = 'Are you sure to disable SCM alarm?';
        inputVal = '0000';
    }

    if (confirm(strPopUpMsg)) {
        $.post(`/adi/update.json?inst=405&value=${inputVal}`, (data, status) => {
            if (data.result == 0) {
                alert("Value updated successfully.")
                fnGet_SCM_AlarmFlag('/adi/data.json?inst=405&count=1');
                $("select#cbPSCMAlarm").prop('selectedIndex', 0);
            }
            else
                alert("Error occurred while updating.")
        });
    }
}

function REDAlarmEnb() {
    var selVal = $("#cbREDAlarm").val();
    if (selVal == '-1') {
        alert("Redundancy Alarm Flag value is not selected. Please select it first.")
        $("#cbREDAlarm").focus();
        return;
    }
    else if (selVal == '01') {
        strPopUpMsg = 'Are you sure to enable Redundancy alarm?';
        inputVal = '0100';
    }
    else {
        strPopUpMsg = 'Are you sure to disable Redundancy alarm?';
        inputVal = '0000';
    }

    if (confirm(strPopUpMsg)) {
        $.post(`/adi/update.json?inst=407&value=${inputVal}`, (data, status) => {
            if (data.result == 0) {
                alert("Value updated successfully.")
                fnGet_RED_AlarmFlag('/adi/data.json?inst=407&count=1');
                $("select#cbREDAlarm").prop('selectedIndex', 0);
            }
            else
                alert("Error occurred while updating.")
        });
    }
}


function RedundancyAlarmEnb() {
    var selVal = $("#cbRedundancyAlarm").val();
    if (selVal == '-1') {
        alert("Redundancy Enable Alarm Flag value is not selected. Please select it first.")
        $("#cbRedundancyAlarm").focus();
        return;
    }
    else if (selVal == '01') {
        strPopUpMsg = 'Are you sure to enable Redundancy alarm?';
        inputVal = '01';
    }
    else {
        strPopUpMsg = 'Are you sure to disable Redundancy alarm?';
        inputVal = '00';
    }

    if (confirm(strPopUpMsg)) {
        $.post(`/adi/update.json?inst=406&value=${inputVal}`, (data, status) => {
            if (data.result == 0) {
                alert("Value updated successfully.")
                fnGet_SCM_Redndcy(url_405_406);
            }
            else
                alert("Error occurred while updating.")
        });
    }
}

//TBD
function SCMEnableAlarm() {
    var selVal = $("#cbSCMEnableAlarm").val();
    if (selVal == '-1') {
        alert("SCM Enable Alarm Flag value is not selected. Please select it first.")
        $("#cbSCMEnableAlarm").focus();
        return;
    }
    else if (selVal == '01') {
        strPopUpMsg = 'Are you sure to enable SCM alarm?';
        inputVal = '01';
    }
    else {
        strPopUpMsg = 'Are you sure to disable SCM alarm?';
        inputVal = '00';
    }

    if (confirm(strPopUpMsg)) {
        $.post(`/adi/update.json?inst=405&value=${inputVal}`, (data, status) => {
            if (data.result == 0) {
                alert("Value updated successfully.")
                fnGet_SCM_Redndcy(url_405_406);
            }
            else
                alert("Error occurred while updating.")
        });
    }
}

function PS1HiVoltageIn() {

}

function PS1LowVoltageIn() {

}

function convertH2D_A(hexVal) {
    var hex = hexVal;
    var retVal;
    var decval;
    hex = hex.replace("0x", "");
    try {
        var x = new BigNumber(hex, 16);
    }
    catch (err) {
        return;
    }
    var xx = x.toString(10);
    if (x.isInt() && x.gte(0)) {
        if (hex.length == 2 && x.gte("80", 16)) { x = x.minus("100", 16); }
        if (hex.length == 4 && x.gte("8000", 16)) { x = x.minus("10000", 16); }
        if (hex.length == 8 && x.gte("80000000", 16)) { x = x.minus("100000000", 16); }
        var t1 = new BigNumber("8000000000000000", 16);
        var t2 = new BigNumber("10000000000000000", 16);
        if (hex.length == 16 && x.gte(t1)) { x = x.minus(t2); }
        if (hex.length == 2 || hex.length == 4 || hex.length == 8 || hex.length == 16)
            decval = x.toString(10);
        else
            decval = "N/A";
    }
    else
        decval = "N/A";

    if (decval != "N/A")
        retVal = decval;
    else
        retVal = "";

    return retVal;
}

function dC2dF_A(dcVal) {
    return (`${(dcVal * 1.0).toFixed(1)} °C (${(((dcVal) * (9 / 5)) + 32).toFixed(1)} °F)`);
}



function DecimalHexTwosComplementN(decimal) {
    var size = 8;

    if (decimal >= 0) {
        var hexadecimal = decimal.toString(16);

        while ((hexadecimal.length % size) != 0) {
            hexadecimal = "" + 0 + hexadecimal;
        }

        return hexadecimal;
    } else {
        var hexadecimal = Math.abs(decimal).toString(16);
        while ((hexadecimal.length % size) != 0) {
            hexadecimal = "" + 0 + hexadecimal;
        }

        var output = '';
        for (i = 0; i < hexadecimal.length; i++) {
            output += (0x0F - parseInt(hexadecimal[i], 16)).toString(16);
        }

        output = (0x01 + parseInt(output, 16)).toString(16);
        return output;
    }
}


function btnTempHigh_Click(objBtn) {
    //debugger;
    let devstrmsg = null;
    let btn_id = null;
    let tempInDC = null;
    let tempInDF = null;
    let curr_unit = null;
    let updat_url = '';
    let objInputBox = null;
    //let objCbUnit = null;
    let AdiId = null;
    let objUnit = null;
    let objLBL = null;
    btn_id = objBtn.id;
    switch (btn_id) {
        case 'SDN1TempHigh':
            devstrmsg = 'SDN 1 Temperature High'
            objInputBox = $("#301");
            //objCbUnit = $('#cbSDN1TempHigh');
            AdiId = 301;
            objUnit = $("#lblSDN1TempHighUnit").text();
            break;
        case 'SDN2TempHigh':
            devstrmsg = 'SDN 2 Temperature High'
            objInputBox = $("#333");
            objCbUnit = $('#cbSDN2TempHigh');
            AdiId = 333;
            objUnit = $("#lblSDN2TempHighUnit").text();
            break;
        case 'SCMTempHigh':
            devstrmsg = 'SCM Temperature High'
            objInputBox = $("#364");
            objCbUnit = $('#cbSCMTempHigh');
            AdiId = 364;
            objUnit = $("#lblSCMTempHighUnit").text();
            break;
    }

    if (objInputBox.val() == '') {
        alert(`Please insert ${devstrmsg} value.`);
        objInputBox.focus();
        return;
    }
    if (isNaN(objInputBox.val())) {
        alert(`Please insert valid input value.`);
        objInputBox.focus();
        return;
    }
    else {
        //console.log(`test => ${(new Date).toTimeString()}`);
        /* if (objCbUnit.val() == 'dC') {
            tempInDC = objInputBox.val();
            tempInDF = Math.round((tempInDC * (9 / 5)) + 32);
        }
        else {
            tempInDF = objInputBox.val();
            tempInDC = Math.round(((tempInDF - 32) * 5 / 9));
        } */
        if (objUnit == '℃') {
            tempInDC = objInputBox.val();
            tempInDF = Math.round((tempInDC * (9 / 5)) + 32);
        }
        else {
            tempInDF = objInputBox.val();
            tempInDC = Math.round(((tempInDF - 32) * 5 / 9));
        }

        if (tempInDC < -50 || tempInDC > 150) {
            alert(`Please enter ${devstrmsg} value within threshold limit. \nThreshold Limit as below.\n Minimum :: -50 °C (-58 °F) \n Maximum :: 150 °C ( 302 °F)`);
            objInputBox.focus();
            return;
        }
        else {

            let confirm_msg = '';
            if (objUnit == '℃')
                confirm_msg = `Are you sure to update ${devstrmsg} = ${objInputBox.val()} °C?`;
            else
                confirm_msg = `Are you sure to update ${devstrmsg} = ${objInputBox.val()} °F?`;

            if (confirm(confirm_msg)) {
                let hex, hex1;
                //hex = DecimalHexTwosComplementN(tempInDC * 1.0);
                hex = DecimalHexTwosComplementN(objInputBox.val() * 1.0);
                hex1 = endianess.swaphex(hex.substring(4));
                if (hex1.length == 2)
                    hex1 = hex1 + '00';
                $.post(`/adi/update.json?inst=${AdiId}&value=${hex1}`, (data, status) => {
                    if (data.result == 0) {
                        alert("Value updated successfully.")
                        //$("#301").val("");
                        if (AdiId == 301) {
                            $("#301").val("");
                            fnGet_SDNData('/adi/data.json?inst=300&count=2', 1);
                        }
                        if (AdiId == 333) {
                            $("#333").val("");
                            fnGet_SDNData('/adi/data.json?inst=332&count=2', 2);
                        }
                        if (AdiId == 364) {
                            $("#364").val("");
                            fnGet_SCMTempHi(`/adi/data.json?inst=364&count=1`, 364);
                        }

                        //
                    }
                    else
                        alert("Error occurred while updating.")
                });
            }
        }

    }

}

function btnVoltageLimitSet(objBtn) {
    let btn_id = null;
    let range_min_val = null;
    let range_max_val = null;
    let objInputBox = null;
    let devstrmsg = null;
    let AdiId = null;
    btn_id = objBtn.id;
    switch (btn_id) {
        case 'P1VinHigh':
            range_min_val = 140;
            range_max_val = 300;
            objInputBox = $('#302');
            devstrmsg = 'SDN 1 Input Voltage High';
            AdiId = 302;
            break;
        case 'P1VinLow':
            range_min_val = 50;
            range_max_val = 200;
            objInputBox = $('#303');
            devstrmsg = 'SDN 1 Input Voltage Low';
            AdiId = 303;
            break;
        case 'P2VinHigh':
            range_min_val = 140;
            range_max_val = 300;
            objInputBox = $('#334');
            devstrmsg = 'SDN 2 Input Voltage High';
            AdiId = 334;
            break;
        case 'P2VinLow':
            range_min_val = 50;
            range_max_val = 200;
            objInputBox = $('#335');
            devstrmsg = 'SDN 2 Input Voltage Low';
            AdiId = 335;
            break;
    }

    if (objInputBox.val() == '') {
        alert(`Please insert ${devstrmsg} limit value.`);
        objInputBox.focus();
        return;
    }
    else {
        if (!(objInputBox.val() >= range_min_val && objInputBox.val() <= range_max_val)) {
            alert(`Please enter ${devstrmsg} value within threshold limit. \nThreshold Limit as below.\n Minimum :: ${range_min_val} \n Maximum :: ${range_max_val}`);
            objInputBox.focus();
            return;
        }
        else {
            let confirm_msg = '';
            confirm_msg = `Are you sure to update ${devstrmsg} limit value?`;
            if (confirm(confirm_msg)) {
                let hex, hex1;
                hex = DecimalHexTwosComplementN(objInputBox.val() * 1.0);
                hex1 = endianess.swaphex(hex.substring(4));
                if (hex1.length == 2)
                    hex1 = hex1 + '00';
                $.post(`/adi/update.json?inst=${AdiId}&value=${hex1}`, (data, status) => {
                    if (data.result == 0) {
                        alert("Value updated successfully.")
                        objInputBox.val('');
                        fnGetSet_VinLimit(`/adi/data.json?inst=${AdiId}&count=1`, AdiId)
                    }
                    else
                        alert("Error occurred while updating.")
                });
            }
        }
    }

}

function btnAvgOutCurrChange(objBtn) {
    //debugger;
    let btn_id = null;
    let range_min_val = 0;
    let range_max_val = 100;
    let objInputBox = null;
    let devstrmsg = null;
    let AdiId = null;
    btn_id = objBtn.id;
    switch (btn_id) {
        case 'P1AvgIoutLimit':
            objInputBox = $('#304');
            devstrmsg = 'SDN 1 Average Output Current Change';
            AdiId = 304;
            break;
        case 'P2AvgIoutLimit':
            objInputBox = $('#336');
            devstrmsg = 'SDN 2 Average Output Current Change';
            AdiId = 336;
            break;
        case 'SCMAvgIoutLimit':
            objInputBox = $('#365');
            devstrmsg = 'SCM Average Temperature Change';
            AdiId = 365;
            break;
    }

    if (objInputBox.val() == '') {
        alert(`Please insert ${devstrmsg} % value.`);
        objInputBox.focus();
        return;
    }
    else {
        if (!(objInputBox.val() >= range_min_val && objInputBox.val() <= range_max_val)) {
            alert(`Please enter ${devstrmsg} % value within threshold limit. \nThreshold Limit as below.\n Minimum :: ${range_min_val} \n Maximum :: ${range_max_val}`);
            objInputBox.focus();
            return;
        }
        else {
            let confirm_msg = '';
            confirm_msg = `Are you sure to update ${devstrmsg} % value?`;
            if (confirm(confirm_msg)) {
                let hex, hex1;
                hex = Float32ToHex(objInputBox.val());
                hex1 = hex.replace(/^(.(..)*)$/, "0$1").match(/../g).reverse().join("");;
                hex1 = '00000000' + hex1;
                hex1 = hex1.slice(-8);

                $.post(`/adi/update.json?inst=${AdiId}&value=${hex1}`, (data, status) => {
                    if (data.result == 0) {
                        alert("Value updated successfully.")
                        objInputBox.val('');
                        //fnGetSet_VinLimit(`/adi/data.json?inst=${AdiId}&count=1`, AdiId)
                        fnGetSet_AvgPerctChange(`/adi/data.json?inst=${AdiId}&count=1`, AdiId)
                    }
                    else
                        alert("Error occurred while updating.")
                });
            }

        }
    }
}

function highTempTxtBoxKeyPress(objTxtBox) {
    objTxtBox.value.replace(/\D/g, '');
}

async function fnGetSet_VinLimit(url, adiID) {
    //debugger;
    let _url = url;
    let _adiID = adiID;
    //console.log(`_url => ${_url}`);
    //console.log(`_adiID => ${_adiID}`);
    await $.getJSON(
        _url,
        (data, status, xhr) => {
            //debugger;
            return data;
        }
    )
        .then((result) => {
            let v1;
            if (result[0] == 'ffff' || result[0] == 'FFFF')
                v1 = 'NaN';
            else {
                v1 = Math.round(parseInt((endianess.swaphex(result[0])), 16));
            }
            //console.log(`_adiID => ${_adiID}`);
            mpA.set(_adiID, v1);
        })
}

async function fnGetSet_AvgPerctChange(url, adiID) {
    //debugger;
    let _url = url;
    let _adiID = adiID;
    //console.log(`_url => ${_url}`);
    //console.log(`_adiID => ${_adiID}`);
    await $.getJSON(
        _url,
        (data, status, xhr) => {
            //debugger;
            return data;
        }
    )
        .then((result) => {
            let v1;
            if (result[0] == 'ffff' || result[0] == 'FFFF')
                v1 = 'NaN';
            else {
                v1 = (hexToFloat32(endianess.swaphex(result[0]))).toFixed(1);
            }
            //console.log(`_adiID => ${_adiID}`);
            mpA.set(_adiID, v1);
        })
}

async function fnGet_SCMTempHi(url, adiID) {
    //debugger;
    let _url = url;
    let _adiID = adiID;
    //console.log(`_url => ${_url}`);
    //console.log(`_adiID => ${_adiID}`);
    await $.getJSON(
        _url,
        (data, status, xhr) => {
            //debugger;
            return data;
        }
    )
        .then((result) => {
            let v1;
            v1 = Math.round(convertH2D_A((endianess.swaphex(result[0]))));
            // if (result[0] == 'ffff' || result[0] == 'FFFF')
            //     v1 = 'NaN';
            // else {
            //     v1 = Math.round(convertH2D_A((endianess.swaphex(result[0]))));
            //     //console.log(`v1 => ${v1}`);                
            // }
            //console.log(`_adiID => ${_adiID}`);
            mpA.set(_adiID, v1);
        })
}

function validateSintInput() {
    var inputElement = document.getElementById('sintInput');
    var inputValue = inputElement.value.trim();

    // Regular expression for validating signed integers
    var sintRegex = /^\-?\d+$/;

    if (sintRegex.test(inputValue)) {
        // Input is a valid signed integer
        inputElement.style.borderColor = 'green';
    } else {
        // Input is not a valid signed integer
        inputElement.style.borderColor = 'red';
    }
}

async function fnGet_ConfigTempUnit() {
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
                $("#lblSDN1TempHighUnit").html('&#8451');
                $("#lblSDN2TempHighUnit").html('&#8451');
                $("#lblSCMTempHighUnit").html('&#8451');
            }
            else {
                $("#lblSDN1TempHighUnit").html('&#8457');
                $("#lblSDN2TempHighUnit").html('&#8457');
                $("#lblSCMTempHighUnit").html('&#8457');
            }

            if (result[0] != PreConfigTempUnit) {
                //console.log(`temp unit changed from ${PreConfigTempUnit} to ${result[0]}`);

                fnGet_SDNData('/adi/data.json?inst=300&count=2', 1); //P1|Current High(300), P1|Temp High(301)
                fnGet_SDNData('/adi/data.json?inst=332&count=2', 2); //P2|Current High(332), P2|Temp High(333)
                fnGet_SCMTempHi(`/adi/data.json?inst=364&count=1`, 364);
                PreConfigTempUnit = result[0];
            }
        })
        .fail(() => {
            $('#header_SCM_Cnn').css({ display: 'block' });
        });
}

const hexToFloat32 = (hex) => {
    // Get a buffer and an Uint32Array and Float32Array that will
    // share the buffer
    const buf = new ArrayBuffer(4); // 4 bytes = 32 bits
    const i32 = new Uint32Array(buf);
    const f32 = new Float32Array(buf);
    // Put our number in element 0 of the Uint32Array
    i32[0] = typeof hex === "number" ? hex : parseInt(hex, 16);
    // Get those same bits interpreted as a Float32 and return it
    return f32[0];
};


const Float32ToHex = (float_val) => {
    //const getHex = float_val => ('00' + float_val.toString(16)).slice(-2);
    //debugger;
    const getHex = i => ('00' + i.toString(16)).slice(-2);
    let view = new DataView(new ArrayBuffer(4)),
        ret_val;

    //view.setFloat32(0, 45.839152);
    view.setFloat32(0, float_val);
    ret_val = Array
        .apply(null, { length: 4 })
        .map((_, i) => getHex(view.getUint8(i)))
        .join('');

    //console.log(ret_val);
    return ret_val;
}


function fnOnPaste_CurentHigh(event) {
    //debugger;
    var pastedText = (event.clipboardData || window.clipboardData).getData('text');
    //alert(pastedText);
    if (isNaN(pastedText) || pastedText == '') {
        event.preventDefault();
    }
    else {
        //alert('pasted is number!');
        var val = Number(pastedText);
        if(val < 0){
            event.preventDefault();
            return false;
        }

        if (Number.isInteger(pastedText))
            return true
        else {
            if (pastedText.toString().split('.')[1].length > 1){
                event.preventDefault();
                var tm = pastedText.match(/^-?\d+(?:\.\d{0,1})?/)
                var cntrl = `#${event.currentTarget.id}`;                
                $(cntrl).val(tm);
            }
        }

    }
}

function fnOnPaste_TempHigh(event){ 
    //debugger;
    var pastedText = (event.clipboardData || window.clipboardData).getData('text');
    //alert(pastedText);
    if (isNaN(pastedText) || pastedText == '') {
        event.preventDefault();
    }
    else {        
        var val = Number(pastedText);
        if (Number.isInteger(pastedText))
            return true
        else {
            if (pastedText.toString().split('.')[1].length > 0)
                event.preventDefault();
                var tm = pastedText.match(/^-?\d+(?:\.\d{0,0})?/)
                var cntrl = `#${event.currentTarget.id}`;
                //$(cntrl).val(tm);
                $(cntrl).val(parseInt(tm));
        }

    }
}

function fnOnPaste_InVoltgHiLo(event){
    //debugger;
    var pastedText = (event.clipboardData || window.clipboardData).getData('text');
    //alert(pastedText);
    if (isNaN(pastedText) || pastedText == '') {
        event.preventDefault();
    }
    else {        
        var val = Number(pastedText);
        if(val < 0){
            event.preventDefault();
            return false;
        }
        if (Number.isInteger(pastedText))
            return true
        else {
            if (pastedText.toString().split('.')[1].length > 0)
                event.preventDefault();
                var tm = pastedText.match(/^-?\d+(?:\.\d{0,0})?/)
                var cntrl = `#${event.currentTarget.id}`;
                //$(cntrl).val(tm);
                $(cntrl).val(parseInt(tm));
        }
    }
}