myid="ufvj1hc6m9qg5txkz9ryvz0hk961cx";
if (localStorage["timeInterval"]==undefined) {
	timeInterval=10000;
	localStorage["timeInterval"]=timeInterval;
}else{
	timeInterval=parseInt(localStorage["timeInterval"]);
}
console.log(timeInterval);

if (localStorage["streams"]==undefined) {
	var t = [];
	t=JSON.stringify(t);
	localStorage["streams"]=t;	
	urls=[];
}else{
	urls=JSON.parse(localStorage['streams']);
}

if (localStorage["multitwitch"]==undefined) {
	multitwitch=true;
} else {
	multitwitch=localStorage["multitwitch"];
}

if (localStorage["notifOnLaunch"]==undefined) {
	notifOnLaunch=true;
} else {
	notifOnLaunch=localStorage["notifOnLaunch"]=="true";
}
var firstLaucnh=true;

urlsOnline=[];
urlsOffline=[];
var allChannelId = [];
flag=0;
//init();
initWebHooks();

function init() {
	nbStream=urls.length;
	chaine = "";
	for (var i = 0; i < urls.length; i++) {
		chaine+=urls[i]+",";
	}
	myajax(chaine,iniUrls);
	chrome.notifications.onClicked.addListener(replyBtnClick);
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
    httpRequest.open("GET", url, true);
    httpRequest.setRequestHeader('Client-ID',myid);
    httpRequest.setRequestHeader("Content-Type", "application/json");
    httpRequest.addEventListener("load", function () {
        callBack(httpRequest);
    });
    httpRequest.send();
}

function myajaxNotif(userid,  callBack) {
    var httpRequest = new XMLHttpRequest();
    var url="https://api.twitch.tv/kraken/users/"+userid+"/notifications/custom?notification_type=streamup&api_version=5";
    //var url="https://api.twitch.tv/kraken/users/"+userid;
    httpRequest.open("GET", url, true);
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

		//test selon le onLauch
		if (notifOnLaunch && firstLaucnh) {
			
			var name =tabrequest['streams'][i]['channel']['display_name'];
			var urlName= tabrequest['streams'][i]['channel']['name'];
			var titre =tabrequest['streams'][i]['channel']['status'];
			var icon = tabrequest['streams'][i]['channel']['logo'];
			var jeu = tabrequest['streams'][i]['channel']['game'];
			var userid=tabrequest['streams'][i]['channel']['_id'];

			if(titre.length>39){
				titre=titre.substring(0,36)+'...';
			}
			if (jeu.length>43) {
				jeu=jeu.substring(0,43);
			}

			var notif = chrome.notifications.create(urlName,{
			  type: "basic",
			  title: name+" just went live",
			  message: titre,
			  contextMessage:jeu,
			  iconUrl: icon,
			});//name = id
			console.log(notif);
		}
	}
	firstLaucnh=false;

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
	//console.log(request);
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
			var urlName= request['streams'][i]['channel']['name'];
			var titre =request['streams'][i]['channel']['status'];
			var icon = request['streams'][i]['channel']['logo'];
			var jeu = request['streams'][i]['channel']['game'];
			var userid=request['streams'][i]['channel']['_id'];
			if(titre.length>39){
				titre=titre.substring(0,36)+'...';
			}
			if (jeu.length>43) {
				jeu=jeu.substring(0,43);
			}

			var notif = chrome.notifications.create(urlName,{
			  type: "basic",
			  title: name+" just went live",
			  message: titre,
			  contextMessage:jeu,
			  iconUrl: icon,
			});//name = id
			console.log(notif);
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

function replyBtnClick(notificationId) {
	//Write function to respond to user action.
	console.log(notificationId);
	chrome.tabs.create({url:'https://www.twitch.tv/'+notificationId});
	chrome.notifications.clear(notificationId);
}

//LES WEBHOOKS
function initWebHooks() {
	var allchan = JSON.parse(localStorage["streams"]);
	var stringChaine = "";
	for (var i = 0; i < allchan.length-1; i++) {
		stringChaine+=allchan[i]+"&login=";
	}
	stringChaine+=allchan[allchan.length-1];
	console.log(stringChaine);
	myajaxUsers(stringChaine);
}

function myajaxUsers(stringChaine) {
	var httpRequest = new XMLHttpRequest();
    var url="https://api.twitch.tv/helix/users?login="+stringChaine;
    httpRequest.open("GET", url, true);
    httpRequest.setRequestHeader('Client-ID',myid);
    httpRequest.setRequestHeader("Content-Type", "application/vnd.twitchtv.v5+json");
    httpRequest.addEventListener("load", function () {
        webhooks(httpRequest);
    });
    httpRequest.send();
}

function myajaxPayload(id){
	var httpRequest = new XMLHttpRequest();
    var url="https://api.twitch.tv/helix/webhooks/hub?user_id="+id;
    httpRequest.open("POST", url, true);
    httpRequest.setRequestHeader('Client-ID',myid);
    httpRequest.setRequestHeader("Content-Type", "application/vnd.twitchtv.v5+json");
    httpRequest.addEventListener("load", function () {
        payloadWebhooks(httpRequest);
    });
    httpRequest.send();
}

function webhooks(httpRequest){
	var test = JSON.parse(httpRequest.responseText);
	console.log(test);
	for (var i = 0; i < test.data.length; i++) {
		allChannelId.push(test.data[i].id);

		//init de webhooks
		myajaxPayload(test.data[i].id);
	}
	console.log(allChannelId);
}

function payloadWebhooks(httpRequest) {
	console.log(httpRequest.response);
}