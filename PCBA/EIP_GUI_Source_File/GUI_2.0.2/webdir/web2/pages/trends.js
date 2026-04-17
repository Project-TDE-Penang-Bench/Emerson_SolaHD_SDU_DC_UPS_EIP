var TrendsRefreshInterval = 3000;
var TrendsTempUnitRefreshInterval = 3000;
var url = '/adi/data.json?inst=628&count=3';
var configuredTempUnit = 'degC';
var tblTrnds = $("#tbltrnds");
//debugger;
fnGet_TrendsData(url);
fnGet_SCM_OnTime();
//fnGet_P1_OnTime();
//fnGet_P2_OnTime();
fnStart_TrendsTempUnitRefreshInterval();
fnStartTrendsRefresh();

function fnStartTrendsRefresh() {
    objTrendsRefresh = setInterval(() => {
        fnGet_TrendsData(url);
        fnGet_SCM_OnTime();
        //fnGet_P1_OnTime();
        //fnGet_P2_OnTime();
    }, TrendsRefreshInterval);
}
function fnStopTrendsRefresh() {
    if (objTrendsRefresh != null) {
        clearInterval(objTrendsRefresh);
    }
    objTrendsRefresh = null;
}

async function fnGet_TrendsData(_url) {
    await $.getJSON(
        _url,
        (data, status, xhr) => {
            //debugger;
            return data;
        }
    )
        .then((result) => {
            //console.log(`trend data => ${result}`);
            //result[0] = 'D9FF2500D9FF0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
            fnProcess_SCM_Trends_Data(result[0]);
            fnProcess_SCM_PS_Data(result[1], "ps1");
            fnProcess_SCM_PS_Data(result[2], "ps2");
        });
}

function fnProcess_SCM_Trends_Data(objSCMData) {
    let SCM_TRD_ARR = objSCMData.match(/.{1,4}/g);
    let trendArr = [];
    let SCM_hourly_temp = [];
    //console.log(`SCM_TRD_ARR => ${SCM_TRD_ARR}`)
    SCM_TRD_ARR.forEach((item, idx) => {
        //tblTrnds[0].rows[2].cells[idx + 1].innerHTML = ((Math.round(parseInt((endianess.swaphex(item)), 16))));

        let v2 = Math.round(convertH2D_Trnd((endianess.swaphex(item))));
        tblTrnds[0].rows[2].cells[idx + 1].innerHTML = v2;

        //tblTrnds[0].rows[2].cells[1].innerHTML
    });
}

function fnProcess_SCM_PS_Data(objPSData, instPS) {
    let PS_TRD_ARR = objPSData.match(/.{1,8}/g);
    let trendArr = [];
    let PS_hourly_Current = [];
    //console.log(`${instPS}_TRD_ARR => ${PS_TRD_ARR}`);
    let rno = (instPS == 'ps1' ? 4 : 6);
    PS_TRD_ARR.forEach((item, idx) => {
        trendArr.push((endianess.swaphex(item)));
        PS_hourly_Current.push(((hexToFloat32(endianess.swaphex(item))).toFixed(1)));

        tblTrnds[0].rows[rno].cells[idx + 1].innerHTML = ((hexToFloat32(endianess.swaphex(item))).toFixed(1));
    });
}

async function fnGet_SCM_OnTime() {
    await $.getJSON(
        '/adi/data.json?inst=9&count=1',
        (data, status, xhr) => {
            return data;
        }
    )
        .then((result) => {
            //let tmp = Math.round((Number(parseInt((endianess.swaphex(result[0])), 16))) / 3600);
            let tmp = Math.floor((Number(parseInt((endianess.swaphex(result[0])), 16))) / 3600);
            //$("#trnd_9").html(`SCM On Time- ${tmp} Hours`);
            let rmtime = ((Number(parseInt((endianess.swaphex(result[0])), 16))) % 3600);
            //NxtChkTimRem
            $("#trnd_9").html(`SCM On Time: ${tmp} Hours. <br/> Time Until Next Hourly Average Calculation: ${Math.round(60 - (rmtime / 60))} minutes.`);
            //$("#NxtChkTimRem").html(`Time Until Next Check- ${Math.round(60 - (rmtime/60))} mins`);
        });
}

async function fnGet_P1_OnTime() {
    await $.getJSON(
        '/adi/data.json?inst=115&count=1',
        (data, status, xhr) => {
            return data;
        }
    )
        .then((result) => {
            let tmp = Math.round((Number(parseInt((endianess.swaphex(result[0])), 16))) / 3600);
            $("#trnd_115").html(`PS#1 On Time- ${tmp} Hours`);
        });
}

async function fnGet_P2_OnTime() {
    await $.getJSON(
        '/adi/data.json?inst=215&count=1',
        (data, status, xhr) => {
            return data;
        }
    )
        .then((result) => {
            let tmp = Math.round((Number(parseInt((endianess.swaphex(result[0])), 16))) / 3600);
            $("#trnd_215").html(`PS#2 On Time- ${tmp} Hours`);
        });
}


async function fnGet_TrendsConfigTempUnit() {
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
                $("#lblSCMAvgTempLblWthUnit").html(`SCM Average Temperature(°C)`);
            }
            else {
                $("#lblSCMAvgTempLblWthUnit").html(`SCM Average Temperature(°F)`);
            }
        })
        .fail(() => { 
            $('#header_SCM_Cnn').css({ display: 'block' });
        });;
}

function fnStart_TrendsTempUnitRefreshInterval() {
    //objTrendsTempUnitRefresh = setInterval(fnGet_TrendsConfigTempUnit(), TrendsTempUnitRefreshInterval);
    objTrendsTempUnitRefresh = setInterval(async()=>{fnGet_TrendsConfigTempUnit();}, TrendsTempUnitRefreshInterval);
}

function fnStop_TrendsTempUnitRefreshInterval() {
    if (objTrendsTempUnitRefresh != null)
        clearInterval(objTrendsTempUnitRefresh);
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

function convertH2D_Trnd(hexVal) {
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