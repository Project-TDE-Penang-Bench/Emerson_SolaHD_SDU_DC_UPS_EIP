if (objEventDataOperation != null)
    clearInterval(objEventDataOperation);
if(objSettingDataOperation != null)
    clearInterval(objSettingDataOperation);
if(objParaDataOperation != null)
    clearInterval(objParaDataOperation);
if(objMeasurementDataOperation != null)
    clearInterval(objMeasurementDataOperation);
if(objTimerDataOperation != null)
    clearInterval(objTimerDataOperation);
if(objAlarmParaDataOperation != null)
    clearInterval(objAlarmParaDataOperation);
if(objPCShutdownDataOperation != null)
    clearInterval(objPCShutdownDataOperation);



overviewRefreshRate = 5000; // 2 second
urlOverviewMeta = `adi/metadata2.json?offset=1&count=9`;
urlOverviewData = `adi/data.json?offset=1&count=9`;
var overViewMeta = [];

fetch(urlOverviewMeta).then(async (response) => {
    try {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let jsonOverviewMeta = await response.json();
        overViewMeta = jsonOverviewMeta;
        objOverviewDataOperation = setInterval(async () => {
            fnFillOverviewData();
            $('#spinnerOvrTemp').hide();
        }, overviewRefreshRate);
    } catch (error) {
        console.error('Error fetching data:', error);

    }
});

async function fnFetchOverviewData() {
    try {
        const response = await fetch(urlOverviewData);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let overviewData = await response.json();
        return overviewData;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

async function fnFillOverviewData() {
    let ovrData = await fnFetchOverviewData() || [];
    overViewMeta.forEach((item, idx) => {
        switch (item.instance) {
            case 2://Part Number                 
            case 4://Mfr. Name   
            case 5://Model Rev                  
                let dUINT8 = hexToAscii(ovrData[idx]);
                $(`#adi-${item.instance}`).html(dUINT8);
                break;
            case 3: //Serial No.            
                let valSWP = endianess.swaphex(ovrData[idx]);
                let val = parseInt(valSWP, 16);
                $(`#adi-${item.instance}`).html(val);
                break;
            case 6://Pri FW Rev
            case 7://Sec FW Rev
                let fwRev = Number(parseInt((endianess.swaphex(ovrData[idx])), 16));
                fwRev = fwRev.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
                $(`#adi-${item.instance}`).html(fwRev);
                break;
        }
    });
}