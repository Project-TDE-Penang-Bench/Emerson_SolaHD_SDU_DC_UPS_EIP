function paramConvrt(instID, paramName, paramHexVal){
    //debugger;
    var _paramHexVal = changeEndianness(paramHexVal)
    var retValue;
    switch(instID){
        case 300:
        case 316:
        case 106:
        case 206:
        case 107:
        case 207:
        case 108:
        case 208:
        case 125:
        case 225:
        case 124:
        case 224:
        case 123:
        case 223:    
            retValue = Number((parseInt(_paramHexVal, 16))  * 0.01).toFixed(2);
            if(retValue == 0.0)
                retValue = "";
            break;
        case 301:
        case 317:
        case 109:
        case 209:
        case 10:
        case 127:
        case 227:
        case 126:
        case 226:
            retValue = Number((parseInt(_paramHexVal, 16))  * 0.1).toFixed(2);
            if(retValue == 0.0)
                retValue = "";
            break;
        case 10:
        case 121:
        case 221:
        case 120:
        case 220:
        case 118:
        case 218:
        case 117:
        case 217:
        case 116:
        case 216: 
        case 115:
        case 215:     
            retValue = Number(parseInt(_paramHexVal, 16)).toFixed(2);
            if(retValue == 0.0)
                retValue = "";
            break;
        case 13:
        case 112:
        case 212:
        case 14:
        case 113:
        case 213:
            retValue = ((Number(parseInt(_paramHexVal, 16))) / 3600).toFixed(2);
            if(retValue <= 0.0)
                retValue = "";
            break;
        case 6:
        case 7:
            retValue = Number(parseInt(_paramHexVal, 0)).toFixed(2);
            if(retValue == 0.0)
                retValue = "";
            break;
        case 114:
        case 214:
            if(paramHexVal = "01")
                retValue = "AC";
            else
                retValue = "DC";
            break;
        case 128:
            switch(paramHexVal){
                case "09":
                case "9":
                    retValue = "Undervoltage Protection";
                break;
            }
        default:
        retValue = _paramHexVal;
    }
    return retValue; // Number(retValue).toFixed(2);
}

function paramConvrt_v1(instID, paramName, paramHexVal){
    //debugger;
    var _paramHexVal = changeEndianness(paramHexVal)
    var retValue;
    switch(instID){
        case "scm_status_temperature":
            retValue = (parseInt(_paramHexVal, 16));
            break;
        default:
        retValue = _paramHexVal;
    }
    return Number(retValue).toFixed(2);
}

const changeEndianness = (string) => {
    const result = [];
    let len = string.length - 2;
    while (len >= 0) {
      result.push(string.substr(len, 2));
      len -= 2;
    }
    return result.join('');
}

function getUnit(InstID){
    //debugger;
    var strUnit = '';
    switch(InstID){
        case 10:
        case 109:
        case 125:
        case 126:
        case 209:
        case 225:
        case 226:
        case 301:
        case 317:
            strUnit = 'Celcius';
        break;
        case 107:
        case 123:
        case 207:        
        case 223:
        case 300:
        case 316:
            strUnit = 'Amperes';
        break;
        case 112:
        case 113:
        case 212:        
        case 213:
            strUnit = 'hours';
        break;
        case 106:
        case 108:
        case 122:        
        case 124:
        case 206:
        case 208:
        case 222:        
        case 214:
            strUnit = 'Volts';
    }

    return strUnit;
}