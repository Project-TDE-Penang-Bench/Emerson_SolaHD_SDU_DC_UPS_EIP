//debugger;
var vrsn = 1;

let dom = new DOMParser();

const getData = (url) => {
  return new Promise((resolve, reject) => {
    let request = new XMLHttpRequest();
    request.onload = function () {
      if (this.readyState === 4 && this.status === 200) {
        resolve(this.responseText);
      } else {
        reject(this.responseText);
      }
    };
    request.open("get", url, true);
    request.send();
  });
};

if(vrsn == 1){
    //$("#version-content").load('web1/index.html');
    //debugger;
    getData("web2/index1.html")
    .then((resolve) => {
        let pageHtml = dom.parseFromString(resolve, "text/html");
        let element = pageHtml.querySelector("whatIWant");
        //console.log(element);
        //document.getElementById("version-content").innerHTML = pageHtml;
        this.document.head = pageHtml.head;
        this.document.body = pageHtml.body;
    })
    .catch((reject) => {
    console.error(reject);
    });
}

function fetchElement(url, selector) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        if (!this.responseXML || !this.responseXML.querySelector) reject("No HTML Document found");
        else resolve(this.responseXML.querySelector(selector));
      }
      xhr.open('GET', url);
      xhr.responseType = 'document';
      xhr.send();
    });
  }