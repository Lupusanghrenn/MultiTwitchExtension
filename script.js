//localStorage['streams']=JSON.stringify(["ogaminglol","zerator","gobgg"]);

myid="ufvj1hc6m9qg5txkz9ryvz0hk961cx";
row = document.getElementById("afficher");

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
	bouton.addEventListener('click',afficherStream);
	cleanAffichage();
	if (urls.length!=0) {afficherStream();}
	else {
		var div = document.createElement("div");
		div.class="col-md-12";
		div.innerHTML="<p class='text-justify'>Vous n'avez pour l'instant enregistré aucun channel</p>"
		row.appendChild(div);
	}
	
}

//myajax("https://api.twitch.tv/kraken/streams/ogaminglol",retour,urls);

function myajax(nomChaine,  callBack) {
    var httpRequest = new XMLHttpRequest();
    var url="https://api.twitch.tv/kraken/streams?channel="+nomChaine;
    httpRequest.open("GET", url, false);
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
	cleanAffichage();
	
	var channelString="";
	for (var i = 0; i < urls.length; i++) {
		channelString+=urls[i]+",";
	}
	channelString =channelString.substr(0,channelString.length-1);
	myajax(channelString,returnHttpRequest);


	for (var i = 0; i < request._total; i++) {
		var div = document.createElement("div");
		div.setAttribute("class","col-xs-12");
		div.style.margin="3px 0";

		//col-xs-3
		var divImage = document.createElement("div");
		divImage.setAttribute("class","col-xs-3");
		divImage.style.paddingLeft="0px"
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
		divxs7.setAttribute("class","col-xs-7");
		var row1=document.createElement('div');
		row1.class="row";
		var div1=document.createElement('div');
		div1.setAttribute("class","col-xs-12 ellipsis");
		div1.innerHTML="<a href='"+request["streams"][i]["channel"]["url"]+"' id='online' target='_BLANK'>"+request["streams"][i]["channel"]['display_name']+"</a> - "+request['streams'][i]['game'];
		//ajout
		row1.appendChild(div1);
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

		
		
	}else{
		console.log("ne rien montrer");
	}
}

function cleanAffichage(){
	row.innerHTML='';
	var online = document.createElement("p");
	online.setAttribute("class","text-center");
	online.style.backgroundColor="white";
	online.style.color="black";
	online.innerHTML="ONLINE";
	row.appendChild(online);
}

function returnHttpRequest(httpRequest){
	request=JSON.parse(httpRequest.responseText);
	//on enelve les chaines en live
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
}

function returnOffline(httpRequest){
	requestOffline=JSON.parse(httpRequest.responseText);
}