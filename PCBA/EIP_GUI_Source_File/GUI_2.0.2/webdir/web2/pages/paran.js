//console.log('paran.js...');
//debugger;

const LiveParRefreshRate = 2000;
const CountRefreshRate = 2000;
const MaxValueRefreshRate = 2000;



$("#1").html(adiMp.get(1));
$("#2").html(adiMp.get(2));
ShowHideTags();

function ShowHideTags() {
    var tm = $('#menu a.menuActive');
    var mn = $(tm).text();
    var submenuid = $(tm).attr('id');

    if (submenuid == 'livepara') {
        fnKeepAssignLivPara();
        fnStopAssignCountsPara();
        fnStopAssignMaxValuePara();
        $("#paran-table tbody tr.count").hide();
        $("#paran-table tbody tr.maxvalue").hide();
        $("#paran-table tbody tr.livepara").show();

        $('#paran-table tbody tr').eq(0).show();
        $('#paran-table tbody tr').eq(1).show();
        $(".header2").hide();
        $(".header3").hide();
        $(".header1").show();
        //$(".header4").hide();
    }
    else if (submenuid == 'counts') {
        fnKeepAssignCountsPara();

        fnStopAssignLivPara();
        fnStopAssignMaxValuePara();
        $("#paran-table tbody tr.count").show();
        $("#paran-table tbody tr.maxvalue").hide();
        $("#paran-table tbody tr.livepara").hide();

        $('#paran-table tbody tr').eq(0).show();
        $('#paran-table tbody tr').eq(1).show();
        $(".header2").hide();
        $(".header1").hide();
        $(".header3").show();
        //$(".header4").hide();

    }
    else if (submenuid == 'maxvalue') {
        fnKeepAssignMaxValuesPara();

        fnStopAssignLivPara();
        fnStopAssignCountsPara();
        $("#paran-table tbody tr.count").hide();
        $("#paran-table tbody tr.maxvalue").show();
        //$("#paran-table tbody tr.maxvalue").hide();
        $("#paran-table tbody tr.livepara").hide();

        $('#paran-table tbody tr').eq(0).hide();
        $('#paran-table tbody tr').eq(1).hide();
        $('.header1').hide();
        $('.header2').show();
        $(".header3").hide();
        //$(".header4").show();
    }
    else { }
}

function fnKeepAssignLivPara() {
    objLiveParRefresh = setInterval(fnSetLiveParaTags, LiveParRefreshRate);
    // console.log(`inside fnKeepAssignLivPara() ${new Date()}`);
}

function fnStopAssignLivPara() {
    clearInterval(objLiveParRefresh);
    // console.log(`inside fnStopAssignLivPara() ${new Date()}`);
}

function fnKeepAssignCountsPara() {
    objCountRefresh = setInterval(fnSetCountsPara, CountRefreshRate);
    // console.log(`inside fnKeepAssignCountsPara() ${new Date()}`);
}

function fnStopAssignCountsPara() {
    clearInterval(objCountRefresh);
    // console.log(`inside fnStopAssignCountsPara() ${new Date()}`);
}

function fnKeepAssignMaxValuesPara() {
    objMaxValueRefresh = setInterval(fnSetMaxValuePara, MaxValueRefreshRate);
    // console.log(`inside fnKeepAssignMaxValuesPara() ${new Date()}`);
}

function fnStopAssignMaxValuePara() {
    clearInterval(objMaxValueRefresh);
    // console.log(`inside fnStopAssignMaxValuePara() ${new Date()}`);
}

function fnSetLiveParaTags() {
    // $("#1").html(adiMp.get(1));
    // $("#2").html(adiMp.get(2));
    $("#1").html(adiMp.get(1));
    $("#2").html(adiMp.get(2));
    $("#8").html(adiMp.get(8));
    $("#9").html(adiMp.get(9));
    $("#10").html(adiMp.get(10));
    $("#404").html(adiMp.get(404));
    $("#lbl_404_SCM_HiAmbTemp").html(adiMp.get("lbl_404_SCM_HiAmbTemp"));
    $("#lbl_404_SCM_AvgAmbTempHi").html(adiMp.get("lbl_404_SCM_AvgAmbTempHi"));
    $("#lbl_406_LoadSharingAlarm").html(adiMp.get("lbl_406_LoadSharingAlarm"));
    $("#lbl_406_LossOfRed").html(adiMp.get("lbl_406_LossOfRed"));
    $("#lbl_412_livpara").html(adiMp.get(412));

    

    if (adiMp.get(102) != "") {
        $("#101").html(adiMp.get(101));
        $("#102").html(adiMp.get(102));
        $("#109").html(adiMp.get(109));
        $("#110").html(adiMp.get(110));
        $("#111").html(adiMp.get(111));
        $("#112").html(adiMp.get(112));
        $("#113").html(adiMp.get(113));        
        
        $("#lbl_114_OTP").html(adiMp.get("lbl_114_OTP"));
        $("#lbl_114_PowerBoost").html(adiMp.get("lbl_114_PowerBoost"));
        $("#lbl_114_OVP").html(adiMp.get("lbl_114_OVP"));
        $("#lbl_114_SCP").html(adiMp.get("lbl_114_SCP"));

        $("#115").html(adiMp.get(115));
        $("#116").html(adiMp.get(116));
        //$("#m116").html(adiMp.get(116));
        $("#117").html(adiMp.get(117));
        //$("#118").html(adiMp.get(118));
        //$("#119").html(adiMp.get(119));
        //$("#120").html(adiMp.get(120));
        //$("#121").html(adiMp.get(121));
        //$("#122").html(adiMp.get(122));
        //$("#123").html(adiMp.get(123));
        //$("#124").html(adiMp.get(124));
        //$("#125").html(adiMp.get(125));
        //$("#126").html(adiMp.get(126));
        //$("#128").html(adiMp.get(128));
        //$("#129").html(adiMp.get(129));
        //$("#130").html(adiMp.get(130));
        //$("#131").html(adiMp.get(131));
        //$("#400").html(adiMp.get(400));

        $("#lbl_400_InputVoltageHi").html(adiMp.get("lbl_400_InputVoltageHi"));
        $("#lbl_400_InputVoltageLow").html(adiMp.get("lbl_400_InputVoltageLow"));
        $("#lbl_400_OutputCurrentHi").html(adiMp.get("lbl_400_OutputCurrentHi"));
        $("#lbl_400_InternalTempHigh").html(adiMp.get("lbl_400_InternalTempHigh"));
        $("#lbl_400_AvgCurrentHi").html(adiMp.get("lbl_400_AvgCurrentHi"));


        $("#408").html(adiMp.get(408));
        $("#410").html(adiMp.get(410));
    }
    else {
        $("#101").html("");
        $("#102").html("");
        $("#109").html("");
        $("#110").html("");
        $("#111").html("");
        $("#112").html("");
        $("#113").html(""); 
        
        $("#lbl_114_OTP").html("");
        $("#lbl_114_PowerBoost").html("");
        $("#lbl_114_OVP").html("");
        $("#lbl_114_SCP").html("");

        $("#115").html("");
        $("#116").html("");
        //$("#m116").html("");
        $("#117").html("");
        // $("#118").html("");
        // $("#119").html("");
        // $("#120").html("");
        // $("#121").html("");
        // $("#122").html("");
        // $("#123").html("");
        // $("#124").html("");
        // $("#125").html("");
        // $("#126").html("");
        // $("#128").html("");
        // $("#129").html("");
        // $("#130").html("");
        // $("#131").html("");
        //$("#400").html("");
        $("#lbl_400_InputVoltageHi").html("");
        $("#lbl_400_InputVoltageLow").html("");
        $("#lbl_400_OutputCurrentHi").html("");
        $("#lbl_400_InternalTempHigh").html("");
        $("#lbl_400_AvgCurrentHi").html("");


        $("#408").html("");
        $("#410").html("");
    }

    // adiMp.set((`lbl_${item.instance}_OTP`), "");
    // adiMp.set((`lbl_${item.instance}_PowerBoost`),"");
    // adiMp.set((`lbl_${item.instance}_OVP`),"");
    // adiMp.set((`lbl_${item.instance}_SCP`),"");

    if (adiMp.get(202) != "") {
        $("#201").html(adiMp.get(201));
        $("#202").html(adiMp.get(202));
        $("#209").html(adiMp.get(209));
        $("#210").html(adiMp.get(210));
        $("#211").html(adiMp.get(211));
        $("#212").html(adiMp.get(212));
        $("#213").html(adiMp.get(213));

        $("#lbl_214_OTP").html(adiMp.get("lbl_214_OTP"));
        $("#lbl_214_PowerBoost").html(adiMp.get("lbl_214_PowerBoost"));
        $("#lbl_214_OVP").html(adiMp.get("lbl_214_OVP"));
        $("#lbl_214_SCP").html(adiMp.get("lbl_214_SCP"));

        $("#215").html(adiMp.get(215));
        $("#216").html(adiMp.get(216));
        //$("#m216").html(adiMp.get(216));
        $("#217").html(adiMp.get(217));
        // $("#218").html(adiMp.get(218));
        // $("#219").html(adiMp.get(219));
        // $("#220").html(adiMp.get(220));
        // $("#221").html(adiMp.get(221));
        // $("#222").html(adiMp.get(222));
        // $("#223").html(adiMp.get(223));
        // $("#224").html(adiMp.get(224));
        // $("#225").html(adiMp.get(225));
        // $("#226").html(adiMp.get(226));
        // $("#228").html(adiMp.get(228));
        // $("#229").html(adiMp.get(229));
        // $("#230").html(adiMp.get(230));
        // $("#231").html(adiMp.get(231));
        //$("#401").html(adiMp.get(401));

        $("#lbl_401_InputVoltageHi").html(adiMp.get("lbl_401_InputVoltageHi"));
        $("#lbl_401_InputVoltageLow").html(adiMp.get("lbl_401_InputVoltageLow"));
        $("#lbl_401_OutputCurrentHi").html(adiMp.get("lbl_401_OutputCurrentHi"));
        $("#lbl_401_InternalTempHigh").html(adiMp.get("lbl_401_InternalTempHigh"));
        $("#lbl_401_AvgCurrentHi").html(adiMp.get("lbl_401_AvgCurrentHi"));

        $("#409").html(adiMp.get(409));
        $("#411").html(adiMp.get(411));
    }
    else {
        $("#201").html("");
        $("#201").html("");
        $("#202").html("");
        $("#209").html("");
        $("#210").html("");
        $("#211").html("");
        $("#212").html("");
        $("#213").html(""); 
        
        $("#lbl_214_OTP").html("");
        $("#lbl_214_PowerBoost").html("");
        $("#lbl_214_OVP").html("");
        $("#lbl_214_SCP").html("");

        $("#215").html("");
        $("#216").html("");
        //$("#m216").html("");
        $("#217").html("");
        // $("#218").html("");
        // $("#219").html("");
        // $("#220").html("");
        // $("#221").html("");
        // $("#222").html("");
        // $("#223").html("");
        // $("#224").html("");
        // $("#225").html("");
        // $("#226").html("");
        // $("#228").html("");
        // $("#229").html("");
        // $("#230").html("");
        // $("#231").html("");
        //$("#401").html("");

        
        $("#lbl_401_InputVoltageHi").html("");
        $("#lbl_401_InputVoltageLow").html("");
        $("#lbl_401_OutputCurrentHi").html("");
        $("#lbl_401_InternalTempHigh").html("");
        $("#lbl_401_AvgCurrentHi").html("");

        $("#409").html("");
        $("#411").html("");
    }

    // console.log(`inside fnSetLiveParaTags() function under /Parameters/LiveParameter page... ${new Date()}`);
}

function fnSetCountsPara() {
    // console.log(`inside fnSetCountsPara() function under /Parameters/Counts page... ${new Date()}`);
    $("#1").html(adiMp.get(1));
    $("#2").html(adiMp.get(2));

    if (adiMp.get(102) != "") {
        $("#101").html(adiMp.get(101));
        $("#102").html(adiMp.get(102));
        $("#118").html(adiMp.get(118));
        $("#119").html(adiMp.get(119));
        $("#120").html(adiMp.get(120));
        $("#121").html(adiMp.get(121));
        $("#122").html(adiMp.get(122));
        $("#123").html(adiMp.get(123));
    }
    else {
        $("#101").html("");
        $("#102").html("");
        $("#118").html("");
        $("#119").html("");
        $("#120").html("");
        $("#121").html("");
        $("#122").html("");
        $("#123").html("");
    }

    if (adiMp.get(202) != "") {        
        $("#201").html(adiMp.get(201));
        $("#202").html(adiMp.get(202));
        $("#218").html(adiMp.get(218));
        $("#219").html(adiMp.get(219));
        $("#220").html(adiMp.get(220));
        $("#221").html(adiMp.get(221));
        $("#222").html(adiMp.get(222));
        $("#223").html(adiMp.get(223));
    }
    else {       
        $("#201").html("");
        $("#202").html("");
        $("#218").html("");
        $("#219").html("");
        $("#220").html("");
        $("#221").html("");
        $("#222").html("");
        $("#223").html("");
    }
}

function fnSetMaxValuePara() {
    // console.log(`inside fnSetMaxValuePara() function under /Parameters/MaxValues page... ${new Date()}`);
    $("#1").html(adiMp.get(1));
    $("#2").html(adiMp.get(2));
    
    
    
    if (adiMp.get(102) != "") {
        // $("#101").html(adiMp.get(101));
        // $("#102").html(adiMp.get(102));
        $("#mv101").html(adiMp.get(101));
        $("#mv102").html(adiMp.get(102));
        $("#m116").html(adiMp.get(116));
        $("#124").html(adiMp.get(124));
        $("#125").html(adiMp.get(125));
        $("#126").html(adiMp.get(126));
        $("#127").html(adiMp.get(127));
        $("#128").html(adiMp.get(128));
        $("#129").html(adiMp.get(129));
        $("#130").html(adiMp.get(130));
        $("#131").html(adiMp.get(131)); 
        $("#lbl_412_p1mv").html(adiMp.get(412));       
    }
    else {
        // $("#101").html("");
        // $("#102").html("");        
        $("#mv101").html("");
        $("#mv102").html("");
        $("#m116").html("");
        $("#124").html("");
        $("#125").html("");
        $("#126").html("");
        $("#127").html("");
        $("#128").html("");
        $("#129").html("");
        $("#130").html("");
        $("#131").html("");
        $("#lbl_412_p1mv").html("");   
    }

    if (adiMp.get(202) != "") {
        // $("#201").html(adiMp.get(201));
        // $("#202").html(adiMp.get(202));
        $("#mv201").html(adiMp.get(201));
        $("#mv202").html(adiMp.get(202));
        $("#m216").html(adiMp.get(216));
        $("#224").html(adiMp.get(224));
        $("#225").html(adiMp.get(225));
        $("#226").html(adiMp.get(226));
        $("#227").html(adiMp.get(227));
        $("#228").html(adiMp.get(228));
        $("#229").html(adiMp.get(229));
        $("#230").html(adiMp.get(230));
        $("#231").html(adiMp.get(231));
        $("#lbl_412_p2mv").html(adiMp.get(412));    
    }
    else {
        // $("#201").html("");
        // $("#202").html("");
        $("#mv201").html("");
        $("#mv202").html("");
        $("#m216").html("");
        $("#224").html("");
        $("#225").html("");
        $("#226").html("");
        $("#227").html("");
        $("#228").html("");
        $("#229").html("");
        $("#230").html("");
        $("#231").html(""); 
        $("#lbl_412_p2mv").html("");
    }
}

function TempUnitChange(objTg) {
}



