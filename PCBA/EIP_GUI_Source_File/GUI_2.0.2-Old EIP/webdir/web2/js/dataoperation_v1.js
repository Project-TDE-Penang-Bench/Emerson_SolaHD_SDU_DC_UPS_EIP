//dataoperation_v1.js
var inputJSON;
var inputData;
var adiMp = new Map();
var AdiCount = 99;
var urlMetadata = `/adi/metadata2.json?offset=0&count=${AdiCount}`
var urlData = `/adi/data.json?offset=0&count=${AdiCount}`
var refreshInterval = 2000; // milisecond
//debugger

//Check MBus or EIP
fnChkModBus();

$.getJSON(
    urlMetadata,
    (data, status, xhr) => {
        return data;
    }
)
    .fail(function () {
        //debugger;
        $('#header_SCM_Cnn').css({ display: 'block' });
    })
    .then((result) => {
        inputJSON = result;
        //objDataOperationRefresh = setInterval(() => { fnFetchParaData(); }, refreshInterval);
        //fnFetchParaData();
    })

async function fnFetchParaData() {
    //console.log('1234');    
    await $.getJSON(urlData,
        (data, status, xhr) => {
            $('#header_SCM_Cnn').css({ display: 'none' });
            return data;
        }
    )
        .then((result) => {
            inputData = result;
            // console.log(`Received hex data at => ${new Date()}`);
            inputJSON.forEach((item, idx) => {
                //console.log(`instance => ${item.instance}`);
                //console.log(`datatype => ${item.datatype}`);
                let tmp = null;
                switch (item.instance) {
                    case 1: //SCM|Part Number Size = 16
                    case 4: //SCM|Mfr. Name Size = 16
                        tmp = UINT8_To_ASCII(inputData[idx]);
                        adiMp.set(item.instance, tmp)
                        // console.log(`${item.name} (${item.instance}) => HEX ${inputData[idx]}  ASC :: ${tmp}`)
                        tmp = null;
                        break;
                    case 2: //SCM|Serial No. Size = 4
                    case 3: //SCM|Mfg. Info Size = 4
                        tmp = UINT32_To_ASCII(inputData[idx]);
                        adiMp.set(item.instance, tmp)
                        // console.log(`${item.name} (${item.instance}) => HEX ${inputData[idx]}  ASC :: ${tmp}`)
                        tmp = null;
                        break;
                    case 5: //SCM|Model Rev Size = 2
                        tmp = UINT8_To_ASCII(inputData[idx]);
                        adiMp.set(item.instance, tmp)
                        // console.log(`${item.name} (${item.instance}) => HEX ${inputData[idx]}  ASC :: ${tmp}`)
                        tmp = null;
                        break;
                    case 8: //SCM|Status LED
                        var inputVal = changeEndianness_v1(inputData[idx]);
                        var binVal = hex2bin(inputVal);
                        var binArray = binVal.split("");
                        //binArray = ['1', '1', '0', '1', '0', '0', '0', '1'];
                        var retVal = "";
                        //console.log(`SCM|Status HEX (${new Date()}) => ${inputData[idx]}`);
                        //console.log(`SCM|Status LED => ${binArray}`);
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
                        //console.log(`retVal => ${retVal}`)
                        adiMp.set(item.instance, retVal);
                        break;
                    case 10: //SCM|Temperature Size = 2
                    case 112://P1|Temperature
                    case 212://P2|Temperature
                    case 127: //P1|Max Temp 
                    case 227: //P2|Max Temp
                        tmp = Math.round(convertH2D((endianess.swaphex(inputData[idx]))));
                        adiMp.set(item.instance, tmp);
                        // console.log(`${item.name} (${item.instance})=> HEX ${inputData[idx]}  ASC :: ${tmp}`)
                        tmp = null;
                        break;
                    case 100://P1|Device Model
                        break;
                    case 101: //P1|Part Number
                    case 201: //P2|Part Number
                        tmp = UINT8_To_ASCII(inputData[idx]);
                        adiMp.set(item.instance, tmp)
                        // console.log(`${item.name} (${item.instance}) => HEX ${inputData[idx]}  ASC :: ${tmp}`)
                        tmp = null;
                        //adiMp.set(item.instance, UINT8_To_ASCII(inputData[idx]))
                        //console.log(`SDN 1| Product Name  => ${UINT8_To_ASCII(inputData[idx])}`)
                        break;
                    case 102: //P1|Serial Number                    
                    case 202: //P2|Serial Number
                        tmp = UINT8_To_ASCII(inputData[idx]);
                        adiMp.set(item.instance, tmp)
                        // console.log(`${item.name} (${item.instance}) => HEX ${inputData[idx]}  ASC :: ${tmp}`)
                        tmp = null;
                        break;
                    case 103: //P1|Mfg. Info
                    case 203: //P2|Mfg. Info
                        tmp = UINT8_To_ASCII(inputData[idx]);
                        adiMp.set(item.instance, tmp)
                        // console.log(`${item.name} (${item.instance}) => HEX ${inputData[idx]}  ASC :: ${tmp}`)
                        tmp = null;
                        //adiMp.set(item.instance, UINT8_To_ASCII(inputData[idx]))
                        //console.log(`P1|Mfg. Info  => ${UINT8_To_ASCII(inputData[idx])}`)
                        break;
                    case 104: //P1|Mfr. Name
                    case 204: //P2|Mfr. Name
                        tmp = UINT8_To_ASCII(inputData[idx]);
                        adiMp.set(item.instance, tmp)
                        // console.log(`${item.name} (${item.instance}) => HEX ${inputData[idx]}  ASC :: ${tmp}`)
                        tmp = null;
                        //adiMp.set(item.instance, UINT8_To_ASCII(inputData[idx]))
                        //console.log(`P1|Mfr. Name  => ${UINT8_To_ASCII(inputData[idx])}`)
                        break;
                    case 105: //P1|ID 
                        break;
                    case 106: //P1|Model Rev
                    case 206: //P2|Model Rev
                        tmp = UINT8_To_ASCII(inputData[idx]);
                        adiMp.set(item.instance, tmp)
                        // console.log(`${item.name} (${item.instance}) => HEX ${inputData[idx]}  ASC :: ${tmp}`)
                        tmp = null;
                        //adiMp.set(item.instance, UINT8_To_ASCII(inputData[idx]))
                        //console.log(`P1|Model Rev  => ${UINT8_To_ASCII(inputData[idx])}`)
                        break;
                    case 6:   //SCM|Primary FW Rev     Size = 2                   
                    case 7:   //SCM|Secondary FW Rev  Size = 2
                    case 107: //P1|Primary Rev
                    case 207: //P2|Primary Rev
                    case 108: //P1|Secondary Rev
                    case 208: //P2|Secondary Rev
                        //inputData[idx] = "";
                        tmp = Number(parseInt((changeEndianness_v1(inputData[idx])), 16));
                        tmp = tmp.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
                        adiMp.set(item.instance, tmp);
                        // console.log(`${item.name} (${item.instance})=> HEX ${inputData[idx]}  ASC :: ${tmp}`)
                        tmp = null;
                        break;
                    case 109: //P1|Vout
                    case 110: //P1|Iout
                    case 209: //P2|Vout
                    case 210: //P2|Iout
                    case 124: //P1|Max Vout 
                    case 224: //P2|Max Vout
                        //inputData[idx] = "32342E34";
                        //var v1 = parseFloat(hex2a(inputData[idx]));
                        //var v2 = parseFloat(hex2a(changeEndianness_v1(inputData[idx])));
                        tmp = (hexToFloat32(changeEndianness_v1(inputData[idx]))).toFixed(1);
                        //tmp = Number(parseInt((changeEndianness_v1(inputData[idx])), 16));
                        adiMp.set(item.instance, tmp);
                        // console.log(`${item.name} (${item.instance})=> HEX ${inputData[idx]}  ASC :: ${tmp}`)
                        tmp = null;
                        //retValue = Number((parseInt(_paramHexVal, 16)) * 0.1).toFixed(1);
                        break;
                    case 111://P1|Vin
                    case 211: //P2|Vin
                        //inputData[idx] = "dc00";
                        tmp = Number(parseInt((changeEndianness_v1(inputData[idx])), 16));
                        adiMp.set(item.instance, tmp);
                        // console.log(`${item.name} (${item.instance})=> HEX ${inputData[idx]}  ASC :: ${tmp}`)
                        tmp = null;
                        break;
                    case 113: //P1|LED Status
                    case 213: //P2|LED Status      
                        tmp = GetPowerSupplyLEDStatus(inputData[idx]);
                        adiMp.set(item.instance, tmp);
                        //console.log(`${item.name} (${item.instance})=> HEX ${inputData[idx]}  ASC :: ${tmp}`)    
                        tmp = null;
                        //adiMp.set(item.instance, GetPowerSupplyLEDStatus(inputData[idx]));
                        break;
                    case 114: //P1|Event Flags
                    case 214: //P2|Event Flags      
                        //tmp = SetPSUEventFlag(inputData[idx]);     
                        let va1 = changeEndianness_v1(inputData[idx]);
                        let ba1 = hex2bin(va1);
                        let ar = ba1.split("");
                        let curr_aid = item.instance;
                        //console.log(`ba1 ${item.name} => ${ba1}`);
                        //tmp = SetPSUEventFlag(changeEndianness_v1(inputData[idx]));
                        //let txtlbl = '';
                        //let txtval = '';
                        adiMp.set((`lbl_${item.instance}_OTP`), "");
                        adiMp.set((`lbl_${item.instance}_PowerBoost`), "");
                        adiMp.set((`lbl_${item.instance}_OVP`), "");
                        adiMp.set((`lbl_${item.instance}_SCP`), "");
                        //ar = ['0', '1', '0', '1', '1', '0', '1', '0'];
                        ar.forEach((item, indx) => {
                            //console.log(`[${idx}] => ${item}`);
                            //console.log(`PS Event Case for Adi 1 => ${item.instance}`);
                            //console.log(`PS Event Case for Adi 2 => ${curr_aid}`);
                            if (item == 1) {
                                let txtval = null;
                                let txtlbl = null;
                                switch (indx) {
                                    case 0:
                                        //retVal += "<span>Power Down</span><br/>";
                                        break;
                                    case 1:
                                        //retVal += "<span>OTP</span><br/>";
                                        txtlbl = `lbl_${curr_aid}_OTP`;
                                        txtval = '<span style="color:red">Active</span>';
                                        break;
                                    case 2:
                                        //retVal += "";
                                        break;
                                    case 3:
                                        //retVal += "<span>Power Boost</span><br/>";
                                        txtlbl = `lbl_${curr_aid}_PowerBoost`;
                                        txtval = '<span style="color:red">Active</span>';
                                        break;
                                    case 4:
                                        //retVal += "<span>OVP</span><br/>";
                                        txtlbl = `lbl_${curr_aid}_OVP`;
                                        txtval = '<span style="color:red">Active</span>';
                                        break;
                                    case 5:
                                        //retVal += "";
                                        break;
                                    case 6:
                                        //retVal += "<span>SCP</span><br/>";
                                        txtlbl = `lbl_${curr_aid}_SCP`;
                                        txtval = '<span style="color:red">Active</span>';
                                        break;
                                    case 7:
                                        //retVal += "<span>OCP</span><br/>";
                                        break;
                                    default:
                                        retVal = "";
                                }

                                txtval != null ? adiMp.set(txtlbl, txtval) : null;
                                //adiMp.set(txtlbl, txtval);
                            }

                        });


                        //adiMp.set(item.instance, tmp);
                        // console.log(`${item.name} (${item.instance})=> HEX ${inputData[idx]}  ASC :: ${tmp}`)    
                        tmp = null;
                        //adiMp.set(item.instance, SetPSUEventFlag(inputData[idx]));
                        break;
                    case 9: //SCM|Time On Now
                    case 115: //P1|Time On Now
                    case 215: //P2|Time On Now
                    case 116: //P1|Lifetime On
                    case 216: //P2|Lifetime On
                    case 128: //P1|Max Vout TS 
                    case 228: //P2|Max Vout TS
                    case 129: //P1|Max Iout TS 
                    case 229: //P2|Max Iout TS
                    case 130: //P1|Max Vin TS 
                    case 230: //P2|Max Vin TS
                    case 131: //P1|Max Temp TS 
                    case 231: //P1|Max Temp TS
                        //tmp = ((Number(parseInt((changeEndianness_v1(inputData[idx])), 16))) / 3600).toFixed(2);
                        tmp = Math.round((Number(parseInt((changeEndianness_v1(inputData[idx])), 16))) / 3600);
                        adiMp.set(item.instance, tmp);
                        // console.log(`${item.name} (${item.instance})=> HEX ${inputData[idx]}  ASC :: ${tmp}`)    
                        tmp = null;
                        // retValue = ((Number(parseInt(_paramHexVal, 16))) / 3600).toFixed(2);
                        // if (retValue <= 0.0)
                        // retValue = "";
                        break;
                    // case 116: //P1|Lifetime On
                    // case 216: //P2|Lifetime On
                    //     break;
                    case 117: //P1|Vin Type
                    case 217: //P2|Vin Type  
                        if (inputData[idx] == 'FF00' || inputData[idx] == '0100' || inputData[idx] == 'ff00')
                            tmp = "AC";
                        else
                            tmp = "DC";

                        adiMp.set(item.instance, tmp);
                        // console.log(`${item.name} (${item.instance})=> HEX ${inputData[idx]}  ASC :: ${tmp}`)    
                        tmp = null;
                        break;
                    case 118: //P1|Count DC On 
                    case 218: //P2|Count DC On
                        tmp = Number(parseInt((changeEndianness_v1(inputData[idx])), 16));
                        adiMp.set(item.instance, tmp);
                        // console.log(`${item.name} (${item.instance})=> HEX ${inputData[idx]}  ASC :: ${tmp}`)    
                        tmp = null;
                        break;
                    case 119: //P1|Count SCP
                    case 219: //P2|Count SCP 
                        //inputData[idx] = "de01";
                        tmp = Number(parseInt((changeEndianness_v1(inputData[idx])), 16));
                        adiMp.set(item.instance, tmp);
                        // console.log(`${item.name} (${item.instance})=> HEX ${inputData[idx]}  ASC :: ${tmp}`)    
                        tmp = null;
                        break;
                    case 120: //P1|Count OVP 
                    case 220: //P2|Count OVP
                        tmp = Number(parseInt((changeEndianness_v1(inputData[idx])), 16));
                        adiMp.set(item.instance, tmp);
                        // console.log(`${item.name} (${item.instance})=> HEX ${inputData[idx]}  ASC :: ${tmp}`)    
                        tmp = null;
                        break;
                    case 121: //P1|Count Pboost
                    case 221: //P2|Count Pboost 
                        tmp = Number(parseInt((changeEndianness_v1(inputData[idx])), 16));
                        adiMp.set(item.instance, tmp);
                        // console.log(`${item.name} (${item.instance})=> HEX ${inputData[idx]}  ASC :: ${tmp}`)    
                        tmp = null;
                        break;
                    case 122: //P1|Count PowerIn 
                    case 222: //P1|Count PowerIn
                        tmp = Number(parseInt((changeEndianness_v1(inputData[idx])), 16));
                        adiMp.set(item.instance, tmp);
                        // console.log(`${item.name} (${item.instance})=> HEX ${inputData[idx]}  ASC :: ${tmp}`)    
                        tmp = null;
                        break;
                    case 123: //P1|Count OTP
                    case 223: //P2|Count OTP 
                    case 126: //P1|Max Vin
                    case 126: //P1|Max Vin 
                    case 126: //P1|Max Vin
                    case 226: //P1|Max Vin 
                        tmp = Number(parseInt((changeEndianness_v1(inputData[idx])), 16));
                        adiMp.set(item.instance, tmp);
                        // console.log(`${item.name} (${item.instance})=> HEX ${inputData[idx]}  ASC :: ${tmp}`)    
                        tmp = null;
                        break;
                    // case 124: //P1|Max Vout 
                    // case 224: //P2|Max Vout
                    //     break;
                    case 125: //P1|Max Iout
                    case 225: //P2|Max Iout 
                        tmp = (hexToFloat32(changeEndianness_v1(inputData[idx]))).toFixed(1);
                        adiMp.set(item.instance, tmp);
                        // console.log(`${item.name} (${item.instance})=> HEX ${inputData[idx]}  ASC :: ${tmp}`)
                        tmp = null;
                        break;

                    case 200: //P2|Device Model
                        break;
                    case 205: //P2|ID 
                        break;
                    // case 212: //P2|Temperature
                    //     break;

                    case 300://P1|Current High
                    case 332://P2|Current High
                        break;
                    case 301://P1|Temp High
                    case 333://P2|Temp High
                        break;
                    case 302://P1|Vin High
                    case 334://P2|Vin High
                        break;
                    case 303://P1|Vin Low
                    case 335://P2|Vin Low
                        break;
                    case 304://P1|AvgIoutLimit
                    case 336://P2|AvgIoutLimit
                        break;
                    case 305://P1|AvgTempLimit
                    case 337://P2|AvgTempLimit
                        break;

                    case 400: //P1|Alarm Flag
                    case 401: //P2|Alarm Flag
                        let alcurr_aid = item.instance;
                        var inputVal = changeEndianness_v1(inputData[idx]);
                        //var binVal = hex2bin(inputVal);
                        var binVal = ("00000000" + (parseInt(inputVal, 16)).toString(2)).slice(-8);
                        var binArray = binVal.split("");
                        binArray = binArray.reverse();
                        var retVal = "";
                        adiMp.set((`lbl_${item.instance}_InputVoltageHi`), "");
                        adiMp.set((`lbl_${item.instance}_InputVoltageLow`), "");
                        adiMp.set((`lbl_${item.instance}_OutputCurrentHi`), "");
                        adiMp.set((`lbl_${item.instance}_InternalTempHigh`), "");
                        adiMp.set((`lbl_${item.instance}_AvgCurrentHi`), "");

                        binArray.forEach((item, idx) => {
                            let txtval = null;
                            let txtlbl = null;
                            if (item == 1) {
                                switch (idx) {
                                    case 0:
                                        //retVal += '<span>High Input Voltage</span><br/>';
                                        txtlbl = `lbl_${alcurr_aid}_InputVoltageHi`;
                                        txtval = '<span style="color:red">Active</span>';
                                        break;
                                    case 1:
                                        //retVal += '<span>Low Input Voltage</span><br/>';
                                        txtlbl = `lbl_${alcurr_aid}_InputVoltageLow`;
                                        txtval = '<span style="color:red">Active</span>';
                                        break;
                                    case 2:
                                        //retVal += '<span style="color:red">High Current!!!</span><br/>';
                                        txtlbl = `lbl_${alcurr_aid}_OutputCurrentHi`;
                                        txtval = '<span style="color:red">Active</span>';
                                        break;
                                    case 3:
                                        retVal += '<span style="color:red">PSU High Temperature!!!</span><br/>';
                                        txtlbl = `lbl_${alcurr_aid}_InternalTempHigh`;
                                        txtval = '<span style="color:red">Active</span>';
                                        break;
                                    case 4:
                                        //retVal += '<span>Avg Current High</span><br/>';
                                        txtlbl = `lbl_${alcurr_aid}_AvgCurrentHi`;
                                        txtval = '<span style="color:red">Active</span>';
                                        break;
                                    case 5:
                                        //retVal += '<span>Avg Temp High</span><br/>';
                                        break;
                                    case 6:
                                        //retVal = "";
                                        break;
                                    case 7:
                                        //retVal = "";
                                        break;
                                    default:
                                        retVal = "";
                                }
                                txtval != null ? adiMp.set(txtlbl, txtval) : null;
                            }
                        });
                        //adiMp.set(item.instance, retVal);
                        break;

                    case 402: //P1| Enable Alarm
                    case 403: //P2| Enable Alarm
                        break;
                    case 404: //SCM|Alarm Flag
                        let scm_curr_aid = item.instance;
                        var inputVal = changeEndianness_v1(inputData[idx]);
                        //var binVal = hex2bin(inputVal);
                        var binVal = ("00000000" + (parseInt(inputVal, 16)).toString(2)).slice(-8);
                        var binArray = binVal.split("");
                        binArray = binArray.reverse();
                        var retVal = "";
                        adiMp.set((`lbl_${item.instance}_SCM_HiAmbTemp`), "");
                        adiMp.set((`lbl_${item.instance}_SCM_AvgAmbTempHi`), "");
                        //binArray = ["1","0","0","0","0","0","0"]   

                        binArray.forEach((item, idx) => {
                            let txtval = null;
                            let txtlbl = null;
                            if (item == 1) {
                                switch (idx) {
                                    case 0:
                                        //retVal += '<span style="color:red">High Ambient Temp</span><br/>';
                                        txtlbl = `lbl_${scm_curr_aid}_SCM_HiAmbTemp`;
                                        txtval = '<span style="color:red">Active</span>';
                                        break;
                                    case 1:
                                        //retVal += '<span>Avg Ambient Temp High</span><br/>';
                                        txtlbl = `lbl_${scm_curr_aid}_SCM_AvgAmbTempHi`;
                                        txtval = '<span style="color:red">Active</span>';
                                        break;
                                    case 2:
                                        //retVal += '';
                                        break;
                                    case 3:
                                        //retVal += '';
                                        break;
                                    case 4:
                                        //retVal += '';
                                        break;
                                    case 5:
                                        //retVal += '';
                                        break;
                                    case 6:
                                        //retVal = "";
                                        break;
                                    case 7:
                                        //retVal = "";
                                        break;
                                    default:
                                        retVal = "";
                                }
                                txtval != null ? adiMp.set(txtlbl, txtval) : null;

                            }
                        });
                        //adiMp.set(item.instance, retVal);
                        break;
                    case 405: //SCM|Enable Alarm
                        break;
                    case 406: //RED|Alarm Flag
                        let redAlarmflagAdi = item.instance;
                        var inputVal = changeEndianness_v1(inputData[idx]);
                        //var binVal = hex2bin(inputVal);
                        var binVal = ("00000000" + (parseInt(inputVal, 16)).toString(2)).slice(-8);
                        var binArray = binVal.split("");
                        binArray = binArray.reverse();

                        adiMp.set((`lbl_${redAlarmflagAdi}_LoadSharingAlarm`), "");
                        adiMp.set((`lbl_${redAlarmflagAdi}_LossOfRed`), "");

                        //var binArray = binVal.split("");
                        //binArray = ["1","1","0","0","0","0","0"]   
                        binArray.forEach((item, idx) => {
                            let txtval = null;
                            let txtlbl = null;
                            if (item == 1) {
                                switch (idx) {
                                    case 0:
                                        txtlbl = `lbl_${redAlarmflagAdi}_LoadSharingAlarm`;
                                        txtval = '<span style="color:red">Active</span>';
                                        break;
                                    case 1:
                                        txtlbl = `lbl_${redAlarmflagAdi}_LossOfRed`;
                                        txtval = '<span style="color:red">Active</span>';
                                        break;
                                    case 2:
                                        break;
                                    case 3:
                                        break;
                                    case 4:
                                        break;
                                    case 5:
                                        break;
                                    case 6:
                                        break;
                                    case 7:
                                        break;
                                    default:
                                        retVal = "";
                                }
                                txtval != null ? adiMp.set(txtlbl, txtval) : null;
                            }
                        });
                        

                        break;
                    case 407: //RED|Enable Alarm
                        break;
                    case 408: //P1|Stress Level
                    case 409: //P2|Stress Level
                        //inputData[idx] = "0200"
                        if (inputData[idx] == "0000")
                            adiMp.set(item.instance, '<span>Normal</span>');
                        else if (inputData[idx] == "0100")
                            adiMp.set(item.instance, '<span style="background-color:yellow">Medium</span>');
                        else if (inputData[idx] == "0200")
                            adiMp.set(item.instance, '<span style="color:red">High</span>');
                        else
                            adiMp.set(item.instance, "");
                        break;
                    case 410: //P1|DC OK
                    case 411: //P2|DC OK
                        if (inputData[idx] == "0000")
                            adiMp.set(item.instance, '<span>DC OK</span>');
                        else if (inputData[idx] == "0100")
                            adiMp.set(item.instance, '<span style="color:red">DC NOT OK</span>');
                        else
                            adiMp.set(item.instance, "");
                        break;
                    case 412: //Temperature Unit
                        if (inputData[idx] == "0000")
                            adiMp.set(item.instance, '<span>&#8451</span>');
                        else if (inputData[idx] == "0100")
                            adiMp.set(item.instance, '<span">&#8457</span>');
                        else
                            adiMp.set(item.instance, '<span">&#8451</span>');
                        break;
                }

                //console.log(`ADI Mapper => ${JSON.stringify(Object.fromEntries(adiMp))}`);
            });
        })
        .fail(() => {
            $('#header_SCM_Cnn').css({ display: 'block' });
        });

}


async function fnChkModBus() {
    await $.getJSON(
        '/module/info.json',
        (data, status, xhr) => {
            //debugger;
            //$('#header_SCM_Cnn').css({ display: 'none' });
            return data;
        }
    )
        .then((result) => {            
                document.title = `SolaHD ${result.modulename}`; 
        })
        .fail(() => {
            // $('#header_SCM_Cnn').css({ display: 'block' });
            document.title = `Sola HD`
        });
}


function fnStartDataOperationRefresh() {
    //objDataOperationRefresh = setInterval(fnFetchParaData(), refreshInterval);
    objDataOperationRefresh = setInterval(() => { fnFetchParaData(); }, refreshInterval);
}

function fnStopDataOperationRefresh() {
    if (objDataOperationRefresh != null) {
        clearInterval(objDataOperationRefresh);
    }
    objDataOperationRefresh = null;
}

//
function UINT8_To_ASCII(hxData) {
    return hex2a(hxData);
}

function UINT32_To_ASCII(hxData) {
    //return changeEndianness_v1(hxData);
    return parseInt((changeEndianness_v1(hxData)), 16);
}


//Hwxa to ASCCI
function hex2a(hexx) {
    //debugger;
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

function hex2bin(hex) {
    return (parseInt(hex, 16).toString(2)).padStart(8, '0');
}


const changeEndianness_v1 = (string) => {
    if (string == undefined)
        return '';

    //console.log(`changeEndianness_v1 => input string => ${string}`)
    const result = [];
    let len = string.length - 2;
    while (len >= 0) {
        result.push(string.substr(len, 2));
        len -= 2;
    }
    return result.join('');
}

function GetPowerSupplyLEDStatus(hexVal) {
    var ledStatusVal;

    if (hexVal == "01" || hexVal == "1" || hexVal == "0100")
        ledStatusVal = '<span>Normal Operation</span>';  //"Normal Operation";
    else if (hexVal == "09" || hexVal == "9" || hexVal == "0500")
        ledStatusVal = '<span>Normal Operation</span>';  //  "Heavy Load";
    else if (hexVal == "0A" || hexVal == "A" || hexVal == "0600")
        ledStatusVal = '<span style="color:red">Abnormal Operation</span>'; // "Power Boost";
    else if (hexVal == "04" || hexVal == "4" || hexVal == "0400")
        ledStatusVal = '<span style="color:red">Abnormal Operation</span>'; // "Short Circuit";
    else if (hexVal == "02" || hexVal == "2" || hexVal == "0200")
        ledStatusVal = '<span style="color:red">Abnormal Operation</span>'; // "Overtemperature Protection";
    else if (hexVal == "00" || hexVal == "0" || hexVal == "0000")
        ledStatusVal = '<span>Abnormal Operation</span>'; // "No DC Output";
    else
        ledStatusVal = '<span></span>';

    return ledStatusVal;

}


//P1,P2 Event Flag ADI 113/213
function SetPSUEventFlag(hex) {
    //debugger;
    var retVal = "";
    switch (hex) {
        case "0000":
        case "0001":
        case "0003":
        case "0006":
        case "0008":
            retVal = "";
            break;
        case "0002":
            retVal = "<span>SCP</span>";
            break;
        case "0004":
            retVal = "<span>OVP</span>";
            break;
        case "0005":
            retVal = "<span>Power Boost</span>";
            break;
        case "0007":
            retVal = "<span>OCP</span><br/>";
            break;
        default:
            retVal = "";
    }
    return retVal;
};

//mp.set(element.instance, retVal);

function convertH2D(hexVal) {
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

