var alarmRefreshInterval = 1000;
var mpA = new Map();

var sdn1_currtHigh;
var sdn1_tempHigh;

var sdn2_currtHigh;
var sdn2_tempHigh;

var sdn1_alarmFlag;
var sdn2_alarmFlag;

var Current_Max_Limit = 2000; 
var Current_Min_Limit = 0; 

var url_405_406 = '/adi/data.json?inst=405&count=2'
var url400To406 = '/adi/data.json?inst=400&count=7'
var url_403_406 = '/adi/data.json?inst=403&count=4'

//debugger;

//'/adi/data.json?inst=102&count=2'
fnGet_SDNData('/adi/data.json?inst=300&count=2', 1);
fnGet_SDNData('/adi/data.json?inst=316&count=2', 2);
fnGet_SDN_AlarmFlag('/adi/data.json?inst=402&count=2');
//fnGet_SCM_Redndcy(url_405_406); //22-Aug-22
fnGet_SCM_Redndcy(url_403_406); //26-Sep-22

setInterval(() => {
    $("#lbl300").html(mpA.get(300));
    $("#lbl301").html(dC2dF_A(mpA.get(301)));
    $("#lbl316").html(mpA.get(316));
    $("#lbl317").html(dC2dF_A(mpA.get(317)));
    $("#lblChk_P1_Alarm").html(mpA.get(402));
    $("#lblChk_P2_Alarm").html(mpA.get(403));
    $("#lbl405").html(mpA.get(405));
    $("#lbl406").html(mpA.get(406));
}, alarmRefreshInterval);


function UpdateCurrentPercent(ADI){
    //debugger;    
    var txtboxName = '#'+ ADI.toString();    
    var currValue = $(txtboxName).val();
    if(currValue == ""){
        alert("Please insert Current % value.");
        $(txtboxName).focus();
        return;
    }

    if(currValue >= Current_Min_Limit && currValue <= Current_Max_Limit){
        var popupMSG = null;
        if(ADI == 302)
            popupMSG = "Are you sure to update SDN1 Current %";
        else if(ADI == 318)
            popupMSG = "Are you sure to update SDN2 Current %";
        else if(ADI == 364)
            popupMSG = "Are you sure to update SCM Current %";

        if(popupMSG != null){
            if(confirm(popupMSG)){        
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
    else{
        var strMSG = "The input value is outside the range. The allowable range is " + Current_Min_Limit + " to " +  Current_Max_Limit + " percentage.";
        alert(strMSG);
        $(txtboxName).focus();
        return;
    }
}

async function GetData_400To406(url){
    await $.getJSON(
        url,
        (data, status, xhr) => {
            //debugger;
            return data;
        }
    ).then((result)=>{

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

async function fnGet_SCM_Redndcy(url) {
    await $.getJSON(url,
        (data, status, xhr) => {
            //debugger;
            return data;
        }
    ).then((result) => {
        
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
    if (inputVal == 'FF' || inputVal == '01' || inputVal == 'ff')
        retValue = "Enable";
    else
        retValue = "Disable";

    return retValue;
}

async function fnGet_SDNData(url, psNum) {
    //debugger;
    //var retVal = null;
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
            if (result[0] == 'ffff' || result[0] == 'FFFF')
                v1 = 'NaN';
            else {
                var _v1 = endianess.swaphex(result[0]);
                v1 = Number((parseInt(_v1, 16)) * 0.01).toFixed(2);
            }

            if (result[1] == 'ffff' || result[1] == 'FFFF')
                v2 = 'NaN';
            else {
                var _v2 = endianess.swaphex(result[1]);
                v2 = convertH2D_A(_v2) * Math.pow(10, -1);
            }

            if (psNum == 1) {
                sdn1_currtHigh = v1;
                sdn1_tempHigh = v2;
                //mp.set(element.instance, `${hex2a(inputData[idx])}`);
                mpA.set(300, v1);
                mpA.set(301, v2);
            }
            else {
                sdn2_currtHigh = v1;
                sdn2_tempHigh = v2;
                mpA.set(316, v1);
                mpA.set(317, v2);
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
    if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which != 45 || $(this).val().indexOf('-') != -1) &&
        ((event.which < 48 || event.which > 57) &&
            (event.which != 0 && event.which != 8))) {
        event.preventDefault();
    }

    var text = $(this).val();

    if ((text.indexOf('.') != -1) &&
        (text.substring(text.indexOf('.')).length > 1) && (text.indexOf('-') != -1) && (text.substring(text.indexOf('-')).length > 2) &&
        (event.which != 0 && event.which != 8) &&
        ($(this)[0].selectionStart >= text.length - 1)) {
        event.preventDefault();
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
        var hex = (Math.floor(tem * 100)).toString(16);
        var hex1 = hex.replace(/^(.(..)*)$/, "0$1").match(/../g).reverse().join("");
        if (hex1.length == 2)
            hex1 = hex1 + '00';
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
    if ($("#316").val() == '') {
        alert("Please insert SDN 2 Current High value.");
        $("#316").focus();
        return;
    }
    var tem = $("#316").val();
    var outofTreshhold = fnshowCurrentTresholdLimit(tem)
    if (outofTreshhold) {
        $("#316").focus();
        return;
    }
    var strPopUpMsg = 'Are you sure to update SDN 2 Current High?';
    if (confirm(strPopUpMsg)) {
        var hex = (Math.floor(tem * 100)).toString(16);
        var hex1 = hex.replace(/^(.(..)*)$/, "0$1").match(/../g).reverse().join("");
        if (hex1.length == 2)
            hex1 = hex1 + '00';
        $.post(`/adi/update.json?inst=316&value=${hex1}`, (data, status) => {
            //alert(JSON.stringify(data));
            if (data.result == 0) {
                alert("Value updated successfully.")
                $("#316").val("");

                fnGet_SDNData('/adi/data.json?inst=316&count=2', 2);
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
        inputVal = '01';
    }
    else {
        strPopUpMsg = 'Are you sure to disable SDN 1 alarm?';
        inputVal = '00';
    }

    if (confirm(strPopUpMsg)) {
        $.post(`/adi/update.json?inst=402&value=${inputVal}`, (data, status) => {
            //alert(JSON.stringify(data));
            //location.reload()
            if (data.result == 0) {
                alert("Value updated successfully.")
                fnGet_SDN_AlarmFlag('/adi/data.json?inst=402&count=2');
            }
            else
                alert("Error occurred while updating.")
        });
    }
}

function P2AlarmEnb() {
    //alert("p2");
    /* var chkVal = $('#chkbP2AlarmEnb').is(':checked');
    var strPopUpMsg = ''; // 
    var inputVal = '00';
    if(chkVal){
        strPopUpMsg = 'Are you sure to enable SDN 2 alarm?';
        inputVal = '01'
    }
    else{
        strPopUpMsg = 'Are you sure to disable SDN 2 alarm?';
        inputVal = '00'
    } */var selVal = $("#cbP2Alarm").val();

    if (selVal == '-1') {
        alert("SDN 2 Alarm Flag value is not selected. Please select it first.")
        $("#cbP2Alarm").focus();
        return;
    }
    else if (selVal == '01') {
        strPopUpMsg = 'Are you sure to enable SDN 2 alarm?';
        inputVal = '01';
    }
    else {
        strPopUpMsg = 'Are you sure to disable SDN 2 alarm?';
        inputVal = '00';
    }

    if (confirm(strPopUpMsg)) {
        $.post(`/adi/update.json?inst=403&value=${inputVal}`, (data, status) => {
            //alert(JSON.stringify(data));
            //location.reload()
            if (data.result == 0) {
                alert("Value updated successfully.")
                fnGet_SDN_AlarmFlag('/adi/data.json?inst=402&count=2');
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

function SCMEnableAlarm(){
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