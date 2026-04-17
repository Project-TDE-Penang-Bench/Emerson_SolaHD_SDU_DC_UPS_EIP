//debugger;
var inputJSON = [{"instance":1,"name":"scm_fru_productName","min":null,"max":null,"datatype":7,"numelements":16,"access":9},{"instance":2,"name":"scm_fru_serialNumber","min":null,"max":null,"datatype":7,"numelements":16,"access":9},{"instance":3,"name":"scm_fru_manufacturingInfo","min":null,"max":null,"datatype":7,"numelements":16,"access":9},{"instance":4,"name":"scm_fru_manufacturerName","min":null,"max":null,"datatype":7,"numelements":16,"access":9},{"instance":5,"name":"scm_fru_modelRevision","min":null,"max":null,"datatype":7,"numelements":5,"access":9},{"instance":6,"name":"scm_fru_majorRevision","min":null,"max":null,"datatype":4,"numelements":1,"access":9},{"instance":7,"name":"scm_fru_minorRevision","min":null,"max":null,"datatype":4,"numelements":1,"access":9},{"instance":8,"name":"scm_status_led","min":null,"max":null,"datatype":4,"numelements":1,"access":9},{"instance":9,"name":"scm_status_eventFlags","min":null,"max":null,"datatype":10,"numelements":1,"access":9},{"instance":10,"name":"scm_status_temperature","min":null,"max":null,"datatype":2,"numelements":1,"access":9},{"instance":11,"name":"scm_status_numDevicePort1","min":null,"max":null,"datatype":4,"numelements":1,"access":9},{"instance":12,"name":"scm_status_numDevicePort2","min":null,"max":null,"datatype":4,"numelements":1,"access":9},{"instance":13,"name":"scm_optData_turnOnTime","min":null,"max":null,"datatype":6,"numelements":1,"access":9},{"instance":14,"name":"scm_optData_totalOnTime","min":null,"max":null,"datatype":6,"numelements":1,"access":9},{"instance":101,"name":"sdn_1_fru_productName","min":null,"max":null,"datatype":7,"numelements":16,"access":9},{"instance":102,"name":"sdn_1_fru_serialNumber","min":null,"max":null,"datatype":7,"numelements":14,"access":9},{"instance":103,"name":"sdn_1_fru_manufacturingInfo","min":null,"max":null,"datatype":7,"numelements":11,"access":9},{"instance":104,"name":"sdn_1_fru_manufacturerName","min":null,"max":null,"datatype":7,"numelements":5,"access":9},{"instance":105,"name":"sdn_1_fru_modelRevision","min":null,"max":null,"datatype":7,"numelements":3,"access":9},{"instance":106,"name":"sdn_1_liveData_vOut","min":null,"max":null,"datatype":5,"numelements":1,"access":9},{"instance":107,"name":"sdn_1_liveData_iOut","min":null,"max":null,"datatype":5,"numelements":1,"access":9},{"instance":108,"name":"sdn_1_liveData_vIn","min":null,"max":null,"datatype":5,"numelements":1,"access":9},{"instance":109,"name":"sdn_1_liveData_temp","min":null,"max":null,"datatype":5,"numelements":1,"access":9},{"instance":110,"name":"sdn_1_liveData_led","min":null,"max":null,"datatype":4,"numelements":1,"access":9},{"instance":111,"name":"sdn_1_liveData_eFlags","min":null,"max":null,"datatype":10,"numelements":1,"access":9},{"instance":112,"name":"sdn_1_optData_turnOnTime","min":null,"max":null,"datatype":6,"numelements":1,"access":9},{"instance":113,"name":"sdn_1_optData_totalOnTime","min":null,"max":null,"datatype":6,"numelements":1,"access":9},{"instance":114,"name":"sdn_1_optData_acInput","min":null,"max":null,"datatype":0,"numelements":1,"access":9},{"instance":115,"name":"sdn_1_evCount_dcOnCycles","min":null,"max":null,"datatype":5,"numelements":1,"access":9},{"instance":116,"name":"sdn_1_evCount_scp","min":null,"max":null,"datatype":5,"numelements":1,"access":9},{"instance":117,"name":"sdn_1_evCount_uvp","min":null,"max":null,"datatype":5,"numelements":1,"access":9},{"instance":118,"name":"sdn_1_evCount_ovp","min":null,"max":null,"datatype":5,"numelements":1,"access":9},{"instance":119,"name":"sdn_1_evCount_powerBoost","min":null,"max":null,"datatype":5,"numelements":1,"access":9},{"instance":120,"name":"sdn_1_evCount_powerUp","min":null,"max":null,"datatype":5,"numelements":1,"access":9},{"instance":121,"name":"sdn_1_evCount_otp","min":null,"max":null,"datatype":5,"numelements":1,"access":9},{"instance":122,"name":"sdn_1_evCount_innacurateCin","min":null,"max":null,"datatype":5,"numelements":1,"access":9},{"instance":123,"name":"sdn_1_maxData_vOut","min":null,"max":null,"datatype":5,"numelements":1,"access":9},{"instance":124,"name":"sdn_1_maxData_iOut","min":null,"max":null,"datatype":5,"numelements":1,"access":9},{"instance":125,"name":"sdn_1_maxData_vIn","min":null,"max":null,"datatype":5,"numelements":1,"access":9},{"instance":126,"name":"sdn_1_maxData_temp","min":null,"max":null,"datatype":5,"numelements":1,"access":9},{"instance":127,"name":"sdn_1_minData_temp","min":null,"max":null,"datatype":5,"numelements":1,"access":9},{"instance":201,"name":"sdn_2_fru_productName","min":null,"max":null,"datatype":7,"numelements":16,"access":9},{"instance":202,"name":"sdn_2_fru_serialNumber","min":null,"max":null,"datatype":7,"numelements":14,"access":9},{"instance":203,"name":"sdn_2_fru_manufacturingInfo","min":null,"max":null,"datatype":7,"numelements":11,"access":9},{"instance":204,"name":"sdn_2_fru_manufacturerName","min":null,"max":null,"datatype":7,"numelements":5,"access":9},{"instance":205,"name":"sdn_2_fru_modelRevision","min":null,"max":null,"datatype":7,"numelements":3,"access":9},{"instance":206,"name":"sdn_2_liveData_vOut","min":null,"max":null,"datatype":5,"numelements":1,"access":9},{"instance":207,"name":"sdn_2_liveData_iOut","min":null,"max":null,"datatype":5,"numelements":1,"access":9},{"instance":208,"name":"sdn_2_liveData_vIn","min":null,"max":null,"datatype":5,"numelements":1,"access":9},{"instance":209,"name":"sdn_2_liveData_temp","min":null,"max":null,"datatype":5,"numelements":1,"access":9},{"instance":210,"name":"sdn_1_liveData_led","min":null,"max":null,"datatype":4,"numelements":1,"access":9},{"instance":211,"name":"sdn_1_liveData_eFlags","min":null,"max":null,"datatype":10,"numelements":1,"access":9},{"instance":212,"name":"sdn_2_optData_turnOnTime","min":null,"max":null,"datatype":6,"numelements":1,"access":9},{"instance":213,"name":"sdn_2_optData_totalOnTime","min":null,"max":null,"datatype":6,"numelements":1,"access":9},{"instance":214,"name":"sdn_2_optData_acInput","min":null,"max":null,"datatype":0,"numelements":1,"access":9},{"instance":215,"name":"sdn_2_evCount_dcOnCycles","min":null,"max":null,"datatype":5,"numelements":1,"access":9},{"instance":216,"name":"sdn_2_evCount_scp","min":null,"max":null,"datatype":5,"numelements":1,"access":9},{"instance":217,"name":"sdn_2_evCount_uvp","min":null,"max":null,"datatype":5,"numelements":1,"access":9},{"instance":218,"name":"sdn_2_evCount_ovp","min":null,"max":null,"datatype":5,"numelements":1,"access":9},{"instance":219,"name":"sdn_2_evCount_powerBoost","min":null,"max":null,"datatype":5,"numelements":1,"access":9},{"instance":220,"name":"sdn_2_evCount_powerUp","min":null,"max":null,"datatype":5,"numelements":1,"access":9},{"instance":221,"name":"sdn_2_evCount_otp","min":null,"max":null,"datatype":5,"numelements":1,"access":9},{"instance":222,"name":"sdn_2_evCount_innacurateCin","min":null,"max":null,"datatype":5,"numelements":1,"access":9},{"instance":223,"name":"sdn_2_maxData_vOut","min":null,"max":null,"datatype":5,"numelements":1,"access":9},{"instance":224,"name":"sdn_2_maxData_iOut","min":null,"max":null,"datatype":5,"numelements":1,"access":9},{"instance":225,"name":"sdn_2_maxData_vIn","min":null,"max":null,"datatype":5,"numelements":1,"access":9},{"instance":226,"name":"sdn_2_maxData_temp","min":null,"max":null,"datatype":5,"numelements":1,"access":9},{"instance":227,"name":"sdn_2_minData_temp","min":null,"max":null,"datatype":5,"numelements":1,"access":9}]
var inputData = ["53434D2D452D45495000000000000000","4630313457575353535352524C000000","50485757595930303030000000000000","534F4C41000000000000000000000000","3030000000","00","00","00","0000","CDCC","00","00","00000000","00000000","53444E2031302D32342D313030442000","4E34373733343030314842465000","5048333432303030314D00","534F4C4100","FFFF00","9109","1100","BD5C","0000","01","2000","FC2E0000","CFD10200","01","1000","0000","1000","0000","0000","1000","0000","1000","4C6D","ACB7","EFA8","FFFF","FFFF","00000000000000000000000000000000","0000000000000000000000000000","0000000000000000000000","0000000000","000000","0000","0000","0000","0000","00","0000","00000000","00000000","00","0000","0000","0000","0000","0000","0000","0000","0000","0000","0000","0000","0000","0000"]
//alert("Eicp");

$.getJSON(
    '/adi/metadata2.json?offset=0&count=68',
    (data, status, xhr) => {
        //console.log(`Data1 => ${JSON.stringify(data)}`)
        //console.log(`status => ${status}`)
        return data;
    }
).then((result) => {
    inputJSON = result;
    //console.log(`result => ${JSON.stringify(result)}`)
    $.getJSON('/adi/data.json?offset=0&count=68',
        (data, status, xhr) => {
            //console.log(`Data2 => ${JSON.stringify(data)}`)
            return data;
        }
    ).then((result) => {
        //console.log(`result1 => ${JSON.stringify(result)}`)
        inputData = result;
        bindProData();
    });

}).catch((err) => {
    console.log(`Error => ${err}`)
});;



function bindProData() {
    inputJSON.forEach((element, idx) => {
        //debugger;

        if(element.datatype == 7){
            $('#tbody').append(
                `<tr class=${(idx % 2 === 0)? "row-2" : "row-1"}>
                    <td class="order-col">${idx + 1}</td>
                    <td class="name-col">${element.name}</td>
                    <td ><input type="text" spellcheck="false" value="${hex2a(inputData[idx])}" readonly="readonly" class="adi-field-input"></td>
                    <td class="right">${getUnit(element.instance)}</td>
                </tr>`
            );
        }
        else if(element.datatype == 2 || element.datatype == 5){
            //var str = ConvertBase.changeEndianess(inputData[idx]);
            //var val = ConvertBase.hex2dec(str)
            var val = paramConvrt(element.instance, element.name, inputData[idx])
            $('#tbody').append(
                `<tr class=${(idx % 2 === 0)? "row-2" : "row-1"}>
                    <td class="order-col">${idx + 1}</td>
                    <td class="name-col">${element.name}</td>
                    <td><input type="text" spellcheck="false" value="${val}" readonly="readonly" class="adi-field-input"></td>
                    <td class="right">${getUnit(element.instance)}</td>
                </tr>`
            );
        }
        else if(element.datatype == 4 ){
            //var str = ConvertBase.changeEndianess(inputData[idx]);
            //var val = ConvertBase.hex2dec(str)
            var val = paramConvrt(element.instance, element.name, inputData[idx])
            $('#tbody').append(
                `<tr class=${(idx % 2 === 0)? "row-2" : "row-1"}>
                    <td class="order-col">${idx + 1}</td>
                    <td class="name-col">${element.name}</td>
                    <td><input type="text" spellcheck="false" value="${val}" readonly="readonly" class="adi-field-input"></td>
                    <td class="right">${getUnit(element.instance)}</td>
                </tr>`
            );
        }
        else{
            
            $('#tbody').append(
                `<tr class=${(idx % 2 === 0)? "row-2" : "row-1"}>
                    <td class="order-col">${idx + 1}</td>
                    <td class="name-col">${element.name}</td>
                    <td><input type="text" spellcheck="false" value="" readonly="readonly" class="adi-field-input"></td>
                    <td class="right">${getUnit(element.instance)}</td>
                </tr>`
            );
        }
    });
}
function hex2a(hexx) {
    //debugger;
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}