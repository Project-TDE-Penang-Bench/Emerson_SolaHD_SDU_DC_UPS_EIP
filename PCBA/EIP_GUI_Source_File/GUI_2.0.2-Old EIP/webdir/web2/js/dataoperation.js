
var inputJSON;
var inputData;
var mp = new Map();
var AdiCount = 81;
var urlMetadata = `/adi/metadata2.json?offset=0&count=${AdiCount}`
var urlData = `/adi/data.json?offset=0&count=${AdiCount}`
var refreshInterval = 2000; // milisecond
//debugger
$.getJSON(
    urlMetadata,
    (data, status, xhr) => {
        return data;
    }
)
    .fail(function () {
        //alert("error"); 
        //debugger;
        $('#header_SCM_Cnn').css({ display: 'block' });
    })
    .then((result) => {
        inputJSON = result;
        objDataOperationRefresh = setInterval(() => { fnFetchParaData(); }, refreshInterval);
    })

async function fnFetchParaData() {
    //console.log('1234');
    await $.getJSON(urlData,
        (data, status, xhr) => {

            $('#header_SCM_Cnn').css({ display: 'none' });
            return data;
        }
    ).then((result) => {
        inputData = result;
        //bindProData();
        inputJSON.forEach((element, idx) => {
            //debugger;
            //inputData[34]= '0000';
            if (element.datatype == 7) {
                //mp.set(element.instance, `${hex2a(inputData[idx])}`);       
                if (element.instance != 6)
                    mp.set(element.instance, `${hex2a(inputData[idx])}`);
                else {
                    mp.set(element.instance, `${((parseFloat(hex2a(inputData[idx]))) / 100)}`);
                }
            }
            else if (element.datatype == 2) {
                var val = paramConvrt_v1(element.instance, element.name, inputData[idx])
                mp.set(element.instance, val);
            }
            else if (element.datatype == 5) {
                var val = paramConvrt_v1(element.instance, element.name, inputData[idx])
                mp.set(element.instance, val);
            }
            else if (element.datatype == 4) {
                var val = paramConvrt_v1(element.instance, element.name, inputData[idx])
                mp.set(element.instance, val);
            }
            else if (element.datatype == 6) {
                var val = paramConvrt_v1(element.instance, element.name, inputData[idx])
                mp.set(element.instance, val);
            }
            else if (element.datatype == 0) {
                var val = paramConvrt_v1(element.instance, element.name, inputData[idx])
                mp.set(element.instance, val);
            }
            else if (element.datatype == 10) {
                //debugger;
                var inputVal = changeEndianness_v1(inputData[idx]);
                var binVal = hex2bin(inputVal);
                //binVal = '01100010';
                var binArray = binVal.split("");
                var retVal = "";
                binArray.forEach((item, idx) => {
                    //console.log(`[${idx}] => ${item}`);
                    if (item == 1) {
                        switch (idx) {
                            case 0:
                                retVal += "<span>Power Down</span><br/>";
                                break;
                            case 1:
                                retVal += "<span>OTP</span><br/>";
                                break;
                            case 2:
                                retVal += "";
                                break;
                            case 3:
                                retVal += "<span>Power Boost</span><br/>";
                                break;
                            case 4:
                                retVal += "<span>OVP</span><br/>";
                                break;
                            case 5:
                                retVal += "";
                                break;
                            case 6:
                                retVal += "<span>SCP</span><br/>";
                                break;
                            case 7:
                                retVal += "<span>OCP</span><br/>";
                                break;
                            default:
                                retVal = "";
                        }
                    }

                });

                mp.set(element.instance, retVal);
            }
            else if (element.datatype == 11) {
                var inputVal = changeEndianness_v1(inputData[idx]);
                var binVal = hex2bin(inputVal);
                var binArray = binVal.split("");
                //console.log(`BinArray => ${binVal.split("")}`);
                var retVal = "";
                binArray.forEach((item, idx) => {
                    if (item == 1) {
                        switch (idx) {
                            case 0:
                                retVal = "";
                                break;
                            case 1:
                                retVal = "";
                                break;
                            case 2:
                                retVal = "";
                                break;
                            case 3:
                                retVal = "";
                                break;
                            case 4:
                                retVal += '<span style="color:red">PSU High Temperature!!!</span><br/>';// "PSU High Temperature!!! <br/>";
                                break;
                            case 5:
                                retVal += '<span style="color:red">High Current!!!</span><br/>'; // "High Current!!! <br/>";
                                break;
                            case 6:
                                retVal = "";
                                break;
                            case 7:
                                retVal = "";
                                break;
                            default:
                                retVal = "";
                        }

                    }
                });

                mp.set(element.instance, retVal);
            }
            else if(element.datatype == 18){
                var val = paramConvrt_v1(element.instance, element.name, inputData[idx])
                mp.set(element.instance, val);
            }
            else {

            }

            //console.log(mp.size);
            //console.log(`mp => ${JSON.stringify(mp)}`);
        });
    })
        .fail(function () {
            //alert("error"); 
            //debugger;
            $('#header_SCM_Cnn').css({ display: 'block' });
        });

}

function fnStartDataOperationRefresh() {
    objDataOperationRefresh = setInterval(fnFetchParaData(), refreshInterval);
}

function fnStopDataOperationRefresh() {
    if (objDataOperationRefresh != null) {
        clearInterval(objDataOperationRefresh);
        //objDataOperationRefresh = null;
    }
}

function hex2a(hexx) {
    //debugger;
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

const changeEndianness_v1 = (string) => {
    const result = [];
    let len = string.length - 2;
    while (len >= 0) {
        result.push(string.substr(len, 2));
        len -= 2;
    }
    return result.join('');
}

function hex2bin(hex) {
    return (parseInt(hex, 16).toString(2)).padStart(8, '0');
}

function paramConvrt_v1(instID, paramName, paramHexVal) {
    //debugger;
    var _paramHexVal = changeEndianness_v1(paramHexVal)
    var retValue;
    switch (instID) {
        case 300: //P1|Current High
        case 316: //P2|Current High:   
            //paramHexVal = 'ffff';
            if (paramHexVal == 'ffff' || paramHexVal == 'FFFF')
                retValue = 'NaN';
            else
                retValue = Number((parseInt(_paramHexVal, 16)) * 0.01).toFixed(2);
            break;
        case 108: //P1|Vout
        case 208: //P2|Vout
        case 125: //P1|Max Vout
        case 225: //P2|Max Vout
        case 126: //P1|Max Iout
        case 226: //P2|Max Iout
        case 109: //P1|Iout
        case 209: //P2|Iout
            //retValue = Number((parseInt(_paramHexVal, 16)) * 0.01).toFixed(2);
            retValue = Number((parseInt(_paramHexVal, 16)) * 0.1).toFixed(1);
            break;
        case 110://P1|Vin
        case 210://P2|Vin
        case 127: //P1|Max Vin
        case 227: //P2|Max Vin
            //retValue = Number((parseInt(_paramHexVal, 16)) * 0.01).toFixed(2);
            retValue = (parseInt(_paramHexVal, 16)) ;
            break;
        case 10:  //SCM|Temperature
        case 128: //P1|Max Temp
        case 228: //P2|Max Temp
        //case 129: //P1|Min Temp
        //case 229: //P2|Min Temp
        case 111: //P1|Temperature
        case 211: //P2|Temperature                    
            //retValue = convertH2D(_paramHexVal) * Math.pow(10, -1);
            retValue = convertH2D(_paramHexVal);

            break;
        case 301: //P1|Temp High
        case 317: //P2|Temp High
            if (paramHexVal == 'ffff' || paramHexVal == 'FFFF')
                retValue = 'NaN';
            else {
                var hexEndian = endianess.swaphex(paramHexVal);// inputData[idx].replace(/^(.(..)*)$/, "0$1").match(/../g).reverse().join(""); 
                retValue = convertH2D(hexEndian) * Math.pow(10, -1);
            }
            break;
        case 117:
        case 217:
        case 118: //P1|Count,SCP
        case 218: //P2|Count,SCP
        case 120: //P1|Count,OVP
        case 220: //P2|Count,OVP
        case 121: //P1|Count,Pboost
        case 221: //P2|Count,Pboost        
        case 122: //P1|Count,PowerIn
        case 222: //P2|Count,PowerIn
        case 123: //P1|Count,OTP
        case 223: //P2|Count,OTP
            retValue = Number(parseInt(_paramHexVal, 16));
            break;
        case 115:
        case 215:
        case 114:
        case 214:
            //case 113:
            //case 213:
            retValue = ((Number(parseInt(_paramHexVal, 16))) / 3600).toFixed(2);
            if (retValue <= 0.0)
                retValue = "";
            break;
        case 7:  //SCM|Secondary FW Rev
        case 106: //P1|Primary Rev
        case 206: //P2|Primary Rev
        case 107: //P1|Secondary Rev
        case 207: //P2|Secondary Rev
            // if(instID == 106)
            //_paramHexVal = '0005';
            retValue = Number(parseInt(_paramHexVal, 16));
            if (retValue < 10)
                retValue = '0' + retValue.toString();
            // if(retValue == 0.0)
            //     retValue = "";
            //retValue = hex2a(paramHexVal);
            break;
        case 116: //P1|Vin Type
        case 216: //P2|Vin Type   
            //paramHexVal = '00';  
            if (paramHexVal == 'FF' || paramHexVal == '01' || paramHexVal == 'ff')
                retValue = "AC";
            else
                retValue = "DC";
            break;
        case 402: //P1| Enable Alarm
        case 403: //P2| Enable Alarm            
            //retValue = paramHexVal;
            if (paramHexVal == 'FF' || paramHexVal == '01' || paramHexVal == 'ff')
                retValue = "Enable";
            else
                retValue = "Disable";
            break;
        case 130: //P1|0 ECode
        case 133: //P1|1 ECode
        case 136: //P1|2 ECode

        case 230: //P2|0 ECode
        case 233: //P2|1 ECode
        case 236: //P2|2 ECode
            //debugger;
            switch (paramHexVal) {
                case "08":
                case "8":
                    retValue = "Short Circuit Protection";
                    break;
                case "09":
                case "9":
                    retValue = "Under Voltage Protection";
                    break;
                case "0A":
                case "A":
                    retValue = "Over Voltage Protection";
                    break;
                case "B":
                case "b":
                case "0B":
                case "0b":
                    retValue = "Over Temperature Protection";
                    break;
                case "C":
                case "c":
                case "0C":
                case "0c":
                    retValue = "Power Boost";
                    break;
                case "FF":
                case "ff":
                    retValue = "N/A";
                    break;
                default:
                    retValue = "N/A";
            }
            break;
        case 131: //P1|0 EStart
        //case 129: 
        case 134: //P1|1 EStart
        case 137: //P1|2 EStart
        //case 139:
        //case 229:
        case 231: //P2|0 EStart
        case 234: //P2|1 EStart
        case 237: //P2|2 EStart
            //case 239:                
            if (paramHexVal == "01" || paramHexVal == "1")
                retValue = "Start";
            else if (paramHexVal == "00" || paramHexVal == "0")
                retValue = "End";
            else
                retValue = "";
            break;
        case 139:
        case 239:
            retValue = paramHexVal;
            break;
        case 141:
        case 241:
            retValue = paramHexVal;
            break;
        case 132: //P1|0 ETimestamp
        case 135: //P1|1 ETimestamp
        case 138: //P1|2 ETimestamp
        //case 137:
        case 142:
        case 232: //P2|0 ETimestamp
        case 235: //P2|1 ETimestamp
        case 238: //P2|2 ETimestamp
        //case 237:
        case 242:
            retValue = ((Number(parseInt(_paramHexVal, 16))) / 3600).toFixed(2);
            if (retValue <= 0.0)
                retValue = "";
            break;
        case 112:// SDN1 LED status
        case 212:// SDN1 LED status
            if (paramHexVal == "01" || paramHexVal == "1")
                retValue = '<span>Normal Operation</span>'; //"Normal Operation";
            else if (paramHexVal == "09" || paramHexVal == "9")
                retValue = '<span>Normal Operation</span>'; //  "Heavy Load";
            else if (paramHexVal == "0A" || paramHexVal == "A")
                retValue = '<span style="color:red">Abnormal Operation</span>'; // "Power Boost";
            else if (paramHexVal == "04" || paramHexVal == "4")
                retValue = '<span style="color:red">Abnormal Operation</span>'; // "Short Circuit";
            else if (paramHexVal == "02" || paramHexVal == "2")
                retValue = '<span style="color:red">Abnormal Operation</span>'; // "Overtemperature Protection";
            else if (paramHexVal == "00" || paramHexVal == "0")
                retValue = '<span>Abnormal Operation</span>'; // "No DC Output";
            else
                retValue = "";
            break;
        case 2:
        case 3:
            retValue = parseInt(_paramHexVal, 16);
            break;
        case 6:
            retValue = parseInt(_paramHexVal, 16);
            break;
        case 7:
            retValue = parseInt(_paramHexVal, 16);
            break;
        case 1:
        case 4:
        case 5:
        case 101:
        case 102:
        case 103:
        case 104:
        case 105:
        case 201:
        case 202:
        case 203:
        case 204:
        case 205:
            retValue = hex2a(paramHexVal);
            break;
        default:
            retValue = _paramHexVal;
    }
    return retValue; // Number(retValue).toFixed(2);
}

function dC2dF(dcVal) {
    return (`${(dcVal * 1.0).toFixed(1)} °C (${(((dcVal) * (9 / 5)) + 32).toFixed(1)} °F)`);
}

function HexToSignedInt(num, numSize) {
    var val = {
        mask: 0x8 * Math.pow(16, numSize - 1), //  0x8000 if numSize = 4
        sub: -0x1 * Math.pow(16, numSize)    //-0x10000 if numSize = 4
    }
    if (parseInt(num, 16) & val.mask > 0) { //negative
        return (val.sub + parseInt(num, 16))
    } else {                                 //positive
        return (parseInt(num, 16))
    }
}

function DecimalHexTwosComplement(decimal) {
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

// JavaScript program to convert decimal
// to hexadecimal covering negative numbers

// Function to convert decimal no.
// to hexadecimal number
function Hex2Decimal(num) {
    // map for decimal to hexa, 0-9 are
    // straightforward, alphabets a-f used
    // for 10 to 15.

    let m = new Map();

    let digit = '0'.charCodeAt(0);
    let c = 'a'.charCodeAt(0);

    for (let i = 0; i <= 15; i++) {
        if (i < 10) {
            m.set(i, String.fromCharCode(digit));
            digit++;
        }
        else {
            m.set(i, String.fromCharCode(c));
            c++;
        }
    }

    // string to be returned
    let res = "";

    // check if num is 0 and directly return "0"
    if (num == 0) {
        return "0";
    }
    // if num>0, use normal technique as
    // discussed in other post
    if (num > 0) {
        while (num != 0) {
            res = m.get(num % 16) + res;
            num = Math.floor(num / 16);
        }
    }
    // if num<0, we need to use the elaborated
    // trick above, lets see this
    else {
        // store num in a u_int, size of u_it is greater,
        // it will be positive since msb is 0
        let n = num + Math.pow(2, 32);

        // use the same remainder technique.
        while (n != 0) {
            res = m.get(n % 16) + res;
            n = Math.floor(n / 16);
        }
    }

    return res;
}

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
