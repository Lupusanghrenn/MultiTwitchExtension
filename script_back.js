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
			//var titre = " vient de venir en live";
			/*myajaxNotif(userid,function(httpRequest){
				var req = JSON.parse(httpRequest.responseText);
				userid = req.message
			});*/
			if(titre.length>17){
				titre=titre.substring(0,18)+'.';
			}
			if (jeu.length>17) {
				jeu=jeu.substring(0,17);
			}
			var notif = new Notification(name+" just went live", {
				type:'basic',
				body: titre+' - '+jeu,
				icon:icon,
				tag:urlName,
			});
			notif.addEventListener("click",function(event){
				console.log(this);	
				chrome.tabs.create({url:'https://www.twitch.tv/'+this.tag});
				notif.close.bind(notif);
				this.close();
			});
			setTimeout(notif.close.bind(notif),9000);
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
			//var titre = " vient de venir en live";
			/*myajaxNotif(urlName,function(httpRequest){
				var req = JSON.parse(httpRequest.responseText);
				console.log(req);
				console.log(userid);
			});*/
			//récupération des données en ligne via le serveur
			//via un if else selon les choix de l utilisateur (optimisation)
			if(titre.length>20){
				titre=titre.substring(0,20)+'...';
			}
			if (jeu.length>17) {
				jeu=jeu.substring(0,17);
			}
			var notif = new Notification(name+" vient de venir en live", {
				type:'basic',
				body: titre+' - '+jeu,
				icon:icon,
				tag:urlName});
			notif.addEventListener("click",function(event){
				console.log(this);	
				chrome.tabs.create({url:'https://www.twitch.tv/'+this.tag});
				notif.close.bind(notif);
			});
			setTimeout(notif.close.bind(notif),9000);
		}
		/*
		var forumUrl = 'https://example.com/thread/42';
		var options = {
		  type: "basic",
		  title: "NEW THREAD!",
		  message: "I made a new thread blah blah blah",
		  iconUrl: "url_to_small_icon"
		}

		// create notification using forumUrl as id
		chrome.notifications.create(forumUrl, options, function(notificationId){ }); 

		// create a on Click listener for notifications
		chrome.notifications.onClicked.addListener(function(notificationId) {
		  chrome.tabs.create({url: notificationId});
		});  
		*/
		
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