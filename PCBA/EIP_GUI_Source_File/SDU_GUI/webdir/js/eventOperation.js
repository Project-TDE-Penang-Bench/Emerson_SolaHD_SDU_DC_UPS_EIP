var eventInputJson = [];
var eventInputData = [];
var adiFrom = 500;
var adiTo = 64;
var urlEventMetadata = `/adi/metadata2.json?inst=${adiFrom}&count=${adiTo}`;
var urlEventData = `/adi/data.json?inst=${adiFrom}&count=${adiTo}`;
var eventRefreshInterval = 5000; // millisecond

$.getJSON(
    urlEventMetadata,
    (data) => {
        if (!data || typeof data !== 'object') {
            console.error('Invalid or empty JSON response:', data);
            return;
        }
        eventInputJson = data;
        eventInputJson.forEach((item, idx) => {
            var rowClass = 'row-' + (idx % 2 == 0 ? '2' : '1')
            $('#tbodyEvent').append(`<tr class=${rowClass}><td>${(item.elementname[0])}</td><td><label id="${(item.instance).toString() + '_ECode'}"></label></td><td><label id="${(item.instance).toString() + '_EStatus'}"></label></td><td><label id="${(item.instance).toString() + '_ETS'}"></label></td></tr>`)
        });

        return data;
    })
    .fail(function () {
        $('#headerSDUCnn').css({ display: 'block' });
    })
    .then((result) => {
        if (result && typeof result === 'object') {
            eventInputJson = result;
            objEventDataOperation = setInterval(async () => {
                await fnFillEventData();
                $('#spnLoadding').hide();
                $('#btnExcelEvent').show();
            }, eventRefreshInterval);

        } else {
            console.error('Invalid or empty JSON response:', result);
        }
    });

async function fnFetchEventData() {
    try {
        const response = await fetch(urlEventData);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        eventInputData = await response.json();
    } catch (error) {
        eventInputData = [];
        console.error('Error fetching data:', error);
    }
    return eventInputData;
}

async function fnFillEventData() {
    let eventData = await fnFetchEventData() || [];    
    eventInputJson.forEach((item, idx) => {        
        let eventCode = eventData[idx];        
        let eventName = fnGetEventCode(eventCode.substring(0, 4));
        $(`#${item.instance}_ECode`).html(eventName);

        let eventStatus = eventCode.substring(4, 8);
        let eventStatusValue = fnGetEventStartStop(eventStatus);
        $(`#${item.instance}_EStatus`).html(eventStatusValue);

        let eventTS = eventCode.substring(8, 16);
        let eventTimeStamp = fnGetEventTimestamp(eventTS);
        $(`#${item.instance}_ETS`).html(eventTimeStamp);
    });
}

function fnGetEventCode(entCode) {
    entVal = endianess.swaphex(entCode);
    var strEntCode;
    switch (entVal) {
        case "0001":
            strEntCode = 'UPS_DC_POWER_FAILURE';
            break;
        case "0002":
            strEntCode = 'UPS_BACKUP_MODE';
            break;
        case "0003":
            strEntCode = 'UPS_SWITCHED_OFF';
            break;
        case "0004":
            strEntCode = 'UPS_NO_BATTERY';
            break;
        case "0005":
            strEntCode = 'UPS_BATTERY_FAULT';
            break;
        case "0006":    
            strEntCode = 'UPS_POWERBOOST';
            break;
        case "0007":
            strEntCode = 'UPS_OVERCURRENT';
            break;
        case "0008":
            strEntCode = 'UPS_OVERTEMPERATURE';
            break;  
        case "0009":
            strEntCode = 'UPS_CHARGER_FAILURE';
            break;
        default:
            strEntCode = 'N/A';
    }
    return strEntCode;
}

function fnGetEventStartStop(eventStatus) {
    var eventStatusValue;
    if (eventStatus == "0100")
        eventStatusValue = "Start";
    else if (eventStatus == "0000")
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