var OverWVRefresRate = 2000;

//debugger;
//SetOverviewTags();

//var ObjOverWVDataRefersh = null;

// fnStartDataOperationRefresh();
fnStartOverviewDataRefresh();


function fnStartOverviewDataRefresh(){
    ObjOverWVDataRefersh = setInterval(SetOverviewTags, OverWVRefresRate);
}

function fnStopOverviewDataRefresh(){
    clearInterval(ObjOverWVDataRefersh);
}


function SetOverviewTags(){    
    $("#1").html(adiMp.get(1)); //SCM|Part Number 
    $("#2").html(adiMp.get(2)); //SCM|Serial No.
    $("#3").html(adiMp.get(3)); //SCM|Mfg. Info
    $("#4").html(adiMp.get(4)); //SCM|Mfr. Name
    $("#5").html(adiMp.get(5)); //SCM|Model Rev
    $("#6").html(adiMp.get(6)); //SCM|Pri FW Rev 
    $("#7").html(adiMp.get(7)); //SCM|Sec FW Rev

    if(adiMp.get(102) != ""){       
        $("#101").html(adiMp.get(101)); //P1|Part Number
        $("#102").html(adiMp.get(102)); //P1|Serial Number
        $("#103").html(adiMp.get(103)); //P1|Mfg. Info
        $("#104").html(adiMp.get(104)); //P1|Mfr. Name
        $("#105").html(adiMp.get(105)); //P1|ID
        $("#106").html(adiMp.get(106)); //P1|Model Rev
        $("#107").html(adiMp.get(107)); //P1|Pri FW Rev
        $("#108").html(adiMp.get(108)); //P1|Secondary Rev
    }
    else{        
        $("#101").html(""); 
        $("#102").html("");
        $("#103").html("");
        $("#104").html("");
        $("#105").html("");
        $("#106").html("");
        $("#107").html("");
        $("#108").html("");         
    }

    if(adiMp.get(202) != ""){	
        $("#201").html(adiMp.get(201)); //P2|Part Number
        $("#202").html(adiMp.get(202)); //P2|Serial Number
        $("#203").html(adiMp.get(203)); //P2|Mfg. Info
        $("#204").html(adiMp.get(204)); //P2|Mfr. Name
        $("#205").html(adiMp.get(205)); //P2|ID
        $("#206").html(adiMp.get(206)); //P2|Model Rev
        $("#207").html(adiMp.get(207)); //P2|Pri FW Rev
        $("#208").html(adiMp.get(208)); //P2|Secondary Rev
    }
    else{ 	
        $("#201").html(""); 
        $("#202").html("");
        $("#203").html("");
        $("#204").html("");
        $("#205").html("");
        $("#206").html("");
        $("#207").html("");
        $("#208").html("");
    }
    //console.log(`time =>${new Date()}`);
    // console.log(`inside SetOverviewTags() function under /overview.html page... ${new Date()}`);
}