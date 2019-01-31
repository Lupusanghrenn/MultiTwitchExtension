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
init();

function init() {
	nbStream=urls.length;
	chaine = "";
	for (var i = 0; i < urls.length; i++) {
		chaine+=urls[i]+"&user_login=";
	}
	myajax(chaine,iniUrls);
	chrome.notifications.onClicked.addListener(replyBtnClick);
}

function init2() {
	nbStream=urls.length;
	chaine = "";
	for (var i = 0; i < urls.length; i++) {
		chaine+=urls[i]+"&user_login=";
	}
}

function myajax(nomChaine,  callBack) {
    var httpRequest = new XMLHttpRequest();
    var url="https://api.twitch.tv/helix/streams?user_login="+nomChaine;
    url = url.substring(0,url.length-12);
    httpRequest.open("GET", url, true);
    httpRequest.setRequestHeader('Client-ID',myid);
    httpRequest.setRequestHeader("Content-Type", "application/json");
    httpRequest.addEventListener("load", function () {
    	httpRequest=JSON.parse(httpRequest.response);
        myajaxGames(httpRequest,callBack);
    });
    httpRequest.send();
}

function myajaxGames(request,  callBack) {
    var httpRequest = new XMLHttpRequest();
    var nomGames="";
    for (var i = 0; i < request.data.length; i++) {
    	nomGames+=request.data[i].game_id+"&id=";
    }
    var url="https://api.twitch.tv/helix/games?id="+nomGames;
    url = url.substring(0,url.length-4);
    httpRequest.open("GET", url, true);
    httpRequest.setRequestHeader('Client-ID',myid);
    httpRequest.setRequestHeader("Content-Type", "application/json");
    httpRequest.addEventListener("load", function () {
    	var tabJeu = [];
    	var jeuR = JSON.parse(httpRequest.response);
    	for (var i = 0; i < jeuR.data.length; i++) {
    		tabJeu.push(jeuR.data[i]);
    	}
        myajaxUsers(request,tabJeu,callBack);
    });
    httpRequest.send();
}

function myajaxUsers(request,tabJeu,callBack) {
	var httpRequest = new XMLHttpRequest();
    var idUser="";
    for (var i = 0; i < request.data.length; i++) {
    	idUser+=request.data[i].user_id+"&id=";
    }
    var url="https://api.twitch.tv/helix/users?id="+idUser;
    url = url.substring(0,url.length-4);
    httpRequest.open("GET", url, true);
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
	var tabrequest=httpRequest.data;
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

		console.log(thisUser.login);
		urlsOnline.push(thisUser.login);

		//test selon le onLauch
		if (notifOnLaunch && firstLaucnh) {
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
		console.log("interval set");
	}
	flag=1;
}

function checkStreamAjax(argument) {
	///on vérifie si on a pas rajouté des chaines
	var t = JSON.parse(localStorage['streams']);
	if (nbStream!=t.length) {
		init2();
	}
	myajax(chaine,checkStream);
}

function checkStream(request,tabJeu,tabUsers) {
	if (request.data.length>urlsOnline.length) {
		//quelqu un vient de lancer son live
		console.log("dans le if");
		displayStream(request,tabJeu,tabUsers);
	}else if (request.data.length<urlsOnline.length){
		//quelqu un vient de shutdown son live
		iniUrls(request,tabJeu,tabUsers);
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