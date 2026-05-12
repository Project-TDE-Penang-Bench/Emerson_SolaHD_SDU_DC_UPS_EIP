
if(objOverviewDataOperation != null)
    clearInterval(objOverviewDataOperation);
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

var sduSerialNo = '';
fnGetSerialNo();
async function fnGetSerialNo() {
    let urlSerialNoData = `/adi/data.json?offset=3&count=1`;
    let retVal = await fetch(urlSerialNoData);
    let srnArr = await retVal.json();
    let serialNoHex = endianess.swaphex(srnArr[0]);
    sduSerialNo = parseInt(serialNoHex, 16);
}

function htmlToCSV() {
    let tblEvnt = document.querySelector("#eventTable");
    let rows = tblEvnt.querySelectorAll("table tr");
    let filename = `DCUPS_${sduSerialNo}_${new Date().yyyymmddhhmm()}_Event.csv`
    let data = [];
    for (let i = 0; i < rows.length; i++) {
        let row = rows[i];
        let cols = row.querySelectorAll("td, th");
        let csvRow = [];
        for (let j = 0; j < cols.length; j++) {
            let col = cols[j];
            csvRow.push(col.innerText.replace(/,/g, ''));
        }
        data.push(csvRow.join(","));
    }
    downloadCSVFile(data.join("\n"), filename);
}

function downloadCSVFile(csv, filename) {
    let csv_file, download_link;
    csv_file = new Blob([csv], { type: "text/csv" });
    download_link = document.createElement("a");
    download_link.download = filename;
    download_link.href = window.URL.createObjectURL(csv_file);
    download_link.style.display = "none";
    document.body.appendChild(download_link);
    download_link.click();
}

Date.prototype.yyyymmdd = function () {
    var yyyy = this.getFullYear().toString().slice(-2);
    var mm = this.getMonth() < 9 ? "0" + (this.getMonth() + 1) : (this.getMonth() + 1); // getMonth() is zero-based
    var dd = this.getDate() < 10 ? "0" + this.getDate() : this.getDate();
    return "".concat(yyyy).concat(mm).concat(dd);
};

Date.prototype.yyyymmddhhmm = function () {
    var yyyymmdd = this.yyyymmdd();
    var hh = this.getHours() < 10 ? "0" + this.getHours() : this.getHours();
    var min = this.getMinutes() < 10 ? "0" + this.getMinutes() : this.getMinutes();
    return "".concat(yyyymmdd).concat(hh).concat(min);
};