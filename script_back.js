windows.onload=init();
myid="ufvj1hc6m9qg5txkz9ryvz0hk961cx";
timeInterval=10000;

if (localStorage["streams"]==undefined) {
	var t = [];
	t=JSON.stringify(t);
	localStorage["streams"]=t;	
	urls=[];
}else{
	urls=JSON.parse(localStorage['streams']);
}
urlsOnline=[];
urlsOffline=[];

function init() {
	chaine = "";
	for (var i = 0; i < urls.length; i++) {
		chaine+=urls[i]
	}
	myajax(chaine,iniUrls);
}

function myajax(nomChaine,  callBack) {
    var httpRequest = new XMLHttpRequest();
    var url="https://api.twitch.tv/kraken/streams?channel="+nomChaine;
    httpRequest.open("GET", url, false);
    httpRequest.setRequestHeader('Client-ID',myid);
    httpRequest.setRequestHeader("Content-Type", "application/json");
    httpRequest.addEventListener("load", function () {
        callBack(httpRequest);
    });
    httpRequest.send();
}

function iniUrls(httpRequest) {
	var tabrequest=JSON.parse(httpRequest.response);
	for (var i = 0; i < tabrequest._total; i++) {
		urlsOnline.push(tabrequest['streams'][i]['channel']['name']);
	}

	for (var i = 0; i < urls.length; i++) {
		if (!urlsOnline.contains(urls)) {
			urlsOnline.push(urls[i]);
		}
	}

	console.log(urlsOnline);
	console.log(urlsOffline);

	setInterval(checkStreamAjax,timeInterval);
}

function checkStreamAjax(argument) {
	myajax(chaine,checkStream);
}

function checkStream(argument) {
	// TO DO
	console.log(urlsOnline);
	console.log(urlsOffline );
}