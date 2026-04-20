var Event_inputJSON;
var Event_inputData;
//var mp = new Map();
var Adi_From = 81
var Adi_To = (64+64);
var urlEventMetadata = `/adi/metadata2.json?offset=${Adi_From}&count=${Adi_To}`
var urlEventData = `/adi/data.json?offset=${Adi_From}&count=${Adi_To}`
var Event_RefreshInterval = 2000; // milisecond

//debugger;
$.getJSON(
    urlEventMetadata,
        (data, status, xhr) => {
            data.forEach((item, idx) => {
                var rowClass = 'row-' + (idx % 2 == 0 ? '2' : '1')
                if (item.instance <= 563)
                    $('#tbody_p1').append(`<tr class=${rowClass}><td>${item.name}</td><td><label id="${(item.instance).toString() + '_ECode'}"></label></td><td><label id="${(item.instance).toString() + '_EStatus'}"></label></td><td><label id="${(item.instance).toString() + '_ETS'}"></label></td></tr>`)
                else
                    $('#tbody_p2').append(`<tr class=${rowClass}><td>${item.name}</td><td><label id="${(item.instance).toString() + '_ECode'}"></label></td><td><label id="${(item.instance).toString() + '_EStatus'}"></label></td><td><label id="${(item.instance).toString() + '_ETS'}"></label></td></tr>`)

            });
            return data;
        }
    )   
    .fail(function () {
        //debugger;
        $('#header_SCM_Cnn').css({ display: 'block'});    
        fnEmptyEventData();
    })
    .then((result) => {
        Event_inputJSON = result;
        //debugger;
        objEventDataOperation_1 = setInterval(async () => {
            await $.getJSON(urlEventData, (data, status, xhr) => {
                return data;
            }).then((result) => {
                //debugger;
                Event_inputData = result;
                var idxEvent = 500;
                result.forEach((eventValue, idx) => {
                    fnProcessEventInput(idxEvent, eventValue)
                    idxEvent += 1;
                });
            })
            .then(()=>{
                //debugger;
                $('#btn_excel_p1').show();
                $('#btn_excel_p2').show();
                $('#spnLoadding').hide();
                $('#header_SCM_Cnn').css({ display: 'none' });
            })
                .fail(function () {
                    //alert("error"); 
                    //debugger;
                    $('#header_SCM_Cnn').css({ display: 'block' });
                    fnEmptyEventData();
                });

        }, Event_RefreshInterval);
    });

function fnEmptyEventData(){
    var rowCount_p1 = $('#eventN-table-p1 >tbody >tr');
    var rowCount_p2 = $('#eventN-table-p2 >tbody >tr');
    $(rowCount_p1).each((idx,val) => {
        var tds = $(val).find('td')
        tds[1].firstChild.innerHTML = '';
        tds[2].firstChild.innerHTML = '';
        tds[3].firstChild.innerHTML = '';
    });

    $(rowCount_p2).each((idx,val) => {
        var tds = $(val).find('td')
        tds[1].firstChild.innerHTML = '';
        tds[2].firstChild.innerHTML = '';
        tds[3].firstChild.innerHTML = '';
    });
}

function fnStopEventRefresh() {
    if (objEventDataOperation_1 != null) {
        clearInterval(objEventDataOperation_1);
    }
}

function fnProcessEventInput(eventNum, inputEventString) {
    //console.log(`eventNum => ${eventNum}`);
    //console.log(`inputEventString => ${inputEventString}   ${inputEventString.substring(0, 2)}  ${inputEventString.substring(2, 4)}  ${inputEventString.substring(4)}`);
    // if(eventNum == 564)
    //     var tm = 'bbb';

    if (inputEventString.substring(0, 2) == 'FF' || inputEventString.substring(0, 2) == 'ff' || inputEventString.substring(0, 2) == "00") {
        //var tm = "ABCD";
        $('#' + eventNum + '_ECode').html('&nbsp;');
        $('#' + eventNum + '_EStatus').html('&nbsp;');
        $('#' + eventNum + '_ETS').html('&nbsp;');
    }
    else {
        var Evnt_Code = fnGetEventCode(inputEventString.substring(0, 2));
        $('#' + eventNum + '_ECode').html(Evnt_Code);

        var Evnt_Status = fnGetEventStartStop(inputEventString.substring(2, 4))
        $('#' + eventNum + '_EStatus').html(Evnt_Status);

        var Evnt_TS = fnGetEventTimestamp(inputEventString.substring(4))
        $('#' + eventNum + '_ETS').html(Evnt_TS);
    }
}

function fnGetEventCode(entCode) {
    var strEntCode;
    switch (entCode) {
        case "08":
        case "8":
            strEntCode = "Short Circuit Protection";
            break;
        case "09":
        case "9":
            strEntCode = "Under Voltage Protection";
            break;
        case "0A":
        case "A":
            strEntCode = "Over Voltage Protection";
            break;
        case "B":
        case "b":
        case "0B":
        case "0b":
            strEntCode = "Power Boost"; //
            break;
        case "F":
        case "f":
        case "0F":
        case "0f":
            strEntCode = "Over Temperature Protection";
            break;
        case "FF":
        case "ff":
            strEntCode = "N/A";
            break;
        default:
            strEntCode = "N/A";
    }
    return strEntCode;

}

function fnGetEventStartStop(eventStatus) {
    var eventStatusValue;
    if (eventStatus == "01" || eventStatus == "1")
        eventStatusValue = "Start";
    else if (eventStatus == "00" || eventStatus == "0")
        eventStatusValue = "End";
    else
        eventStatusValue = "";

    return eventStatusValue;
}

function fnGetEventTimestamp(entTS) {
    var entTS_endianess = endianess.swaphex(entTS)
    var EventTimeStamp = ((Number(parseInt(entTS_endianess, 16))) / 3600).toFixed(2);
    if (EventTimeStamp <= 0.0)
        EventTimeStamp = "";

    return EventTimeStamp;
}