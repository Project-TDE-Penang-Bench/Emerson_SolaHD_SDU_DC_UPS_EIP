$.getJSON(
    '/adi/data.json?inst=102&count=1',
    (data, status, xhr) => {
		//debugger;
		$('#lbl_p1_serialnum').html(Evnt_hex2a(data[0]));
        return data;
    }
)
.then((result)=>{
	//console.log(`result => ${result}`)
	var p1_serialNo = Evnt_hex2a(result[0]);
	//var p2_serialNo = Evnt_hex2a(result[1]);
	$('#lbl_p1_serialnum').html(p1_serialNo);
	//$('#lbl_p2_serialnum').html(p2_serialNo);
})

$.getJSON(
    '/adi/data.json?inst=202&count=1',
    (data, status, xhr) => {
		//debugger;
		$('#lbl_p2_serialnum').html(Evnt_hex2a(data[0]));
        return data;
    }
)
.then((result)=>{
	//console.log(`result => ${result}`)
	var p1_serialNo = Evnt_hex2a(result[0]);
	//var p2_serialNo = Evnt_hex2a(result[1]);
	//$('#lbl_p1_serialnum').html(p1_serialNo);
	$('#lbl_p2_serialnum').html(p1_serialNo);
})

function Evnt_hex2a(hexx) {
    //debugger;
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

function htmlToCSV(objPS) {
	//debugger;
	var rows;
	if (objPS == 'PS1') {
		var tbl = document.querySelector("#eventN-table-p1")
		rows = tbl.querySelectorAll("table tr");
	}
	else {
		var tbl = document.querySelector("#eventN-table-p2")
		rows = tbl.querySelectorAll("table tr");
	}



	//var filename = "events_" + (new Date().getTime().toString()) + ".csv";
	var filename = `Event_${objPS}_${new Date().yyyymmddhhmmss()}.csv` //d.yyyymmddhhmmss();
	var data = [];
	//rows = document.querySelectorAll("table tr");

	for (var i = 0; i < rows.length; i++) {
		var row = [], cols = rows[i].querySelectorAll("td, th");

		for (var j = 0; j < cols.length; j++) {
			row.push(cols[j].innerText);
		}
		data.push(row.join(","));
	}

	downloadCSVFile(data.join("\n"), filename);
}

function downloadCSVFile(csv, filename) {
	var csv_file, download_link;
	csv_file = new Blob([csv], { type: "text/csv" });
	download_link = document.createElement("a");
	download_link.download = filename;
	download_link.href = window.URL.createObjectURL(csv_file);
	download_link.style.display = "none";
	document.body.appendChild(download_link);
	download_link.click();
}

Date.prototype.yyyymmdd = function () {
	var yyyy = this.getFullYear();
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

Date.prototype.yyyymmddhhmmss = function () {
	var yyyymmddhhmm = this.yyyymmddhhmm();
	var ss = this.getSeconds() < 10 ? "0" + this.getSeconds() : this.getSeconds();
	return "".concat(yyyymmddhhmm).concat(ss);
};