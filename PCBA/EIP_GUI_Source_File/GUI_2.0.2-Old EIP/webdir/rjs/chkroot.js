
const chk_V_url = "/adi/data.json?inst=997&count=1";
var currconfiver = null;
fetch(chk_V_url)
    .then(response => response.json())
    .then(response => {
        //console.log(`response => ${response}`);
        if(response[0] != null || response[0] != undefined){
            currconfiver = parseInt(response[0]);
            //route to approprieat version
            //console.log(`Current configured version => ${response[0]}`)
            sessionStorage.setItem("running_version", response[0]);
            if(currconfiver == 0){
                //console.log(`Redireding to Ph2 version...`);
                location.href = "/web2/index.html"
            }
            else{
                //console.log(`Redireding to Ph1 version...`);                
                location.href = "/web1/index.html"
            }
        }
        else{
            document.getElementById("errmsg").innerText = "An error occurred while fetching version information. Please contact system admin."
        }
});