myid="ufvj1hc6m9qg5txkz9ryvz0hk961cx";
if (localStorage["timeInterval"]==undefined) {
	timeInterval=30000;
	localStorage["timeInterval"]=timeInterval;
}else{
	timeInterval=parseInt(localStorage["timeInterval"]);
}
console.log(timeInterval);

if (localStorage["favorites"]==undefined) {
	var t = [];
	t=JSON.stringify(t);
	localStorage["favorites"]=t;	
	urls=[];
}else{
	urls=JSON.parse(localStorage['favorites']);
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
flag=0;
waitForOtherRequest=false;
requestGlobal=[];
init();

function init() {
	nbStream=urls.length;
	chaine = "";
	token="Bearer "+localStorage.token;
	for (var i = 0; i < urls.length; i++) {
		chaine+=urls[i]+"&user_login=";
	}
	waitForOtherRequest=false;
	myajax(chaine,iniUrls,false);
	chrome.notifications.onClicked.addListener(replyBtnClick);
}

function myajax(nomChaine,  callBack,async=true) {
    var httpRequest = new XMLHttpRequest();
    var url="https://api.twitch.tv/helix/streams?user_login="+nomChaine;
    url = url.substring(0,url.length-12);
    httpRequest.open("GET", url, async);
	httpRequest.setRequestHeader('Client-ID',myid);
	httpRequest.setRequestHeader("Authorization",token);
    httpRequest.setRequestHeader("Content-Type", "application/json");
    httpRequest.addEventListener("load", function () {
    	httpRequest=JSON.parse(httpRequest.response);
    	console.log(async);
    	console.log(httpRequest);
    	callBack(httpRequest,[],[]);
    });
    httpRequest.send();
}

function myajaxUsers(thisUser,callBack) {
	var httpRequest = new XMLHttpRequest();
    var url="https://api.twitch.tv/helix/users?id="+thisUser.user_id;
    httpRequest.open("GET", url, true);
	httpRequest.setRequestHeader('Client-ID',myid);
	httpRequest.setRequestHeader("Authorization",token);
    httpRequest.setRequestHeader("Content-Type", "application/json");
    httpRequest.addEventListener("load", function () {
        callBack(thisUser,JSON.parse(httpRequest.responseText));
    });
    httpRequest.send();
}

function iniUrls(httpRequest) {
	console.log("iniUrls : "+waitForOtherRequest);

	requestGlobal=httpRequest;
	
	var tabrequest=requestGlobal.data;
	console.log(tabrequest);
	urlsOnline=[];
	urlsOffline=[];
	for (var i = 0; i < tabrequest.length; i++) {

		//console.log(thisUser.login);
		urlsOnline.push(tabrequest[i].user_login);

		//test selon le onLauch
		if (notifOnLaunch && firstLaucnh) {
			myajaxUsers(tabrequest[i],createNotif);
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
		console.log("interval set : "+ timeInterval);
	}
	flag=1;
	
}

function checkStreamAjax() {
	///on vérifie si on a pas rajouté des chaines
	requestGlobal=[];
	console.log("checkStreamAjax");
	var t = JSON.parse(localStorage['favorites']);
	if (nbStream==t.length) {
		nbStream=urls.length;
		chaine = "";
		for (var i = 0; i < urls.length; i++) {
			chaine+=urls[i]+"&user_login=";
		}
	}
	waitForOtherRequest=false;
	myajax(chaine,checkStream,false);
}

function checkStream(request) {
	requestGlobal=request;
	console.log(requestGlobal);
	if (requestGlobal.data.length>urlsOnline.length) {
		//quelqu un vient de lancer son live
		console.log("dans le if");
		displayStream(requestGlobal);
	}else if (requestGlobal.data.length<urlsOnline.length){
		//quelqu un vient de shutdown son live
		iniUrls(requestGlobal);
	}
	console.log("checkStream");	
}

function createNotif(thisUser,UserRequest){
	var name = thisUser.user_name;
	var urlName= thisUser.user_login;
	var titre = thisUser.title;
	var icon = UserRequest.data[0].profile_image_url;;
	var jeu = thisUser.game_name;
	var userid=thisUser.user_id;
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
	});
	console.log(notif);
}

function displayStream(request) {
	//on crée la notification
	console.log("displayStream");
	var tabrequest=request.data;
	for (var i = 0; i < tabrequest.length; i++) {
		if(urlsOnline.indexOf(tabrequest[i].user_login)==-1){
			var thisUser = tabrequest[i];
			myajaxUsers(thisUser,createNotif);
		}		
	}

	//on reconstruit urlOnline et urlOffline
	urlsOnline=[];
	urlsOffline=[];
	for (var i = 0; i < tabrequest.length; i++) {
		urlsOnline.push(thisUser.login);
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