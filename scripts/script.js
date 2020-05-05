//idapp = "jfaoecnmdknjhbjadnpifengnndehddh"

myid="ufvj1hc6m9qg5txkz9ryvz0hk961cx";
row = document.getElementsByClassName("channel")[0];
//var extensionID="obpmmenioddcpffdelecfoogjomfhekm";//online
var extensionID="jfaoecnmdknjhbjadnpifengnndehddh";//local

//Initialisation des valeurs
if(localStorage.token==undefined){
	alert("You now need to use your twitch account");
	var urlToken = "https://id.twitch.tv/oauth2/authorize?response_type=token&client_id="+myid+"&redirect_uri=chrome-extension://achklpaoiepliafpiengdcglgclngdle/pages/template_option.html&scope=viewing_activity_read";
	chrome.tabs.create({url:urlToken});
}else{
	token="Bearer "+localStorage.token;
}

if (localStorage["showOffline"]==undefined) {
	localStorage["showOffline"]="false";	
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

if (localStorage["multitwitch"]==undefined || localStorage["multitwitch"]=="true" || localStorage["multitwitch"]=="false") {
	multitwitch="1";
	localStorage["multitwitch"]=1;
} else {
	multitwitch=localStorage["multitwitch"];
}

if (localStorage["showOverflow"]==undefined) {
	showOverflow=false;
	localStorage["showOverflow"]=false;
}else{
	showOverflow=localStorage["showOverflow"]=="true";
}

darktheme=localStorage["darktheme"]=="true";
if (localStorage["darktheme"]==undefined) {
	darktheme=true;
	localStorage["darktheme"]="true";
}

showOffline=localStorage["showOffline"]=="true";
optimisation=localStorage["optimisation"]=="true";
triPerViewers=localStorage["triPerViewers"]=="true";
if (localStorage["triPerViewers"]==undefined) {
	triPerViewers=true;
	localStorage["triPerViewers"]="true";
}

arrayStream=[];

request=[];
channelSquad=[];
squadTag="2a14b52e-d459-4c92-be11-5d86b898f6b6";
autoSquad=localStorage["autoSquad"]=="true";
if (autoSquad==undefined) {
	autoSquad=true;
	localStorage['autoSquad']=true;
}
waitForOtherRequest=false;

document.getElementsByTagName('body');
window.onload=init();

function init(){
	// bouton=document.getElementById('refresh');
	// bouton.innerHTML=chrome.i18n.getMessage("refresh");
	// bouton.addEventListener('click',afficherStream);
	
	boutonMulti = document.getElementById('multi');
	boutonMulti.title=chrome.i18n.getMessage("lauchMultiTwitch");
	boutonMulti.addEventListener('click',lauchMulti);

	boutonAdd = document.getElementById('addCurrent');
	boutonAdd.title=chrome.i18n.getMessage("addCurrentChannel");
	boutonAdd.addEventListener('click',getTabs);

	boutonOption=document.getElementById("options");
	boutonOption.title=chrome.i18n.getMessage("option");
	boutonOption.addEventListener('click',goToOption);

	boutonAddFav = document.getElementById('favCurrent');
	boutonAddFav.title=chrome.i18n.getMessage("favCurrentChannel");
	boutonAddFav.addEventListener('click',getTabsFav);

	boutonTwitch = document.getElementById('twitch');
	boutonTwitch.title=chrome.i18n.getMessage("twitch");
	boutonTwitch.addEventListener('click',goToTwitch);

	divContenu=document.getElementsByClassName("contenu")[0];
	if (darktheme) {
		divContenu.setAttribute("class","contenu dark");
	}else{
		divContenu.setAttribute("class","contenu light");
	}

	//style
	if(showOverflow){
		var style = document.createElement('style');
	  style.innerHTML = `.online-text:hover {
			overflow: visible; 
		    white-space: normal; 
		}
	  `;
	  document.head.appendChild(style);
	}

	if (urls.length!=0) {afficherStream();}
	else {
		cleanAffichage();
		var div = document.createElement("div");
		div.class="col-md-12";
		div.innerHTML="<p class='text-justify'>"+chrome.i18n.getMessage("noSavedChannel")+"</p>"
		row.appendChild(div);
	}
}

function lauchMulti() {
	var tab=document.getElementsByTagName('input');

	var tabSite = ["http://www.multitwitch.tv/","https://multistre.am/"];
	var chaine= tabSite[multitwitch];
	console.log(chaine);
	var chainebis="/";
	var count =0;
	for (var i = 0; i < tab.length; i++) {
		if (tab[i].checked) {
			console.log(tab[i]);
			//si check on ajoute
			chaine+=tab[i].value+"/";
			chainebis+=tab[i].value+"/";
			count++;
		}
	}

	if (count==0) {
		//aucun channel sélectioné
		alert(chrome.i18n.getMessage("NoChannelSelected"));
	} else if(count==1){
		//si une seule chaine (redirection vers le site de twitch)
		localStorage['id']=JSON.stringify("https://www.twitch.tv"+chainebis);
		chrome.tabs.create({url:"https://www.twitch.tv"+chainebis});
	}else {
		console.log(chaine);
		//maintenant on redirige vers le multitwitch
		localStorage["chaine"]=JSON.stringify(chaine);
		localStorage["chainebis"]=JSON.stringify(chainebis);

		chrome.tabs.query({ currentWindow: true, active: true },lauchMultiAsync);
	}
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


function myajax(nomChaine,  callBack,async=true) {
    var httpRequest = new XMLHttpRequest();
    var url="https://api.twitch.tv/helix/streams?user_login="+nomChaine;
    httpRequest.open("GET", url, async);
    httpRequest.setRequestHeader("Client-ID",myid);
    httpRequest.setRequestHeader("Authorization",token);
    httpRequest.setRequestHeader("Content-Type", "application/json");
    httpRequest.addEventListener("load", function () {
    	console.log(httpRequest.responseText);
    	if (JSON.parse(httpRequest.responseText).data==undefined || JSON.parse(httpRequest.responseText).data.length>0){
    	//if (JSON.parse(httpRequest.responseText).data.length>0){
    		callBack(httpRequest,nomChaine);
    	}else{
    		cleanAffichage();
    		var p = document.createElement("p");
    		p.setAttribute("class","col-xs-12 text-center");
    		p.innerHTML=chrome.i18n.getMessage("noChannelOnline");
    		document.getElementsByClassName("channel")[0].appendChild(p);
    	}
        
    });
    httpRequest.send();
}

function myajax2(nomChaine, callBack) {
    var httpRequest = new XMLHttpRequest();
    var url="https://api.twitch.tv/helix/users?login="+nomChaine;
    httpRequest.open("GET", url, false);
    httpRequest.setRequestHeader('Client-ID',myid);
    httpRequest.setRequestHeader("Authorization",token);
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
	var nbIte=1;
	for (var i = 0; i < urls.length; i++) {
		channelString+=urls[i]+"&user_login=";
		if(i%99==0 && i>0){
			channelString =channelString.substr(0,channelString.length-12);
			myajax(channelString,returnHttpRequest,false);	
			channelString="";
			nbIte++;
		}
	}
	console.log(request);
	waitForOtherRequest=false;
	channelString =channelString.substr(0,channelString.length-12);
	myajax(channelString,returnHttpRequest,true);
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
	console.log(channelSquad);
	var tab = event.path[index].id.split("/");
	var login=tab[tab.length-1];

	if (autoSquad && channelSquad.includes(login)) {
		localStorage['id']=event.path[index].id+"/squad";
	}else{
		localStorage['id']=event.path[index].id;
	}

	chrome.tabs.query({ currentWindow: true, active: true },lauchAsync);
}

function displayStreamAsync(request){

	if (request.data.length==0 && waitForOtherRequest) {
		var div = document.createElement("div");
		div.setAttribute("class","col-xs-12 text-center");
		div.style.margin="3px 0";
		div.innerHTML=chrome.i18n.getMessage("noChannelOnline");
		row.appendChild(div);
	}else{
		//il faut stocker tout les jeux actuellement en ligne
		console.log("Nombre de stream en live : "+request.data.length);
		var tabJeu = [];
		var jeux ="";
		if (request.data.length!=0) {
			for (var i = 0; i < request.data.length-1; i++) {
				jeux+=request.data[i].game_id+"&id=";
			}
			jeux+=request.data[request.data.length-1].game_id;
		}
		
		var httpRequest = new XMLHttpRequest();
	    var url="https://api.twitch.tv/helix/games?id="+jeux;
	    httpRequest.open("GET", url, true);
	    httpRequest.setRequestHeader('Client-ID',myid);
	    httpRequest.setRequestHeader("Content-Type", "application/json");
	    httpRequest.addEventListener("load", function () {
	    	var jeuR = JSON.parse(httpRequest.response);
	    	if (jeuR!=null) {
	    		for (var i = 0; i < jeuR.data.length; i++) {
		    		tabJeu.push(jeuR.data[i]);
		    	}	
	    	}else{
	    		console.log(jeuR);
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
	console.log("on Compte");
	console.log(request);
	console.log(tabJeu);
	//console.log(nbIte);

	var requestTmp=[];

	var sortByGames=localStorage["sortByGames"]=="true";

	if(sortByGames){
		//TODO sort games by alph
		tabJeu.sort(compareJeu);
		//TODO les tri des jeux
		for(var i=0;i<tabJeu.length;i++){
			console.log(tabJeu[i].name);
			for (var j = 0; j < request.data.length; j++) {
				if (tabJeu[i].id==request.data[j].game_id){
					requestTmp.push(request.data[j]);
				}
			}
			
		}
		request.data=requestTmp;
	}

	//todo favori
	favoritesChannel=JSON.parse(localStorage["favorites"]);
	console.log(favoritesChannel);
	if (favoritesChannel!=undefined && favoritesChannel[0]!=undefined) {

		var firstFav=true;
		//div favorites
		var divFav = document.createElement("div");
		divFav.setAttribute("class","favori");
		divFav.innerHTML="<div class='game favori'>    <i class='fas fa-star'></i> <i class='fas fa-star'></i>"+chrome.i18n.getMessage("favorites")+"<i class='fas fa-star'></i> <i class='fas fa-star'></i></div>";
		console.log("favUsers");
		console.log(tabUsers);

		//if option de tri
		if(triPerViewers){
			var favoritesChannelSorted=[];
			var favoritesChannelSortedViewer=[];

			for(var i=0;i<favoritesChannel.length;i++){
				//request.data[k]["viewer_count"]
				var name =favoritesChannel[i];

				var thisUser = [];
				for (var j = 0; j < tabUsers.length; j++) {
					if(tabUsers[j].login==name.toLowerCase() || thisUser.display_name==name){
						thisUser=tabUsers[j];
						j=10000;
					}
				}
				if(thisUser.id!=undefined){
					favoritesChannelSorted.push(name);

					var k=0;
					while(k<request.data.length && request.data[k].user_name!=thisUser.display_name){
						k++;
					}
					favoritesChannelSortedViewer.push(request.data[k]["viewer_count"]);
				}
			}
			var favSorted = [];
			var length = favoritesChannelSorted.length

			for(var i=0;i<length;i++){
				var maxViewer=favoritesChannelSortedViewer[0];
				var maxViewerName=favoritesChannelSorted[0];
				var indexMax=0;

				for(var j=1;j<favoritesChannelSorted.length;j++){
					if(favoritesChannelSortedViewer[j]>maxViewer){
						maxViewer=favoritesChannelSortedViewer[j];
						maxViewerName=favoritesChannelSorted[j];
						indexMax=j;
					}
				}
				favSorted.push(maxViewerName);
				favoritesChannelSorted.splice(indexMax,1);
				favoritesChannelSortedViewer.splice(indexMax,1);
			}
			favoritesChannel=favSorted;
			console.log(favSorted);
		}

		for (var i = 0; i < favoritesChannel.length; i++) {
			var name =favoritesChannel[i];

			var thisUser = [];
			console.log(name);
			for (var j = 0; j < tabUsers.length; j++) {
				if(tabUsers[j].login==name.toLowerCase() || thisUser.display_name==name){
					thisUser=tabUsers[j];
					j=10000;
				}
			}
			if(thisUser.id!=undefined){
				if(firstFav){firstFav=false;row.appendChild(divFav);}
				var k=0;
				while(k<request.data.length && request.data[k].user_name!=thisUser.display_name){
					k++;
				}

				var div = document.createElement("div");
				div.setAttribute("class","online w100 row");
				var url="https://www.twitch.tv/"+thisUser.login;

				//col-xs-3
				var divImage = document.createElement("div");
				divImage.setAttribute("class","online-img w15");
				divImage.id=url;
				divImage.addEventListener("click", listenerClick,false);
				var image = document.createElement('img');
				image.src=thisUser.profile_image_url;

				//ajout col-xs-3
				divImage.appendChild(image);
				div.appendChild(divImage);

				//col-xs-7
				var divxs7=document.createElement('div');
				divxs7.setAttribute("class","w85 row");
				divxs7.id=url;
				divxs7.addEventListener("click", listenerClick,false);
				var row1=document.createElement('div');
				row1.setAttribute("class","w85 online-text");
				var div1=document.createElement('div');
				div1.id=url;
				div1.setAttribute("class","w100 title");

				//suite
				var nomjeu ="";
				for (var j = 0; j < tabJeu.length; j++) {
					if(tabJeu[j]['id']==request.data[k]['game_id']){
						nomjeu=tabJeu[j]['name'];
						j=10000;
					}
				}
				var name = document.createElement("span");
				name.innerHTML=request.data[k]['user_name'];
				var jeu = document.createElement("i");
				jeu.innerHTML=nomjeu;
				jeu.setAttribute("class","tw-live-indicator");


				div1.appendChild(name);
				div1.appendChild(jeu);
				
				
				var divw100more = document.createElement("div");
				divw100more.setAttribute("class","w100 more");
				divw100more.innerHTML=request.data[k]['title'];
				

				var divw15 = document.createElement("div");
				divw15.setAttribute("class","w15");
				var divViewer = document.createElement("div");
				divViewer.setAttribute("class","divViewer row");
				divViewer.innerHTML="<span>"+request.data[k]["viewer_count"]+"</span><i class='fas fa-circle pointTwitch--red'></i>";
				var divCheck = document.createElement("div");
				divCheck.setAttribute("class","check row");
				var input = document.createElement("input");
				input.type="checkbox";
				input.name=thisUser["login"];
				input.value=thisUser["login"];

				if (!showOverflow) {
					name.title=request.data[k]['user_name'];
					jeu.title=nomjeu;
					divw100more.title=request.data[k]['title'];
				}

				divCheck.appendChild(input);
				divw15.appendChild(divViewer);
				divw15.appendChild(divCheck);
				row1.appendChild(div1);
				row1.appendChild(divw100more);
				divxs7.appendChild(row1);
				div.appendChild(divxs7);
				div.appendChild(divw15);

				row.appendChild(div);
			}

		}

		//divEndFav
		if(!firstFav){
			var divEndFav = document.createElement("div");
			divEndFav.setAttribute("class","game");
			divEndFav.innerHTML=chrome.i18n.getMessage("online");
			row.appendChild(divEndFav);
		}

	}
	

	for (i = 0; i < request.data.length; i++) {
		//selection depuis tabUsers
		var thisUser = [];
		for (var j = 0; j < tabUsers.length; j++) {
			if(tabUsers[j].id==request.data[i]['user_id']){
				thisUser=tabUsers[j];
				j=10000;
			}
		}

		//gestion du squad stream
		if(request.data[i].tag_ids!=null && request.data[i].tag_ids.includes(squadTag) && !channelSquad.includes(thisUser.login)){
			channelSquad.push(thisUser.login);
		}		

		//don t display favorites again
		if((favoritesChannel!=undefined || favoritesChannel.length>0) && (!favoritesChannel.includes(thisUser.login) && !favoritesChannel.includes(thisUser.display_name))){
			if (sortByGames && (i==0 || request.data[i].game_id!=request.data[i-1].game_id)) {
				var divGame = document.createElement("div");
				divGame.setAttribute("class","game");
				var nomJeu = "Test";

				//recherche du nom du jeu
				var j=0;
				while(j<tabJeu.length && request.data[i].game_id!=tabJeu[j].id){
					j++;
				}
				nomJeu=tabJeu[j].name;
				divGame.innerHTML=nomJeu;
				row.appendChild(divGame);
			}

			var div = document.createElement("div");
			div.setAttribute("class","online w100 row");
			var url="https://www.twitch.tv/"+thisUser.login;

			//col-xs-3
			var divImage = document.createElement("div");
			divImage.setAttribute("class","online-img w15");
			divImage.id=url;
			divImage.addEventListener("click", listenerClick,false);
			var image = document.createElement('img');
			image.src=thisUser.profile_image_url;

			//ajout col-xs-3
			divImage.appendChild(image);
			div.appendChild(divImage);

			//col-xs-7
			var divxs7=document.createElement('div');
			divxs7.setAttribute("class","w85 row");
			divxs7.id=url;
			divxs7.addEventListener("click", listenerClick,false);
			var row1=document.createElement('div');
			row1.setAttribute("class","w85 online-text");
			var div1=document.createElement('div');
			div1.id=url;
			div1.setAttribute("class","w100 title");

			//suite
			var nomjeu ="";
			for (var j = 0; j < tabJeu.length; j++) {
				if(tabJeu[j]['id']==request.data[i]['game_id']){
					nomjeu=tabJeu[j]['name'];
					j=10000;
				}
			}
			var name = document.createElement("span");
			name.innerHTML=request.data[i]['user_name'];
			var jeu = document.createElement("i");
			jeu.innerHTML=nomjeu;
			jeu.setAttribute("class","tw-live-indicator");

			div1.appendChild(name);
			div1.appendChild(jeu);


			var divw100more = document.createElement("div");
			divw100more.setAttribute("class","w100 more");
			divw100more.innerHTML=request.data[i]['title'];

			var divw15 = document.createElement("div");
			divw15.setAttribute("class","w15");
			var divViewer = document.createElement("div");
			divViewer.setAttribute("class","divViewer row");
			divViewer.innerHTML="<span>"+request.data[i]["viewer_count"]+"</span><i class='fas fa-circle pointTwitch--red'></i>";
			var divCheck = document.createElement("div");
			divCheck.setAttribute("class","check row");
			var input = document.createElement("input");
			input.type="checkbox";
			input.name=thisUser["login"];
			input.value=thisUser["login"];

			if (!showOverflow) {
				name.title=request.data[i]['user_name'];
				jeu.title=nomjeu;
				divw100more.title=request.data[i]['title'];
			}

			divCheck.appendChild(input);
			divw15.appendChild(divViewer);
			divw15.appendChild(divCheck);
			row1.appendChild(div1);
			row1.appendChild(divw100more);
			divxs7.appendChild(row1);
			div.appendChild(divxs7);
			div.appendChild(divw15);

			row.appendChild(div);

			// var div = document.createElement("div");
			// div.setAttribute("class","col-xs-12");
			// div.style.padding="3px 0";
			// div.style.margin="0.1px 0";
			// div.style.borderTop="#474747 solid 0.2px";
			// //div.style.borderBottom="white solid 0.2px";
			// var url="https://www.twitch.tv/"+thisUser["login"];

			// //col-xs-3
			// var divImage = document.createElement("div");
			// divImage.setAttribute("class","col-xs-3");
			// divImage.style.paddingLeft="0px";
			// divImage.id=url;
			// divImage.addEventListener("click", listenerClick,false);
			// var image = document.createElement('img');
			// image.src=thisUser.profile_image_url;
			// image.setAttribute("class","img-responsive");
			// image.style.width="50px";
			// image.style.height="50px";

			// //ajout col-xs-3
			// divImage.appendChild(image);
			// div.appendChild(divImage);

			// //col-xs-7
			// var divxs7=document.createElement('div');
			// divxs7.setAttribute("class","col-xs-8");
			// divxs7.id=url;
			// divxs7.addEventListener("click", listenerClick,false);
			// var row1=document.createElement('div');
			// row1.setAttribute("class","row");
			// var div1=document.createElement('div');
			// div1.id=url;
			// div1.setAttribute("class","col-xs-9 ellipsis");
			// div1.style.paddingLeft="0px";

			// //suite
			// var nomjeu ="";
			// for (var j = 0; j < tabJeu.length; j++) {
			// 	if(tabJeu[j]['id']==request.data[i]['game_id']){
			// 		nomjeu=tabJeu[j]['name'];
			// 		j=10000;
			// 	}
			// }
			// if (!showOverflow) {
			// 	div1.title=request.data[i]['user_name']+" - "+nomjeu;
			// }
			
			// div1.innerHTML=request.data[i]['user_name']+" - <i class='tw-live-indicator'>"+nomjeu;
			
			// //nombre de viewer
			// var divViewer= document.createElement("div");
			// divViewer.setAttribute("class","col-xs-3 pull-right divViewer");
			// var spanViewer=document.createElement("span");
			// spanViewer.setAttribute("class","pull-right");
			// spanViewer.style.color="rgb(137, 131, 149)";
			// spanViewer.innerHTML=request.data[i]["viewer_count"];
			// divViewer.appendChild(spanViewer);
			// var divPoint=document.createElement("div");
			// divPoint.setAttribute("class","pointTwitch pointTwitch--red pull-right");
			// divViewer.appendChild(divPoint);


			// row1.appendChild(div1);
			// row1.appendChild(divViewer);
			// divxs7.appendChild(row1);

			// var row1=document.createElement('div');
			// row1.setAttribute("class","row");
			// var div1=document.createElement('div');
			// div1.setAttribute("class","col-xs-12 ellipsis");
			// if (!showOverflow) {
			// 	div1.setAttribute("title",request.data[i]['title']);
			// }
			// div1.innerHTML=request.data[i]['title'];
			// //ajout
			// row1.appendChild(div1);
			// divxs7.appendChild(row1);
			// div.appendChild(divxs7);

			// //col-xs-1 checkbox
			// var divxs1=document.createElement('div');
			// divxs1.setAttribute("class","col-xs-1");
			// var input = document.createElement("input");
			// input.type="checkbox";
			// input.name=thisUser["login"];
			// input.value=thisUser["login"];
			// //ajout
			// divxs1.appendChild(input);
			// div.appendChild(divxs1);

			// row.appendChild(div);
		}
		// var br=document.createElement('br');
		// div.appendChild(br);		
	}
}

function cleanAffichage(){
	document.getElementsByClassName("channel")[0].innerHTML='';
}

function returnHttpRequest(httpRequest){
	if(request.length!=0){
		//request deja defini on ajoute
		var newTab = JSON.parse(httpRequest.responseText);
		Array.prototype.push.apply(request.data,newTab.data);
		request.data.sort(compare);
	}else{
		request=JSON.parse(httpRequest.responseText);	
	}	
	console.log(request);
	if(!waitForOtherRequest){
	
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
	}
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

function getTabsFav(){
	chrome.tabs.query({ currentWindow: true, active: true },getCurrentFav);
}

function getCurrent(tab) {
	tabUrl = tab[0]['url'];
	if(tabUrl[tabUrl.length-1]=="/"){
		tabUrl = tabUrl.substring(0, tabUrl.length-1);
	}

	if (tabUrl.endsWith("/videos")) {
		console.log("end with videos");
		tabUrl = tabUrl.substring(0,tabUrl.length-7);
		console.log(tabUrl);
	}
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

function getCurrentFav(tab) {
	tabUrl = tab[0]['url'];
	if(tabUrl[tabUrl.length-1]=="/"){
		tabUrl = tabUrl.substring(0, tabUrl.length-1);
	}

	if (tabUrl.endsWith("/videos")) {
		console.log("end with videos");
		tabUrl = tabUrl.substring(0,tabUrl.length-7);
		console.log(tabUrl);
	}
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
		//TODO recup le display name via une requete pour la suite du code
		if (!favoritesChannel.includes(name) && urls.includes(name)) {
			console.log(name);
			favoritesChannel.push(name);
			localStorage.favorites=JSON.stringify(favoritesChannel);
			request=[];
			cleanAffichage();
			afficherStream();
		}else if (!urls.includes(name)) {
			console.log(name);
			//on test enfin si la chaine existe
			myajax2(name,saveTabFav);
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
		cleanAffichage();
		urls.push(reponse.data[0].login);
		localStorage['streams']=JSON.stringify(urls);
		request=[];
		afficherStream();
	}else{
		alert(chrome.i18n.getMessage("FeedbackUserUnknow"));
	}
}

function saveTabFav(event) {
	var reponse = JSON.parse(event.responseText);
	console.log(reponse);
	if (reponse["error"]==null) {
		cleanAffichage();
		urls.push(reponse.data[0].login);
		favoritesChannel.push(reponse.data[0].display_name);
		localStorage['favorites']=JSON.stringify(favoritesChannel);
		localStorage['streams']=JSON.stringify(urls);
		request=[];
		afficherStream();
	}else{
		alert(chrome.i18n.getMessage("FeedbackUserUnknow"));
	}
}

function goToOption(){
	console.log("goToOption");
	chrome.tabs.create({url:"pages/template_option.html"});
}

function goToTwitch(){
	console.log("goToTwitch");
	chrome.tabs.create({url:"https://www.twitch.tv"});
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

function compare(a , b) {
	if(a.viewer_count > b.viewer_count){
		return -1;
	}else if (a.viewer_count == b.viewer_count) {
		return 0;
	}else{
		return 1;
	}
}

function compareJeu(a , b) {
	if(a.name < b.name){
		return -1;
	}else if (a.name == b.name) {
		return 0;
	}else{
		return 1;
	}
}

//if crash
window.onerror = function (msg, url, lineNo, columnNo, error) {
  var div = document.createElement("div");
  div.style.color ="red";
  var h1 = document.createElement("h1");
  h1.innerHTML="If you experience bug during loading, please remove all channel and re-add them ! Thank you ! <br> You know have a button to remove all channels";
  div.appendChild(h1);
  document.getElementById('afficher').appendChild(div);

  console.log(msg);
  console.log(error);

  return false;
}