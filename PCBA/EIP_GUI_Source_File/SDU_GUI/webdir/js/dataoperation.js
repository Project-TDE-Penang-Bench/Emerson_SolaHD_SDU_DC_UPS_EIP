var inputJSON = {}, inputData;
var adiMp = new Map();
var AdiCount = 10;
var urlMetadata = `/adi/metadata2.json?offset=0&count=${AdiCount}`
var urlData = `/adi/data.json?offset=0&count=${AdiCount}`
var refreshInterval = 2000; // milisecond


