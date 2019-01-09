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



//texte=document.getElementById('titre');
//texte.addEventListener('click',mesStreams(urls));

arrayStream=[];

document.getElementsByTagName('body');
window.onload=init();
//mesStreams(urls);

function init(){
	bouton=document.getElementById('refresh');
	bouton.innerHTML=chrome.i18n.getMessage("refresh");
	bouton.addEventListener('click',afficherStream);
	//cleanAffichage();
	if (urls.length!=0) {afficherStream();}
	else {
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

	/*boutonWatch = document.getElementById('watchCurrent');
	boutonWatch.addEventListener('click',getTabs2);*/
}

//myajax("https://api.twitch.tv/kraken/streams/ogaminglol",retour,urls);

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
			//si check on ajoute
			chaine+=tab[i].value+"/";
			chainebis+=tab[i].value+"/";
		}
	}

	//maintenant on redirige vers le multitwitch
	localStorage["chaine"]=JSON.stringify(chaine);
	localStorage["chainebis"]=JSON.stringify(chainebis);

	chrome.tabs.query({ currentWindow: true, active: true },lauchMultiAsync);
	// chrome.tabs.create({ url: chaine });
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
    var url="https://api.twitch.tv/kraken/streams?channel="+nomChaine;
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
	//arrayStream[nomChaine]=(JSON.parse(httpRequest.responseText));
}

function afficherStream(){	
	var channelString="";
	for (var i = 0; i < urls.length; i++) {
		channelString+=urls[i]+",";
	}
	channelString =channelString.substr(0,channelString.length-1);
	myajax(channelString,returnHttpRequest);
}

function listenerClick(event){
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

	//chrome.tabs.create({url:this.id});
	chrome.tabs.query({ currentWindow: true, active: true },lauchAsync);
}

function displayStreamAsync(request){

	if (request._total==0) {
		var div = document.createElement("div");
		div.setAttribute("class","col-xs-12 text-center");
		div.style.margin="3px 0";
		div.innerHTML=chrome.i18n.getMessage("nChannelOnline");
		row.appendChild(div);
	}
	//console.log(request);

	for (i = 0; i < request._total; i++) {
		var div = document.createElement("div");
		div.setAttribute("class","col-xs-12");
		div.style.margin="3px 0";
		var url=request["streams"][i]["channel"]["url"];

		//col-xs-3
		var divImage = document.createElement("div");
		divImage.setAttribute("class","col-xs-3");
		divImage.style.paddingLeft="0px";
		divImage.id=url;
		divImage.addEventListener("click", listenerClick,false);
		var image = document.createElement('img');
		image.src=request["streams"][i]["channel"]['logo'];
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
		div1.innerHTML=request["streams"][i]["channel"]['display_name']+" - <i class='tw-live-indicator'>"+request['streams'][i]['game'];
		
		//nombre de viewer
		var divViewer= document.createElement("div");
		divViewer.setAttribute("class","col-xs-3 pull-right divViewer");
		var spanViewer=document.createElement("span");
		spanViewer.setAttribute("class","pull-right");
		spanViewer.style.color="rgb(137, 131, 149)";
		spanViewer.innerHTML=request["streams"][i]["viewers"];
		divViewer.appendChild(spanViewer);
		var divPoint=document.createElement("div");
		if (request["streams"][i]["stream_type"]=="rerun") {
			divPoint.setAttribute("class","pointTwitch pointTwitch--grey pull-right");
		}else{
			divPoint.setAttribute("class","pointTwitch pointTwitch--red pull-right");
		}
		divViewer.appendChild(divPoint);


		row1.appendChild(div1);
		row1.appendChild(divViewer);
		divxs7.appendChild(row1);

		var row1=document.createElement('div');
		row1.setAttribute("class","row");
		var div1=document.createElement('div');
		div1.setAttribute("class","col-xs-12 ellipsis");
		div1.innerHTML=request["streams"][i]["channel"]['status'];
		//ajout
		row1.appendChild(div1);
		divxs7.appendChild(row1);
		div.appendChild(divxs7);

		//col-xs-1 checkbox
		var divxs1=document.createElement('div');
		divxs1.setAttribute("class","col-xs-1");
		var input = document.createElement("input");
		input.type="checkbox";
		input.name=request["streams"][i]["channel"]["name"];
		input.value=request["streams"][i]["channel"]["name"];
		//ajout
		divxs1.appendChild(input);
		div.appendChild(divxs1);

		//div.innerHTML="<div class='row'><div class='col-xs-1'><img src='"+request["streams"][i]["channel"]['logo']+"' heigth='50' width='50'></div><div class='text-justify col-xs-9 col-xs-offset-1'><a href='"+request["streams"][i]["channel"]["url"]+"' id='online' target='_BLANK'>"+request["streams"][i]["channel"]['display_name']+"</a> - <small>"+request["streams"][i]["game"]+"</small><br><span class='ellipsis'>"+request["streams"][i]["channel"]['status']+"</span></div></div>";
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

		/*var channelString="";
		for (var i = 0; i < urlsOffline.length; i++) {
			channelString+=urlsOffline[i]+",";
		}
		channelString=channelString.substr(0,channelString.length-1);*/
		//var optimisation="true";
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
	//document.getElementById("loading").style.display="none";
	var online = document.createElement("p");
	online.setAttribute("class","text-center");
	online.style.backgroundColor="white";
	online.style.color="black";
	online.innerHTML=chrome.i18n.getMessage("online");;
	row.appendChild(online);
}

function returnHttpRequest(httpRequest){
	request=JSON.parse(httpRequest.responseText);
	cleanAffichage();
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
	
	//TEST DE L EXTENSION
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
	//VAR autre

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
	}else{
		//none
	}
}