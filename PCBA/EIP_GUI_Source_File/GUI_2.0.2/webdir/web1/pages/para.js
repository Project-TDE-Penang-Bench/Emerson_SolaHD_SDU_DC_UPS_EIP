var paraRefreshInterval = 2000;
var LEDrefreshInterval = 2000;
var count = 0;
var prv_Val;
var inte_count = 0;
var intReqCoutn = 1;
//debugger;
objParaRefresh_1 = setInterval(()=>{
    $("#10").html(dC2dF(mp.get(10)));    
    $("#1").html(mp.get(1)); 
    $("#2").html(mp.get(2));
    $("#3").html(mp.get(3));
    $("#4").html(mp.get(4));
    $("#5").html(mp.get(5));
    $("#6").html(mp.get(6));
    $("#7").html(mp.get(7));    

    if(mp.get(202) != ""){
        $("#201").html(mp.get(201));
        $("#202").html(mp.get(202));
        $("#203").html(mp.get(203));
        $("#204").html(mp.get(204));
        $("#205").html(mp.get(205));
        $("#206").html(mp.get(206));
        $("#207").html(mp.get(207));
        $("#208").html(mp.get(208));
        $("#210").html(mp.get(210));
        $("#209").html(mp.get(209));
        $("#212").html(mp.get(212));
        $("#213").html(mp.get(213));
        $("#214").html(mp.get(214));
        $("#215").html(mp.get(215));
        $("#216").html(mp.get(216));
        $("#217").html(mp.get(217));
        $("#218").html(mp.get(218));
        $("#220").html(mp.get(220));
        $("#221").html(mp.get(221));
        $("#222").html(mp.get(222));
        $("#223").html(mp.get(223));
        $("#224").html(mp.get(224));
        $("#225").html(mp.get(225));
        $("#226").html(mp.get(226));

        $("#227").html(mp.get(227));

        if(mp.get(228) !="") //P1|Max Temp
            $("#228").html(dC2dF(mp.get(228)));

        
        if((mp.get(229) !="") || (mp.get(229) == 0)) //P2|Min Temp
            $("#229").html(dC2dF(mp.get(229)));

        if(mp.get(211) !="") //P2|Temperature
            $("#211").html(dC2dF(mp.get(211)));

        $("#316").html(mp.get(316));
        //$("#317").html(mp.get(317));
        //if(mp.get(317) !="")
        $("#317").html(dC2dF(mp.get(317)));

        $("#401").html(mp.get(401));

        $("#403").html(mp.get(403));
      /*   if(mp.get(403) == 'FF' || mp.get(403) == '01')
            $("#403").prop('checked', true);
        else
            $("#403").prop('checked', false); */
    }
    else{
        //debugger;
        $("#201").html("");
        $("#202").html("");
        $("#203").html("");
        $("#204").html("");
        $("#205").html("");
        $("#206").html("");
        $("#207").html("");
        $("#208").html("");
        $("#209").html("");
        $("#210").html("");
        $("#211").html("");
        $("#212").html("");
        $("#213").html("");
        $("#214").html("");
        $("#215").html("");
        $("#216").html("");
        $("#217").html("");
        $("#218").html("");
        $("#220").html("");
        $("#221").html("");
        $("#222").html("");
        $("#223").html("");
        $("#224").html("");
        $("#225").html("");
        $("#226").html("");
        $("#227").html("");
        $("#228").html("");
        $("#229").html("");
        $("#316").html("");
        $("#317").html("");
        $("#401").html("");
        $("#403").hide();
    }

    if(mp.get(102) != ""){
        $("#101").html(mp.get(101));        
        $("#102").html(mp.get(102));        
        $("#103").html(mp.get(103)); 
        $("#104").html(mp.get(104));
        $("#105").html(mp.get(105));
        $("#106").html(mp.get(106));
        $("#107").html(mp.get(107));
        $("#108").html(mp.get(108));
        $("#109").html(mp.get(109));
        $("#110").html(mp.get(110));
        $("#112").html(mp.get(112));
        $("#113").html(mp.get(113));
        $("#114").html(mp.get(114));
        $("#115").html(mp.get(115));
        $("#116").html(mp.get(116));
        $("#117").html(mp.get(117));
        $("#118").html(mp.get(118));
        $("#120").html(mp.get(120));
        $("#121").html(mp.get(121));
        $("#122").html(mp.get(122));
        $("#123").html(mp.get(123));
        $("#124").html(mp.get(124));
        $("#125").html(mp.get(125));
        $("#126").html(mp.get(126));
        // if(mp.get(126) !="")
        //     $("#126").html(dC2dF(mp.get(126)));

        $("#127").html(mp.get(127));

         if(mp.get(128) !="") //P1|Max Temp
            $("#128").html(dC2dF(mp.get(128)));

        if((mp.get(129) !="") || (mp.get(129) == 0)) //P1|Min Temp
            $("#129").html(dC2dF(mp.get(129)));

        if(mp.get(111) !="") //P1|Temperature
            $("#111").html(dC2dF(mp.get(111)));

        $("#300").html(mp.get(300));

        //$("#301").html(mp.get(301));
        //if(mp.get(301) !="")
        $("#301").html(dC2dF(mp.get(301)));

        $("#400").html(mp.get(400));

        $("#402").html(mp.get(402));
        
    }
    else{
        //debugger;
        $("#101").html("");
        $("#102").html("");
        $("#103").html(""); 
        $("#104").html("");
        $("#105").html("");
        $("#106").html("");
        $("#107").html("");
        $("#108").html("");
        $("#109").html("");
        $("#110").html("");
        $("#111").html("");
        $("#112").html("");
        $("#113").html("");
        $("#114").html("");
        $("#115").html("");
        $("#116").html("");
        $("#117").html("");
        $("#118").html("");
        $("#120").html("");
        $("#121").html("");
        $("#122").html("");
        $("#123").html("");
        $("#124").html("");
        $("#125").html("");
        $("#126").html("");
        $("#127").html("");
        $("#128").html("");
        $("#129").html("");
        $("#300").html("");
        $("#301").html("");
        $("#400").html("");
        $("#402").hide();
    }

}, paraRefreshInterval);


async function fetchLEDStatus(){
    //console.log(`initiate request => #${intReqCoutn} ${new Date().toISOString()}`)
    await $.getJSON('/adi/data.json?inst=8&count=1', function(data) {       
        switch(data[0]){
            case '00':
                $('#led1').css({ fill: '#C0C0C0'});
                $('#led2').css({ fill: '#C0C0C0'});
                break;
            case '01':
                $('#led1').css({ fill: '#C0C0C0'});
                $('#led2').css({ fill: '#008000'});
                break;
            case '02':
                $('#led1').css({ fill: '#C0C0C0'});
                $('#led2').css({ fill: '#CC0000'});
                break;
            case '04':
                $('#led1').css({ fill: '#008000'});
                $('#led2').css({ fill: '#C0C0C0'});
                break;
            case '05':
                $('#led1').css({ fill: '#008000'});
                $('#led2').css({ fill: '#008000'});
                break;
            case '06':
                $('#led1').css({ fill: '#008000'});
                $('#led2').css({ fill: '#CC0000'});
                break;
            case '08':
                $('#led1').css({ fill: '#CC0000'});
                $('#led2').css({ fill: '#C0C0C0'});
                break;
            case '09':
                $('#led1').css({ fill: '#CC0000'});
                $('#led2').css({ fill: '#008000'});
                break;
            case '0A':
                $('#led1').css({ fill: '#CC0000'});
                $('#led2').css({ fill: '#CC0000'});
                break;
            default:
                $('#led1').css({ fill: '#FFFFFF'});
                $('#led2').css({ fill: '#FFFFFF'});
        }
        //console.log(`#${intReqCoutn} ${new Date().toISOString()} '  ' ${data[0]}`);
        //setTimeout(()=>{},LEDrefreshInterval);
        
    })
    .always((rdata)=>{
        
    })
    .fail(function() { 
        //alert("error"); 
        //debugger;
        //$('#header_SCM_Cnn').css({ display: 'block'});
        //console.log("in fail block...")
        $('#led1').css({ fill: '#FFFFFF'});
        $('#led2').css({ fill: '#FFFFFF'});                
        $('#header_SCM_Cnn').css({ display: 'block'});
    }); 
    
    //setInterval(()=>{}, LEDrefreshInterval);
    
}

//fetchLEDStatus();
objFetchLEDStatus_1 = setInterval(()=>{fetchLEDStatus(); }, LEDrefreshInterval);

function fnStopFetchLEDStatus(){
    if (objFetchLEDStatus_1 != null) {
        clearInterval(objFetchLEDStatus_1);
    }
}

function fnStopParaRefresh(){
    if (objParaRefresh_1 != null)
        clearInterval(objParaRefresh_1);
}

