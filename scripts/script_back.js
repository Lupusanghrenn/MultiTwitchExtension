myid="ufvj1hc6m9qg5txkz9ryvz0hk961cx";
if (localStorage["timeInterval"]==undefined) {
	timeInterval=30000;
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
flag=0;
waitForOtherRequest=false;
requestGlobal=[];
tabUsersGlobal=[];
tabJeuGlobal=[];
init();

function init() {
	nbStream=urls.length;
	chaine = "";
	for (var i = 0; i < urls.length; i++) {
		chaine+=urls[i]+"&user_login=";
		if((i+1)%100==0 && i>1){
			waitForOtherRequest=true;
			myajax(chaine,iniUrls,false);
			chaine="";			
		}
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
    httpRequest.setRequestHeader("Content-Type", "application/json");
    httpRequest.addEventListener("load", function () {
    	httpRequest=JSON.parse(httpRequest.response);
    	console.log(async);
    	console.log(httpRequest);
    	if (httpRequest.data.length!=0) {
    		myajaxGames(httpRequest,callBack,async);
    	}else{
    		callBack(httpRequest,[],[]);
    	}
    });
    httpRequest.send();
}

function myajaxGames(request,  callBack,async=true) {
    var httpRequest = new XMLHttpRequest();
    var nomGames="";
    for (var i = 0; i < request.data.length; i++) {
    	nomGames+=request.data[i].game_id+"&id=";
    }
    var url="https://api.twitch.tv/helix/games?id="+nomGames;
    url = url.substring(0,url.length-4);
    httpRequest.open("GET", url, async);
    httpRequest.setRequestHeader('Client-ID',myid);
    httpRequest.setRequestHeader("Content-Type", "application/json");
    httpRequest.addEventListener("load", function () {
    	var tabJeu = [];
    	var jeuR = JSON.parse(httpRequest.response);
    	for (var i = 0; i < jeuR.data.length; i++) {
    		tabJeu.push(jeuR.data[i]);
    	}
        myajaxUsers(request,tabJeu,callBack,async);
    });
    httpRequest.send();
}

function myajaxUsers(request,tabJeu,callBack,async=true) {
	var httpRequest = new XMLHttpRequest();
    var idUser="";
    for (var i = 0; i < request.data.length; i++) {
    	idUser+=request.data[i].user_id+"&id=";
    }
    var url="https://api.twitch.tv/helix/users?id="+idUser;
    url = url.substring(0,url.length-4);
    httpRequest.open("GET", url, async);
    httpRequest.setRequestHeader('Client-ID',myid);
    httpRequest.setRequestHeader("Content-Type", "application/json");
    httpRequest.addEventListener("load", function () {
    	var tabUsers = [];
    	var UserR = JSON.parse(httpRequest.response);
    	for (var i = 0; i < UserR.data.length; i++) {
    		tabUsers.push(UserR.data[i]);
    	}
        callBack(request,tabJeu,tabUsers);
    });
    httpRequest.send();
}

function iniUrls(httpRequest,tabJeu,tabUsers) {
	console.log("iniUrls : "+waitForOtherRequest);
	//merge des request
	if(tabJeuGlobal.length!=0 && requestGlobal.length!=0){
		Array.prototype.push.apply(requestGlobal.data,httpRequest.data);
		if (tabJeu.length!=0) {
			Array.prototype.push.apply(tabJeuGlobal.data,tabJeu);
			Array.prototype.push.apply(tabUsersGlobal.data,tabUsers);
		}		
		
	}else{
		requestGlobal=httpRequest;
		tabJeuGlobal=tabJeu;
		tabUsersGlobal=tabUsers;
	}
	if(!waitForOtherRequest){
		var tabrequest=requestGlobal.data;
		console.log(tabrequest);
		urlsOnline=[];
		urlsOffline=[];
		for (var i = 0; i < tabrequest.length; i++) {

			var thisUser = [];
			for (var j = 0; j < tabUsersGlobal.length; j++) {
				if(tabUsersGlobal[j].id==tabrequest[i]['user_id']){
					thisUser=tabUsersGlobal[j];
					j=10000;
				}
			}

			console.log(thisUser.login);
			urlsOnline.push(thisUser.login);

			//test selon le onLauch
			if (notifOnLaunch && firstLaucnh) {
				var nomjeu ="";
				for (var j = 0; j < tabJeuGlobal.length; j++) {
					if(tabJeuGlobal[j]['id']==tabrequest[i]['game_id']){
						nomjeu=tabJeuGlobal[j]['name'];
						j=10000;
					}
				}

				var name = thisUser.display_name;
				var urlName= thisUser.login;
				var titre = tabrequest[i].title;
				var icon = thisUser.profile_image_url;
				var jeu = nomjeu;


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
}

function checkStreamAjax() {
	///on vérifie si on a pas rajouté des chaines
	requestGlobal=[];
	console.log("checkStreamAjax");
	var t = JSON.parse(localStorage['streams']);
	if (nbStream==t.length) {
		nbStream=urls.length;
		chaine = "";
		for (var i = 0; i < urls.length; i++) {
			//TODO
			chaine+=urls[i]+"&user_login=";
			if((i+1)%100==0 && i>1){
				console.log("allo");
				waitForOtherRequest=true;
				myajax(chaine,checkStream,false);
				chaine="";
				console.log("allo Fin");
			}
		}
	}
	waitForOtherRequest=false;
	myajax(chaine,checkStream,false);
}

function checkStream(request,tabJeu,tabUsers) {
	console.log("checkStream : "+waitForOtherRequest);
	if (waitForOtherRequest) {
		//merge des request
		if(requestGlobal.length ==0){
			requestGlobal=request;
		}else{
			Array.prototype.push.apply(requestGlobal.data,request.data);
		}
	}else{
		console.log(requestGlobal);
		if (requestGlobal.data.length>urlsOnline.length) {
			//quelqu un vient de lancer son live
			console.log("dans le if");
			displayStream(requestGlobal,tabJeuGlobal,tabUsersGlobal);
		}else if (requestGlobal.data.length<urlsOnline.length){
			//quelqu un vient de shutdown son live
			iniUrls(requestGlobal,tabJeuGlobal,tabUsersGlobal);
		}
	}
	console.log("checkStream");	
}

function displayStream(request,tabJeu,tabUsers) {
	//on crée la notification
	console.log("displayStream");
	var tabrequest=request.data;
	for (var i = 0; i < tabrequest.length; i++) {
		var thisUser = [];
		for (var j = 0; j < tabUsers.length; j++) {
			if(tabUsers[j].id==tabrequest[i]['user_id']){
				thisUser=tabUsers[j];
				j=tabUsers.length;
			}
		}

		if(urlsOnline.indexOf(thisUser.login)==-1){

			var nomjeu ="";
			for (var j = 0; j < tabJeu.length; j++) {
				if(tabJeu[j]['id']==tabrequest[i]['game_id']){
					nomjeu=tabJeu[j]['name'];
					j=10000;
				}
			}

			var name = thisUser.display_name;
			var urlName= thisUser.login;
			var titre = tabrequest[i].title;
			var icon = thisUser.profile_image_url;
			var jeu = nomjeu;
			var userid=thisUser.id;
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
	}

	//on reconstruit urlOnline et urlOffline
	urlsOnline=[];
	urlsOffline=[];
	for (var i = 0; i < tabrequest.length; i++) {
		var thisUser = [];
		for (var j = 0; j < tabUsers.length; j++) {
			if(tabUsers[j].id==tabrequest[i]['user_id']){
				thisUser=tabUsers[j];
				j=10000;
			}
		}
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