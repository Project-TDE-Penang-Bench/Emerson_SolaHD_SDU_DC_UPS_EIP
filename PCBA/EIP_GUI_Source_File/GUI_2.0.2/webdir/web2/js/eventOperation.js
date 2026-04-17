var Event_inputJSON;
var Event_inputData;
//var mp = new Map();
var Adi_From = 99; // 81
var Adi_To = (64 + 64);
var urlEventMetadata = `/adi/metadata2.json?offset=${Adi_From}&count=${Adi_To}`
var urlEventData = `/adi/data.json?offset=${Adi_From}&count=${Adi_To}`
var Event_RefreshInterval = 5000; // milisecond

//debugger;
$.getJSON(
    urlEventMetadata,
    (data, status, xhr) => {
        data.forEach((item, idx) => {
            var rowClass = 'row-' + (idx % 2 == 0 ? '2' : '1')
            if (item.instance <= 563)
                $('#tbody_p1').append(`<tr class=${rowClass}><td>${(item.name).replace('P1','PS#1')}</td><td><label id="${(item.instance).toString() + '_ECode'}"></label></td><td><label id="${(item.instance).toString() + '_EStatus'}"></label></td><td><label id="${(item.instance).toString() + '_ETS'}"></label></td></tr>`)
            else
                $('#tbody_p2').append(`<tr class=${rowClass}><td>${(item.name).replace('P2','PS#2')}</td><td><label id="${(item.instance).toString() + '_ECode'}"></label></td><td><label id="${(item.instance).toString() + '_EStatus'}"></label></td><td><label id="${(item.instance).toString() + '_ETS'}"></label></td></tr>`)

        });
        return data;
    }
)
    .fail(function () {
        //debugger;
        $('#header_SCM_Cnn').css({ display: 'block' });
        fnEmptyEventData();
    })
    .then((result) => {
        Event_inputJSON = result;
        //debugger;
        objEventDataOperation = setInterval(async () => {
            await $.getJSON(urlEventData, (data, status, xhr) => {
                return data;d
            }).then((result) => {
                //debugger;
                Event_inputData = result;
                var idxEvent = 500;
                result.forEach((eventValue, idx) => {
                    fnProcessEventInput(idxEvent, eventValue)
                    idxEvent += 1;
                });
            })
                .then(() => {
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

function fnEmptyEventData() {
    var rowCount_p1 = $('#eventN-table-p1 >tbody >tr');
    var rowCount_p2 = $('#eventN-table-p2 >tbody >tr');
    $(rowCount_p1).each((idx, val) => {
        var tds = $(val).find('td')
        tds[1].firstChild.innerHTML = '';
        tds[2].firstChild.innerHTML = '';
        tds[3].firstChild.innerHTML = '';
    });

    $(rowCount_p2).each((idx, val) => {
        var tds = $(val).find('td')
        tds[1].firstChild.innerHTML = '';
        tds[2].firstChild.innerHTML = '';
        tds[3].firstChild.innerHTML = '';
    });
}

function fnStopEventRefresh() {
    if (objEventDataOperation != null) {
        clearInterval(objEventDataOperation);
    }
}

function fnProcessEventInput(eventNum, inputEventString) {  
    if (inputEventString.substring(0, 4) == 'FFFF' || inputEventString.substring(0, 4) == 'ffff' || inputEventString.substring(0, 4) == "0000") {
        //var tm = "ABCD";
        $('#' + eventNum + '_ECode').html('&nbsp;');
        $('#' + eventNum + '_EStatus').html('&nbsp;');
        $('#' + eventNum + '_ETS').html('&nbsp;');
    }
    else {
        var Evnt_Code = fnGetEventCode(inputEventString.substring(0, 4));
        $('#' + eventNum + '_ECode').html(Evnt_Code);

        if (Evnt_Code != "") {
            var Evnt_Status = fnGetEventStartStop(inputEventString.substring(4, 8))
            $('#' + eventNum + '_EStatus').html(Evnt_Status);
        }

        var Evnt_TS = fnGetEventTimestamp(inputEventString.substring(8))
        $('#' + eventNum + '_ETS').html(Evnt_TS);
    }
}

function fnGetEventCode(entCode) {
    var strEntCode;
    switch (entCode) {
        case "0800":
        case "800":
            strEntCode = "Short Circuit Protection";
            break;
        case "0900":
        case "900":
            strEntCode = "Under Voltage Protection";
            break;
        case "0A00":
        case "A00":
            strEntCode = "Over Voltage Protection";
            break;
        case "B00":
        case "b00":
        case "0B00":
        case "0b00":
            strEntCode = "Power Boost"; //
            break;
        case "F00":
        case "f00":
        case "0F00":
        case "0f00":
            strEntCode = "Over Temperature Protection";
            break;
        case "FFFF":
        case "ffff":
            strEntCode = "";
            break;
        default:
            strEntCode = "";
    }
    return strEntCode;

}

function fnGetEventStartStop(eventStatus) {
    var eventStatusValue;
    if (eventStatus == "0100" || eventStatus == "100")
        eventStatusValue = "Start";
    else if (eventStatus == "0000" || eventStatus == "0")
        eventStatusValue = "End";
    else
        eventStatusValue = "";

    return eventStatusValue;
}

function fnGetEventTimestamp(entTS) {
    if (entTS == 'FFFFFFFF' || entTS == 'ffffffff')
        return "";
    var entTS_endianess = endianess.swaphex(entTS)
    var EventTimeStamp = ((Number(parseInt(entTS_endianess, 16))) / 3600).toFixed(2);
    if (EventTimeStamp <= 0.0)
        EventTimeStamp = "";

    return Math.floor(EventTimeStamp);
}