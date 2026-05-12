
const userSystemNameInst = 450; // User System Name Instance
const userDeviceNameInst = 451; // User Device Name Instance
const batteryTypeInst = 453; // Battery Type Instance
const sysTempUnitInst = 454; // System Temperature Instance
const thresholdTempMinDC = 20; // Threshold Temperature Min Instance Degree Celsius
const thresholdTempMaxDC = 80; // Threshold Temperature Max Instance Degree Celsius
const thresholdTempMinDF = 68; // Threshold Temperature Min Instance Degree Fahrenheit
const thresholdTempMaxDF = 176; // Threshold Temperature Max Instance Degree Fahrenheit
const thresholdLowBatPercentMin = 0; // Threshold Low Battery Percent 
const thresholdLowBatPercentMax = 100; // Threshold Low Battery Percent Max
const thresholdLowBatRuntimeMin = 240; // Threshold Low Battery Runtime Min in seconds
const thresholdLowBatRuntimeMax = 14400; // Threshold Low Battery Runtime Max in seconds

//Hexadecimal to ASCCI
function hexToAscii(hexx) {    
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

function alphanumericToHex(str) {
    let hexString = '';
    for (let i = 0; i < str.length; i++) {
        hexString += str.charCodeAt(i).toString(16).padStart(2, '0');
    }
    return hexString;
}

async function fnFetchAPIData(urlAPIData) {
    try {
        const response = await fetch(urlAPIData);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let dataAPI = await response.json();
        return dataAPI;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

async function fnUpdateADIData(inst, value) {
    const url = `/adi/update.json?inst=${inst}&value=${value}`;
    let returnValue = false;
    await $.ajax({
        url: url,
        type: "POST",
        contentType: "application/json",
        success: function (response) {
            if(response.result == 0)
                returnValue = true;
            else
                returnValue = false;
        },
        error: function (xhr, status, error) {
            returnValue = false;
        }
    });
    return returnValue;
}

async function fnGetConfigTempUnit(){
    let url = `/adi/data.json?inst=454&count=1`;
    let jsonTempUnit = await fnFetchAPIData(url);
    let tempUnit = jsonTempUnit[0];
    if(tempUnit == '0000')
        return "\u2103";
    else if(tempUnit == '0100')
        return "\u2109";
    else
        return "Unknown";
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

const SINT16ToDecimal = (hex) => {
    if (typeof hex !== 'string') {
        throw new Error(`Expected hex string, got ${typeof hex}`);
    }
    
    // Ensure the hex string is exactly 4 characters (16 bits)
    if (hex.length !== 4) {
        console.warn(`Hex string should be 4 characters for SINT16, got ${hex.length}. Padding or truncating.`);
        hex = hex.padStart(4, '0').substring(0, 4);
    }
    
    // Create buffer (2 bytes for 16 bits)
    const buffer = new ArrayBuffer(2);
    const view = new DataView(buffer);
    
    // Convert the hex string to a 16-bit integer and set it in the buffer
    const value = parseInt(hex, 16);
    view.setUint16(0, value, false); // false for big-endian
    
    // Get the signed 16-bit integer value
    return view.getInt16(0, false); // false for big-endian
}

const textToHex32 = (text) => {
    let hex = '';
    for (let i = 0; i < text.length; i++) {
        hex += text.charCodeAt(i).toString(16).padStart(2, '0');
    }
    return hex.padEnd(32, '0'); // pad with zeros to make it 32 characters
}  


const hexToBinary = (hex) => {
    return (parseInt(hex, 16).toString(2)).padStart(16, '0');
}

const binaryToHex = (binary) => {
    return parseInt(binary, 2).toString(16).toUpperCase().padStart(4, '0');
}

async function doEventLogs(LogName,Source,Level,Opcode,TaskCategory,Keywords,Description ) {
    //debugger;
    let timeStamp = new Date();
    let eventID = timeStamp.getTime(); // Unique Event ID based on timestamp
    let user = "admin"; // Replace with actual user if available
    // Construct the query string from the logData object
    const queryString = `${eventID},${timeStamp.toISOString()},${user},${LogName},${Source},${Level},${Opcode},${TaskCategory},${Keywords},${Description}`;
    //const encodedParams = $.param(queryString);
    //console.log('Encoded Log Data:', queryString);
    const url = `/log/logs.shtm?logs=${queryString}`; // Replace with your endpoint
    const urlEncoded = encodeURI(url);

    // Perform the POST request
    $.ajax({
        url: urlEncoded,
        type: 'POST',
        contentType: 'application/text',
        success: function (response) {
            console.log('Log data posted successfully');
        },
        error: function (xhr, status, error) {
            console.error('Error posting log data:', error);
        },
    });
}