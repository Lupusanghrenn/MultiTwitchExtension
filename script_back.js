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
flag=0;
init();

function init() {
	nbStream=urls.length;
	chaine = "";
	for (var i = 0; i < urls.length; i++) {
		chaine+=urls[i]+",";
	}
	myajax(chaine,iniUrls);
}

function init2() {
	nbStream=urls.length;
	chaine = "";
	for (var i = 0; i < urls.length; i++) {
		chaine+=urls[i]+",";
	}
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
	urlsOnline=[];
	urlsOffline=[];
	for (var i = 0; i < tabrequest._total; i++) {
		urlsOnline.push(tabrequest['streams'][i]['channel']['name']);
	}

	for (var i = 0; i < urls.length; i++) {
		if (urlsOnline.indexOf(urls[i])==-1) {
			urlsOffline.push(urls[i]);
		}
	}
	if (flag==0) {
		setInterval(checkStreamAjax ,timeInterval);
		console.log("interval set");
	}
	flag=1;
}

function checkStreamAjax(argument) {
	///on vérifie si on a pas rajouté des chaines
	var t = JSON.parse(localStorage['streams']);
	if (nbStream!=t._total) {
		init2();
	}
	myajax(chaine,checkStream);
}

function checkStream(httpRequest) {
	var request = JSON.parse(httpRequest.response);
	console.log(request);
	if (request._total>urlsOnline.length) {
		//quelqu un vient de lancer soon live
		console.log("dans le if");
		displayStream(request);
	}else if (request._total<urlsOnline.length){
		//quelqu un vient de shutdown sont live
		iniUrls(httpRequest);
	}
	console.log("checkStream");
	
}

function displayStream(request) {
	//on crée la notification
	console.log("displayStream");
	for (var i = 0; i < request._total; i++) {
		if(urlsOnline.indexOf(request['streams'][i]['channel']['name'])==-1){
			var name =request['streams'][i]['channel']['display_name'];
			var titre =request['streams'][i]['channel']['status'];
			var icon = request['streams'][i]['channel']['logo'];
			var jeu = request['streams'][i]['channel']['game'];
			new Notification(name+" vient de venir en live", {
				body: titre+'\n'+jeu,
				icon:icon,
				tag:'Multi twitch Extension'});
		}
	}

	//on reconstruit urlOnline et urlOffline
	for (var i = 0; i < request._total; i++) {
		urlsOnline.push(request['streams'][i]['channel']['name']);
	}

	for (var i = 0; i < urls.length; i++) {
		if (urlsOnline.indexOf(urls[i])==-1) {
			urlsOffline.push(urls[i]);
		}
	}
}
//TO DO SELF DESTROY les notiications et améliorer la taille de l'iconeza
//eventuellement display les lives en cours lors du lancement