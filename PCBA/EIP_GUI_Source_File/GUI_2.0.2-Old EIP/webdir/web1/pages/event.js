var eventRefreshInterval = 1000;

setInterval(()=>{
    //debugger;
    if(mp.get(130) != "N/A"){
        $("#130").html(mp.get(130));
        $("#131").html(mp.get(131));
        $("#132").html(mp.get(132));
    }
    else{
        $("#130").html(mp.get(130));
        $("#131").html("");
        $("#132").html("");
    }

    if(mp.get(133) != "N/A"){
        $("#133").html(mp.get(133));
        $("#134").html(mp.get(134));
        $("#135").html(mp.get(135));
    }
    else{
        $("#133").html(mp.get(133));
        $("#134").html("");
        $("#135").html("");
    }

    if(mp.get(136) != "N/A"){
        $("#136").html(mp.get(136));
        $("#137").html(mp.get(137));
        $("#138").html(mp.get(138));
    }
    else{
        $("#136").html(mp.get(136));
        $("#137").html("");
        $("#138").html("");       
    }

    if(mp.get(230) != "N/A"){
        $("#230").html(mp.get(230));
        $("#231").html(mp.get(231));
        $("#232").html(mp.get(232));
    }
    else{
        $("#230").html(mp.get(230));
        $("#231").html("");
        $("#232").html("");
    }

    if(mp.get(233) != "N/A"){
        $("#233").html(mp.get(233));
        $("#234").html(mp.get(234));
        $("#235").html(mp.get(235));
    }
    else{
        $("#233").html(mp.get(233));
        $("#234").html("");
        $("#235").html("");
    }
    
    if(mp.get(236) != "N/A"){
        $("#236").html(mp.get(236));
        $("#237").html(mp.get(237));
        $("#238").html(mp.get(238));
    }
    else{
        $("#236").html(mp.get(236));
        $("#237").html("");
        $("#238").html("");
    }

}, eventRefreshInterval);