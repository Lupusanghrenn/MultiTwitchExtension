//idapp = "jfaoecnmdknjhbjadnpifengnndehddh"

myid="ufvj1hc6m9qg5txkz9ryvz0hk961cx";
row = document.getElementById("afficher");
//var extensionID="obpmmenioddcpffdelecfoogjomfhekm";//online
var extensionID="jfaoecnmdknjhbjadnpifengnndehddh";//local

//Initialisation des valeurs
if (localStorage["showOffline"]==undefined) {
	localStorage["showOffline"]="true";	
}

if (localStorage["optimisation"]==undefined) {
	localStorage["optimisation"]="true";
}

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

showOffline=localStorage["showOffline"]=="true";
optimisation=localStorage["optimisation"]=="true";

arrayStream=[];

document.getElementsByTagName('body');
window.onload=init();

function init(){
	bouton=document.getElementById('refresh');
	bouton.innerHTML=chrome.i18n.getMessage("refresh");
	bouton.addEventListener('click',afficherStream);
	if (urls.length!=0) {afficherStream();}
	else {
		cleanAffichage();
		var div = document.createElement("div");
		div.class="col-md-12";
		div.innerHTML="<p class='text-justify'>"+chrome.i18n.getMessage("noSavedChannel")+"</p>"
		row.appendChild(div);
	}
	boutonMulti = document.getElementById('multi');
	boutonMulti.innerHTML=chrome.i18n.getMessage("lauchMultiTwitch");
	boutonMulti.addEventListener('click',lauchMulti);

	boutonAdd = document.getElementById('addCurrent');
	boutonAdd.innerHTML=chrome.i18n.getMessage("addCurrentChannel");
	boutonAdd.addEventListener('click',getTabs);

	boutonOption=document.getElementById("options");
	boutonOption.innerHTML=chrome.i18n.getMessage("option");
	boutonOption.addEventListener('click',goToOption);

	divTexteOnline=document.getElementById("online");
	divTexteOnline.innerHTML=chrome.i18n.getMessage("online");
}

function lauchMulti() {
	var tab=document.getElementsByTagName('input');
	if (multitwitch=="false") {
		//lauch sur miltitwitch
		var chaine = "http://www.multitwitch.tv/";
	} else {
		var chaine = "https://multistre.am/";
	}
	var chainebis="/";
	for (var i = 0; i < tab.length; i++) {
		if (tab[i].checked) {
			console.log(tab[i]);
			//si check on ajoute
			chaine+=tab[i].value+"/";
			chainebis+=tab[i].value+"/";
		}
	}

	console.log(chaine);
	//maintenant on redirige vers le multitwitch
	localStorage["chaine"]=JSON.stringify(chaine);
	localStorage["chainebis"]=JSON.stringify(chainebis);

	chrome.tabs.query({ currentWindow: true, active: true },lauchMultiAsync);
	chrome.tabs.create({ url: chaine });
}

function lauchMultiAsync(tab){
	console.log(tab);
	var chaine=JSON.parse(localStorage["chaine"]);
	var chainebis=JSON.parse(localStorage["chainebis"]);
	var compteurslash=0;
	for (var i = 0; i < tab[0]["url"].length; i++) {
		if(tab[0]["url"][i]=='/'){
			compteurslash++;
		}
		if (compteurslash==3) {
			break;
		}
	}
	var site = tab[0]["url"].substring(0,i);
	console.log("Site : "+site);

	console.log(site=="https://multistre.am");
	if (tab[0]["url"]=="chrome://newtab/" || tab[0]["url"]=="https://www.google.com/") {
		//tabs dans le meme onglet
		chrome.tabs.update({ url: chaine });
	}else if(site=="https://multistre.am" || site=="http://www.multitwitch.tv"){
		//deja sur multitwitch
		chrome.tabs.update({url:tab[0]["url"]+chainebis});
	}else{
		console.log("Dans le else");
		chrome.tabs.create({ url: chaine });
	}	
}

function lauchAsync(tab){
	console.log(tab);
	var compteurslash=0;
	chaine=localStorage["id"];

	for (var i = 0; i < tab[0]["url"].length; i++) {
		if(tab[0]["url"][i]=='/'){
			compteurslash++;
		}
		if (compteurslash==3) {
			break;
		}
	}
	var site = tab[0]["url"].substring(0,i);
	console.log("Site : "+site);

	if (tab[0]["url"]=="chrome://newtab/" || tab[0]["url"]=="https://www.google.com/") {
		//tabs dans le meme onglet
		chrome.tabs.update({ url: chaine });
	}else{
		console.log("Dans le else");
		chrome.tabs.create({ url: chaine });
	}
}


function myajax(nomChaine,  callBack) {
    var httpRequest = new XMLHttpRequest();
    var url="https://api.twitch.tv/helix/streams?user_login="+nomChaine;
    httpRequest.open("GET", url, true);
    httpRequest.setRequestHeader('Client-ID',myid);
    httpRequest.setRequestHeader("Content-Type", "application/json");
    httpRequest.addEventListener("load", function () {
        callBack(httpRequest,nomChaine);
    });
    httpRequest.send();
}

function myajax2(nomChaine, callBack) {
    var httpRequest = new XMLHttpRequest();
    var url="https://api.twitch.tv/kraken/channels/"+nomChaine;
    httpRequest.open("GET", url, false);
    httpRequest.setRequestHeader('Client-ID',myid);
    httpRequest.setRequestHeader("Content-Type", "application/json");
    httpRequest.addEventListener("load", function () {
        callBack(httpRequest,nomChaine);
    });
    httpRequest.send();
}

function retour(httpRequest,nomChaine){
	arrayStream.push([nomChaine,JSON.parse(httpRequest.responseText)]);
}

function afficherStream(){	
	var channelString="";
	for (var i = 0; i < urls.length; i++) {
		channelString+=urls[i]+"&user_login=";
	}
	channelString =channelString.substr(0,channelString.length-12);
	myajax(channelString,returnHttpRequest);
}

function listenerClick(event){
	console.log(event);
	idFound=false;
	index=0;
	while(index<event.path.length && !idFound){
		if(event.path[index].id.substr(0,5)=="https"){
			idFound=true;
		}else{
			index++;
		}
	}
	console.log(event.path[index].id);
	localStorage['id']=event.path[index].id;

	chrome.tabs.query({ currentWindow: true, active: true },lauchAsync);
}

function displayStreamAsync(request){

	if (request.data.length==0) {
		var div = document.createElement("div");
		div.setAttribute("class","col-xs-12 text-center");
		div.style.margin="3px 0";
		div.innerHTML=chrome.i18n.getMessage("noChannelOnline");
		row.appendChild(div);
	}else{
		//il faut stocker tout les jeux actuellement en ligne
		console.log("Nombre de streeam en live : "+request.data.length);
		var tabJeu = [];
		var jeux ="";
		for (var i = 0; i < request.data.length-1; i++) {
			jeux+=request.data[i].game_id+"&id=";
		}
		jeux+=request.data[request.data.length-1].game_id;
		var httpRequest = new XMLHttpRequest();
	    var url="https://api.twitch.tv/helix/games?id="+jeux;
	    httpRequest.open("GET", url, true);
	    httpRequest.setRequestHeader('Client-ID',myid);
	    httpRequest.setRequestHeader("Content-Type", "application/json");
	    httpRequest.addEventListener("load", function () {
	    	var jeuR = JSON.parse(httpRequest.response);
	    	for (var i = 0; i < jeuR.data.length; i++) {
	    		tabJeu.push(jeuR.data[i]);
	    	}
	        displayStreamAsyncUser(request,tabJeu);
	    });
	    httpRequest.send();
	}
}

function displayStreamAsyncUser(request,tabJeu){
	//il faut stocker tout les jeux actuellement en ligne
	var tabUsers = [];
	var users ="";
	for (var i = 0; i < request.data.length-1; i++) {
		users+=request.data[i].user_id+"&id=";
	}
	users+=request.data[request.data.length-1].user_id;
	var httpRequest = new XMLHttpRequest();
	var url="https://api.twitch.tv/helix/users?id="+users;
	httpRequest.open("GET", url, true);
	httpRequest.setRequestHeader('Client-ID',myid);
	httpRequest.setRequestHeader("Content-Type", "application/json");
	httpRequest.addEventListener("load", function () {
		var userR = JSON.parse(httpRequest.response);
		for (var i = 0; i < userR.data.length; i++) {
			tabUsers.push(userR.data[i]);
		}
	    displayStreamAsyncGames(request,tabJeu,tabUsers);
	});
	httpRequest.send();
	}

function displayStreamAsyncGames(request,tabJeu, tabUsers){
	cleanAffichage();

	for (i = 0; i < request.data.length; i++) {
		//selection depuis tabUsers
		var thisUser = [];
		for (var j = 0; j < tabUsers.length; j++) {
			if(tabUsers[j].id==request.data[i]['user_id']){
				thisUser=tabUsers[j];
				j=10000;
			}
		}

		var div = document.createElement("div");
		div.setAttribute("class","col-xs-12");
		div.style.margin="3px 0";
		var url="https://www.twitch.tv/"+thisUser["login"];

		//col-xs-3
		var divImage = document.createElement("div");
		divImage.setAttribute("class","col-xs-3");
		divImage.style.paddingLeft="0px";
		divImage.id=url;
		divImage.addEventListener("click", listenerClick,false);
		var image = document.createElement('img');
		image.src=thisUser.profile_image_url;
		image.setAttribute("class","img-responsive");
		image.style.width="50px";
		image.style.height="50px";

		//ajout col-xs-3
		divImage.appendChild(image);
		div.appendChild(divImage);

		//col-xs-7
		var divxs7=document.createElement('div');
		divxs7.setAttribute("class","col-xs-8");
		divxs7.id=url;
		divxs7.addEventListener("click", listenerClick,false);
		var row1=document.createElement('div');
		row1.setAttribute("class","row");
		var div1=document.createElement('div');
		div1.id=url;
		div1.setAttribute("class","col-xs-9 ellipsis");
		div1.style.paddingLeft="0px";

		//suite
		var nomjeu ="";
		for (var j = 0; j < tabJeu.length; j++) {
			if(tabJeu[j]['id']==request.data[i]['game_id']){
				nomjeu=tabJeu[j]['name'];
				j=10000;
			}
		}
		div1.innerHTML=request.data[i]['user_name']+" - <i class='tw-live-indicator'>"+nomjeu;
		
		//nombre de viewer
		var divViewer= document.createElement("div");
		divViewer.setAttribute("class","col-xs-3 pull-right divViewer");
		var spanViewer=document.createElement("span");
		spanViewer.setAttribute("class","pull-right");
		spanViewer.style.color="rgb(137, 131, 149)";
		spanViewer.innerHTML=request.data[i]["viewer_count"];
		divViewer.appendChild(spanViewer);
		var divPoint=document.createElement("div");
		divPoint.setAttribute("class","pointTwitch pointTwitch--red pull-right");
		divViewer.appendChild(divPoint);


		row1.appendChild(div1);
		row1.appendChild(divViewer);
		divxs7.appendChild(row1);

		var row1=document.createElement('div');
		row1.setAttribute("class","row");
		var div1=document.createElement('div');
		div1.setAttribute("class","col-xs-12 ellipsis");
		div1.innerHTML=request.data[i]['title'];
		//ajout
		row1.appendChild(div1);
		divxs7.appendChild(row1);
		div.appendChild(divxs7);

		//col-xs-1 checkbox
		var divxs1=document.createElement('div');
		divxs1.setAttribute("class","col-xs-1");
		var input = document.createElement("input");
		input.type="checkbox";
		input.name=thisUser["login"];
		input.value=thisUser["login"];
		//ajout
		divxs1.appendChild(input);
		div.appendChild(divxs1);

		row.appendChild(div);
	}
	var br=document.createElement('br');
	div.appendChild(br);
	

	if(showOffline){
		
		//offline
		var p = document.createElement("p");
		p.setAttribute("class","col-xs-12 text-center back-white");
		p.innerHTML="OFFLINE"
		row.appendChild(p);

		if (optimisation) {
			for (var i = 0; i < urlsOffline.length; i++) {
				var div = document.createElement("div");
				div.class="col-md-12";
				div.innerHTML="<p class='text-center'>"+urlsOffline[i]+"- Offline</p>";
				row.appendChild(div);
			}
		} else {
			for (var i = 0; i < urlsOffline.length; i++) {
				myajax2(urlsOffline[i],returnOffline);
				var div = document.createElement("div");
				div.class="col-md-12";
				div.innerHTML="<p class='text-center'>"+requestOffline['display_name']+"- Offline</p>";
				row.appendChild(div);
			}
		}		
	}
}

function cleanAffichage(){
	row.innerHTML='';
	var online = document.createElement("p");
	online.setAttribute("class","text-center");
	online.style.backgroundColor="white";
	online.style.color="black";
	online.innerHTML=chrome.i18n.getMessage("online");;
	row.appendChild(online);
}

function returnHttpRequest(httpRequest){
	request=JSON.parse(httpRequest.responseText);
	
	urlsOffline=[];
	for (var i = 0; i < urls.length; i++) {
		var isOnline=false;
		for (var j = 0; j < request._total&!isOnline; j++) {
			if(request["streams"][j]["channel"]["name"]==urls[i]){
				//on retire la chaine
				isOnline=true;
			}
		}
		if (!isOnline) {urlsOffline.push(urls[i]);}
	}
	displayStreamAsync(request);
	//on enelve les chaines en live
	
}

function returnOffline(httpRequest){
	requestOffline=JSON.parse(httpRequest.responseText);
}

function getTabs(){
	chrome.tabs.query({ currentWindow: true, active: true },getCurrent);
}

function getTabs2(){
	chrome.tabs.query({ currentWindow: true, active: true },WatchCurrent);
}

function getCurrent(tab) {
	tabUrl = tab[0]['url'];
	var slash =false;

	//on récupère la fin du site (apres le dernier / )
	for (var i = (tabUrl.length - 1); i >= 0 && !slash; i--) {
		if(tabUrl[i]=="/"){
			slash=true;
			console.log(i);
		}
	}
	index=i+1;
	var name = tabUrl.substring(index+1, tabUrl.length);

	//on récupère maintenant le 'site' pour voir si c est twitch
	slash=false;
	for (i = 0; i < tabUrl.length-2; i++) {
		if(tabUrl[i]==':'&&tabUrl[i+1]=='/'&&tabUrl[i+2]=='/'){
			var indexsite=i+3;
			break;
		}
	}
	var site = tabUrl.substring(indexsite, index);
	console.log(site);

	//test si site est twitch
	if (site=='go.twitch.tv'||site=='www.twitch.tv') {
		console.log('surtwitch');
		if (!urls.includes(name)) {
			console.log(name);
			//on test enfin si la chaine existe
			myajax2(name,saveTab);
		}else{
			alert(chrome.i18n.getMessage("alreadyAddedChannel"));
		}
	}else{
		alert(chrome.i18n.getMessage("notATwitchChannel"));
	}

}

function saveTab(event) {
	var reponse = JSON.parse(event.responseText);
	console.log(reponse);
	if (reponse["error"]==null) {
		urls.push(reponse['name']);
		localStorage['streams']=JSON.stringify(urls);
		afficherStream();
	}else{
		alert(chrome.i18n.getMessage("FeedbackUserUnknow"));
	}
}

function goToOption(){
	console.log("goToOption");
	chrome.tabs.create({url:"page_option.html"});
}

function WatchCurrent(tab) {
	//send message et attente de la réponse
	chrome.runtime.sendMessage(extensionID,"install",function(response){
		console.log(response);
		console.log(chrome.runtime.lastError);
		if(response=="installed"){
			extensionIsInstalled(tab);
		}else{
			extensionIsNotInstalled();
		}
	});

}

function extensionIsInstalled(tab){
	//on récupère maintenant le 'site' pour voir si c est twitch
	tabUrl = tab[0]['url'];
	var slash =false;

	for (i = 0; i < tabUrl.length-2; i++) {
		if(tabUrl[i]==':'&&tabUrl[i+1]=='/'&&tabUrl[i+2]=='/'){
			var indexsite=i+3;
			break;
		}
	}
	//on récupère la fin du site (apres le dernier / )
	for (var i = (tabUrl.length - 1); i >= 0 && !slash; i--) {
		if(tabUrl[i]=="/"){
			slash=true;
			console.log(i);
		}
	}
	index=i+1;
	var name = tabUrl.substring(index+1, tabUrl.length);

	//on récupère maintenant le 'site' pour voir si c est twitch
	slash=false;
	for (i = 0; i < tabUrl.length-2; i++) {
		if(tabUrl[i]==':'&&tabUrl[i+1]=='/'&&tabUrl[i+2]=='/'){
			var indexsite=i+3;
			break;
		}
	}
	var site = tabUrl.substring(indexsite, index);
	console.log(site);
	console.log("Name : "+name);

	


	//SI CACHE COCHE
	var tabInput=document.getElementsByTagName('input');
	var countInputChecked=0;
	for (var i = 0; i < tabInput.length; i++) {
		if(tabInput[i].checked){
			countInputChecked++;
		}
	}
	console.log("countInputChecked : "+countInputChecked);

	if (countInputChecked>=1) {
		if (countInputChecked==1) {
			//SI UNE SEULE player.twitch
			var nomChaine="";
			i=0;
			while(nomChaine==""){
				if(tabInput[i].checked){
					nomChaine=tabInput[i].value;
				}
				i++;
			}

			chrome.runtime.sendMessage(extensionID,"http://player.twitch.tv?channel="+nomChaine);

		}else{
			//Sinon multitwitch
			if (multitwitch=="false") {
				//lauch sur miltitwitch
				var chaine = "http://www.multitwitch.tv/";
			} else {
				var chaine = "https://multistre.am/";
			}
			
			for (var i = 0; i < tabInput.length; i++) {
				if (tabInput[i].checked) {
					//si check on ajoute
					chaine+=tabInput[i].value+"/";
				}
			}
			chrome.runtime.sendMessage(extensionID,chaine);
		}


	}else if(site=="https://www.twitch.tv" && name!=""){
		//else SI TWITCH
		chrome.runtime.sendMessage(extensionID,"http://player.twitch.tv?channel="+nomChaine);
	}else{
		//ELSE ALERT
		alert(chrome.i18n.getMessage("alertMultiTwitchApp"));
	}
}

function extensionIsNotInstalled(){
	console.log("extensionIsNotInstalled");
	if(confirm(chrome.i18n.getMessage("AppNotInstalled"))){
		chrome.tabs.create({url:"https://chrome.google.com/webstore/detail/multi-twitch-app/obpmmenioddcpffdelecfoogjomfhekm"});
	}
}