//var extensionID="jpgnbiffpoelgpegopldffmpbmfdojga";//online
var extensionID="ladpjdnbcbdejhogjdbgcakjepfmdgac";//local

function enregistrer()//enregistrer les options, fonction appelée par le click sur le bouton
{
	//localStorage["showOffline"]=checkboxShowOffline.checked;
	localStorage["multitwitch"]=checkboxMulti.value;
	localStorage['notifOnLaunch']=checkboxOnLaunch.checked;
	localStorage["sortByGames"]=checkboxSortByGames.checked;
	localStorage["autoSquad"]=checkboxAutoSquad.checked;
	localStorage["showOverflow"]=checkboxshowOverflow.checked;
	localStorage["darktheme"]=checkboxDarktheme.checked;
	localStorage["triPerViewers"]=checkboxtriPerViewers.checked;
	triPerViewers=checkboxtriPerViewers.checked;
	
	timeInterval=parseInt(inputTimeInterval.value)*1000;
	if (timeInterval<10000) {
		timeInterval=10000;
	}
	localStorage['timeInterval']=timeInterval;
	notifOnLaunch=checkboxOnLaunch.checked;
	//showOffline=localStorage["showOffline"]=="true";
	feedback2.innerHTML="";
	feedback2.appendChild(createFeedback("alert-success",chrome.i18n.getMessage("FeebackOptionSucess")));
	feedback2.addEventListener("click",close2);
	setTimeout(close2,5000);
}

function init(){
	console.log("init");
	//initialisation des variables globales
	//showOffline=localStorage["showOffline"]=="true";
	var hash = document.location.hash;
	if (hash!=undefined && document.location.hash.includes("access_token")) {
		var bearertoken =hash.slice(14,14+30);
		localStorage.token=bearertoken;
	}
	
	multitwitch=JSON.parse(localStorage["multitwitch"]);
	darktheme=localStorage["darktheme"]=="true";
	notifOnLaunch=localStorage["notifOnLaunch"]=="true";
	localStorage['notifOnLaunch']=notifOnLaunch;
	sortByGames=localStorage["sortByGames"]=="true";
	autoSquad=localStorage["autoSquad"]=="true";
	showOverflow=localStorage["showOverflow"]=="true";
	timeInterval=parseInt(localStorage["timeInterval"]);
	if (timeInterval==undefined) {
		timeInterval=30000;
		localStorage["timeInterval"]=timeInterval;
	}
	if (localStorage["multitwitch"]==undefined || localStorage["multitwitch"]=="true" || localStorage["multitwitch"]=="false") {
		multitwitch="1";
		localStorage["multitwitch"]=1;
	} else {
		multitwitch=localStorage["multitwitch"];
	}
	if (localStorage["favorites"]==undefined) {
		favoritesChannels=[];
		localStorage["favorites"]=JSON.stringify(favoritesChannels);
	}else{
		favoritesChannels=JSON.parse(localStorage["favorites"]);
	}

	if (localStorage["darktheme"]==undefined) {
		darktheme=true;
		localStorage["darktheme"]="true";
	}

	triPerViewers=localStorage["triPerViewers"]=="true";
	if (localStorage["triPerViewers"]==undefined) {
		triPerViewers=true;
		localStorage["triPerViewers"]="true";
	}

	if (localStorage.token==undefined) {
		alert("You need to connect your twitch account to use the app! Go to the connect button");
	}
	token="Bearer "+localStorage.token;


	//document.getElementById("multitwitch");
	//checkboxMulti.checked=multitwitch;
	checkboxMulti=document.getElementById("selectMulti");
	checkboxMulti.selectedIndex=multitwitch;

	//checkboxShowOffline=document.getElementById("showOffline");
	//checkboxShowOffline.checked=showOffline;

	checkboxDarktheme=document.getElementById("darktheme");
	checkboxDarktheme.checked=darktheme;

	checkboxOnLaunch=document.getElementById("notifOnLaunch");
	checkboxOnLaunch.checked=notifOnLaunch;

	checkboxSortByGames=document.getElementById("sortByGames");
	checkboxSortByGames.checked=sortByGames;

	checkboxAutoSquad=document.getElementById("autoSquad");
	checkboxAutoSquad.checked=autoSquad;

	checkboxshowOverflow=document.getElementById("showOverflow");
	checkboxshowOverflow.checked=showOverflow;

	checkboxtriPerViewers=document.getElementById("triPerViewers");
	checkboxtriPerViewers.checked=triPerViewers;

	buttonInputChannelFollow=document.getElementById("buttonChannelName");
	buttonInputChannelFollow.addEventListener("click",getFollow);

	buttonSort=document.getElementById("sort");
	buttonSort.addEventListener("click",sortChannel);


	inputTimeInterval=document.getElementById('timeInterval').childNodes[1];
	inputTimeInterval.value=timeInterval/1000;

	bouton=document.getElementById("save");
	bouton.addEventListener('click',enregistrer);
	boutonSaveG=document.getElementById("save-g");
	boutonSaveG.addEventListener('click',enregistrer);
	channels=document.getElementById('channels');
	favorites=document.getElementById('channelsFavorite');
	savediv=document.getElementById('savediv');
	savediv.addEventListener('click',save);
	myid="ufvj1hc6m9qg5txkz9ryvz0hk961cx";

	feedback = document.getElementById("feedback");
	feedback2 = document.getElementById("feedback2");
	feedback3 = document.getElementById('feedback3');
	feedback4 = document.getElementById('feedback4');


	//MESSAGES . JSON
	document.getElementById("extensionOption").innerHTML=chrome.i18n.getMessage("extensionOption");
	document.getElementById("GeneralParameters").innerHTML=chrome.i18n.getMessage("GeneralParameters");
	document.getElementById("timeRequest").innerHTML=chrome.i18n.getMessage("timeRequest");
	//document.getElementById("checkOffline").innerHTML=chrome.i18n.getMessage("checkOffline");
	document.getElementById("multitwitchLabel").innerHTML=chrome.i18n.getMessage("checkMultistream");
	document.getElementById("CheckOnLaunch").innerHTML=chrome.i18n.getMessage("CheckOnLaunch");
	document.getElementById("save").innerHTML=chrome.i18n.getMessage("save");
	document.getElementById("ChannelParameters").innerHTML=chrome.i18n.getMessage("ChannelParameters");
	document.getElementById("sort").innerHTML=chrome.i18n.getMessage("SortChannels");
	document.getElementById("toSave").placeholder=chrome.i18n.getMessage("placeholderUrlChannel");
	document.getElementById("GetFollowTitle").innerHTML=chrome.i18n.getMessage("GetFollowTitle");
	document.getElementById("buttonChannelName").innerHTML+=" "+chrome.i18n.getMessage("ConnectTwitch");
	//document.getElementById("toChannelName").placeholder=chrome.i18n.getMessage("placeholderUrlFollow");
	//document.getElementById("buttonChannelName").innerHTML=chrome.i18n.getMessage("GetFollow");
	document.getElementById("lupusNote").innerHTML=chrome.i18n.getMessage("lupusNote");
	document.getElementById('checkSort').innerHTML=chrome.i18n.getMessage("sortByGames");
	document.getElementById('checkAutoSquad').innerHTML=chrome.i18n.getMessage("autoSquad");
	document.getElementById('checkOverflow').innerHTML=chrome.i18n.getMessage("showOverflow");
	document.getElementById('checkDarktheme').innerHTML=chrome.i18n.getMessage("darktheme");
	document.getElementById('removeAll').innerHTML=chrome.i18n.getMessage("removeAll");
	document.getElementById('ChecktriPerViewers').innerHTML=chrome.i18n.getMessage("ChecktriPerViewers");

	//Ajout d amelioration de l UI
	document.getElementById('CheckOnLaunch').addEventListener("click",function (event) {
		console.log(document.getElementById('notifOnLaunch'));
		document.getElementById('notifOnLaunch').checked=!document.getElementById('notifOnLaunch').checked;
	});

	document.getElementById('checkDarktheme').addEventListener("click",function (event) {
		console.log(document.getElementById('notifOnLaunch'));
		document.getElementById('darktheme').checked=!document.getElementById('darktheme').checked;
	});

	/*document.getElementById('checkOffline').addEventListener("click",function (event) {
		console.log(document.getElementById('showOffline'));
		document.getElementById('showOffline').checked=!document.getElementById('showOffline').checked;
	});*/

	document.getElementById('checkSort').addEventListener("click",function (event) {
		console.log(document.getElementById('sortByGames'));
		document.getElementById('sortByGames').checked=!document.getElementById('sortByGames').checked;
	});

	/*document.getElementById('sortByGames').addEventListener("change",function(event){
		console.log(document.getElementById('sortByGames'));
		document.getElementById('sortByGames').checked=!document.getElementById('sortByGames').checked;
	});*/

	document.getElementById('checkAutoSquad').addEventListener("click",function (event) {
		console.log(document.getElementById('autoSquad'));
		document.getElementById('autoSquad').checked=!document.getElementById('autoSquad').checked;
	});

	document.getElementById('checkOverflow').addEventListener("click",function (event) {
		console.log(document.getElementById('showOverflow'));
		document.getElementById('showOverflow').checked=!document.getElementById('showOverflow').checked;
	});

	document.getElementById('removeAll-g').addEventListener("click",function(){
		localStorage.favorites=JSON.stringify([]);
		localStorage.streams=JSON.stringify([]);
		window.location.reload(true);
	})

	//enregistrer();
	displayChannel();
}

function displayChannel(){
	clearChannel();
	tab=JSON.parse(localStorage['streams']);
	for (var i = 0; i < tab.length; i++) {
		var request=[];
		request.login=tab[i];
		displayName(request, true);
		if(favoritesChannels.includes(tab[i])){
			displayFav(request,true);
		}
	}
}

function displayName(httpRequest, opti){
	if (opti) {
		var reponse=httpRequest;
	} else {
		var reponse=JSON.parse(httpRequest.response);
	}

	var formGroup = document.createElement("div");
	formGroup.setAttribute("class","form-group");;

	var label=document.createElement('label')
	label.setAttribute('class','sr-only');
	label.setAttribute('for','channel');
	label.innerHTML='Channel';

	var inputGroup=document.createElement('div');
	inputGroup.setAttribute('class','input-group');

	var input = document.createElement("input");
	input.type='text';
	input.setAttribute('class','text-center');
	input.setAttribute('id','channel');
	input.setAttribute("disabled","disabled");
	input.value=reponse['login'];

	var btnGeneral = document.createElement("div");
	btnGeneral.setAttribute("class","btn-general");

	var divTimes = document.createElement("div");
	divTimes.innerHTML="<i class='fa fa-times' aria-hidden='true'></i>";
	divTimes.addEventListener('click',deleteChannel);

	var divStar = document.createElement("div");
	divStar.innerHTML="<i class='fa fa-star' aria-hidden='true'></i>";
	divStar.addEventListener('click',favChannel);
	if (favoritesChannels.includes(reponse['login'])) {divStar.childNodes[0].style.color="#27ae60";}

	btnGeneral.appendChild(divTimes);
	btnGeneral.appendChild(divStar);

	inputGroup.appendChild(input);
	inputGroup.appendChild(btnGeneral);

	formGroup.appendChild(label);
	formGroup.appendChild(inputGroup);

	channels.appendChild(formGroup);

	// var div3=document.createElement('div');
	// div3.setAttribute('class','input-group-addon');
	// div3.innerHTML="<i class='fa fa-times' aria-hidden='true'></i>";
	// div3.addEventListener('click',deleteChannel);
	// var divFav=document.createElement('div');
	// divFav.setAttribute('class','input-group-addon');
	// divFav.innerHTML="<i class='fa fa-star' aria-hidden='true'></i>";
	// if (favoritesChannels.includes(reponse['display_name'])) {divFav.style.color="#09c106";}
	// divFav.style.borderRight="0px";
	// divFav.addEventListener('click',favChannel);
	// var input=document.createElement('input');
	// input.type='text';
	// input.style.marginBottom="-0.4px";
	// input.setAttribute('class','form-control text-center');
	// input.setAttribute('id','channel');
	// input.setAttribute("disabled","disabled");
	// input.value=reponse['display_name'];

	// div.appendChild(label);
	// div2.appendChild(div3);
	// div2.appendChild(divFav);
	// div2.appendChild(input);
	// div.appendChild(div2);
	// channels.appendChild(div);
}

function displayFav(httpRequest, opti){
	if (opti) {
		var reponse=httpRequest;
	} else {
		var reponse=JSON.parse(httpRequest.response);
	}

	var div = document.createElement('div');
	div.setAttribute("class","form-group multi");

	var label = document.createElement("label");
	label.setAttribute("class","sr-only");
	label.setAttribute("for","channel");
	label.innerHTML=reponse.login;

	var inputGroup = document.createElement('div');
	inputGroup.setAttribute("class","input-group");

	var input = document.createElement("input");
	input.setAttribute("type","text")
	input.setAttribute("disabled","disabled");
	input.value=reponse['login'];

	var btnFav = document.createElement('div');;
	btnFav.setAttribute("class","btnFav");
	btnFav.innerHTML="<i  class='fa fa-times' aria-hidden='true'></i>";

	div.appendChild(label);
	inputGroup.appendChild(input);
	btnFav.addEventListener('click',deleteFav);
	inputGroup.appendChild(btnFav);
	div.appendChild(inputGroup);
	favorites.appendChild(div);;


	/*var div=document.createElement('div');
	div.setAttribute("class","form-group col-xs-4");

	var label=document.createElement('label')
	label.setAttribute('class','sr-only');
	label.setAttribute('for','channel');
	label.innerHTML='Channel';

	var div2=document.createElement('div');
	div2.setAttribute('class','input-group');
	var div3=document.createElement('div');
	div3.setAttribute('class','input-group-addon');
	div3.innerHTML="<i class='fa fa-times' aria-hidden='true'></i>";
	div3.addEventListener('click',deleteFav);
	var input=document.createElement('input');
	input.type='text';
	input.style.marginBottom="-0.4px";
	input.setAttribute('class','form-control text-center');
	input.setAttribute('id','channel');
	input.setAttribute("disabled","disabled");
	input.value=reponse['display_name'];

	div.appendChild(label);
	div2.appendChild(div3);
	div2.appendChild(input);
	div.appendChild(div2);
	favorites.appendChild(div);*/

	//TODO favorites #09c106
}

function clearChannel(){
	channels.innerHTML='';
	if (favoritesChannels.length>0) {
		favorites.innerHTML='';
	}else{
		favorites.innerHTML="<h4>"+chrome.i18n.getMessage("noFav")+"</h4>";
	}	
}

function favChannel(event) {
	console.log(event);
	console.log("fav");
	var index=2;
	if(event.target.localName=="i"){
		index++;
		console.log(event.target.localName);
	}
	var name = event.path[index].childNodes[0].value;
	console.log(name);

	if (!favoritesChannels.includes(name)) {
		favoritesChannels.push(name);
		favoritesChannels.sort();

		localStorage["favorites"]=JSON.stringify(favoritesChannels);

		feedback4.innerHTML="";
		feedback4.appendChild(createFeedback("alert-success",chrome.i18n.getMessage("chanelFaved")));
		feedback4.addEventListener("click",close4);
		setTimeout(close4,5000);

		displayChannel();
	}else{
		/*feedback.innerHTML="";
		feedback.appendChild(createFeedback("alert-danger",chrome.i18n.getMessage("FeebackAlreadySave")));
		feedback.addEventListener("click",close);
		setTimeout(close,5000);*/
		var ind = favoritesChannels.indexOf(name);
		favoritesChannels.splice(ind,1);

		localStorage["favorites"]=JSON.stringify(favoritesChannels);

		feedback4.innerHTML="";
		feedback4.appendChild(createFeedback("alert-danger",chrome.i18n.getMessage("FeebackDeletedChannel")));
		feedback4.addEventListener("click",close4);
		setTimeout(close4,5000);

		displayChannel();
	}	
}

function deleteFav(event){
	console.log(event);
	console.log("fav");
	var index=1;
	if(event.target.localName=="i"){
		index++;
		console.log(event.target.localName);
	}
	var name = event.path[index].childNodes[0].value;
	console.log(name);
	var index=favoritesChannels.indexOf(name);
	var tab2=favoritesChannels.splice(index,1);
	localStorage['favorites']=JSON.stringify(favoritesChannels);

	feedback4.innerHTML="";
	feedback4.appendChild(createFeedback("alert-info",chrome.i18n.getMessage("FeebackDeletedChannel")));
	feedback4.addEventListener("click",close4);
	setTimeout(close4,5000);
	displayChannel();
}

function deleteChannel(event){
	var index=2;
	if(event.target.localName=="i"){
		index++;
		console.log(event.target.localName);
	}
	var div=event.path[index];
	var name=div.getElementsByTagName('input')[0].value;
	console.log(name);
	var index=tab.indexOf(name);
	var tab2=tab.splice(index,1);
	localStorage['streams']=JSON.stringify(tab);
	var index=favoritesChannels.indexOf(name);
	var tab3=favoritesChannels.splice(index,1);
	localStorage['favorites']=JSON.stringify(favoritesChannels);

	feedback.innerHTML="";
	feedback.appendChild(createFeedback("alert-info",chrome.i18n.getMessage("FeebackDeletedChannel")));
	feedback.addEventListener("click",close);
	setTimeout(close,5000);
	displayChannel();
}

function save(){
	var name=document.getElementById('toSave').value;
	if (name!="") {
		//on test si la chaine existe
		document.getElementById('toSave').value="";
		if (tab.indexOf(name)!=-1) {
			//si deja dans tab
			//alert("Deja dans vos chaines");
			feedback.innerHTML="";
			feedback.appendChild(createFeedback("alert-danger",chrome.i18n.getMessage("FeebackAlreadySave")));
			feedback.addEventListener("click",close);
			setTimeout(close,5000);
		}else{
			myajax(name,testRetour);
			console.log(name);
		}
		
	}else{
		//chaine non rempli --A REFAIRE
		feedback.innerHTML="";
		feedback.appendChild(createFeedback("alert-danger",chrome.i18n.getMessage("FeebackChannelEmpty")));
		feedback.addEventListener("click",close);
		setTimeout(close,5000);
	}
	document.getElementById('toSave').focus();
}

function testRetour(httpRequest,nomChaine){
	console.log(httpRequest);
	reponse=JSON.parse(httpRequest.response);
	if (reponse['error']!=null) {
		//il y a une error
		//alert("Cet utilisateur n'existe pas");
		feedback.innerHTML="";
		feedback.appendChild(createFeedback("alert-danger",chrome.i18n.getMessage("FeedbackUserUnknow")));
		feedback.addEventListener("click",close);
		setTimeout(close,5000);
	}else{
		//on add le channel au données de l'user
		//et on refresh la page
		console.log(reponse.data[0]['login']);
		var t = JSON.parse(localStorage['streams']);
		t.push(reponse.data[0]['login']);
		console.log(t);
		t= JSON.stringify(t);
		localStorage['streams']=t;

		feedback.innerHTML="";
		feedback.appendChild(createFeedback("alert-success",chrome.i18n.getMessage("FeebackAddChannelSuccess")));
		feedback.addEventListener("click",close);
		setTimeout(close,5000);

		displayChannel();
	}
}

function myajax(nomChaine, callBack) {
    var httpRequest = new XMLHttpRequest();
    var url="https://api.twitch.tv/helix/users?login="+nomChaine;
    httpRequest.open("GET", url, true);
    httpRequest.setRequestHeader('Client-ID',myid);
    httpRequest.setRequestHeader("Authorization",token);
    httpRequest.setRequestHeader("Content-Type", "application/json");
    httpRequest.addEventListener("load", function () {
    	console.log(httpRequest);
        callBack(httpRequest,false);
    });
    httpRequest.send();
}

function myajaxId(nomChaine, callBack) {
    var httpRequest = new XMLHttpRequest();
    var url="https://api.twitch.tv/helix/users?login="+nomChaine;
    httpRequest.open("GET", url, true);
    httpRequest.setRequestHeader('Client-ID',myid);
    httpRequest.setRequestHeader("Authorization",token);
    httpRequest.setRequestHeader("Content-Type", "application/json");
    httpRequest.addEventListener("load", function () {
        //callBack(httpRequest,false);
        var req = JSON.parse(httpRequest.responseText);
        console.log("requete myajaxId");
        console.log(req);
        if (req.data==undefined) {
        	feedback3.appendChild(createFeedback("alert-danger",chrome.i18n.getMessage("FeedbackUserUnknow")));
        	feedback3.addEventListener("click",close3);
			setTimeout(close3,5000);
        } else {
        	var idchaine=req.data[0].id;
	        myajaxFollow(idchaine,callBack,1,'',[]);
        }
    });
    httpRequest.send();
}

function myajaxFollow(userid, callBack,nbIte,cursor,formerTab) {
    var httpRequest = new XMLHttpRequest();
    var url = "https://api.twitch.tv/helix/users/follows?from_id="+userid+"&first=100&after="+cursor;
    httpRequest.open("GET", url, true);
    httpRequest.setRequestHeader('Client-ID',myid);
    httpRequest.setRequestHeader("Authorization",token);
    httpRequest.setRequestHeader("Content-Type", "application/json");
    httpRequest.addEventListener("load", function () {
    	var newTab = JSON.parse(httpRequest.response);
    	console.log("former tab");
    	console.log(formerTab);
    	console.log("newtab");
    	console.log(newTab);
    	if(formerTab.length!=0){
    		Array.prototype.push.apply(formerTab.data,newTab.data);
    		formerTab.pagination=newTab.pagination;
    		checkNbFollowers(userid,formerTab,callBack,nbIte);
    	}else{
    		checkNbFollowers(userid,newTab,callBack,nbIte);
    	}	
        
    });
    httpRequest.send();
}

function checkNbFollowers(userid,tabUsers,callBack,nbIte) {
	console.log(tabUsers);
	console.log(nbIte);
	if(tabUsers.total>nbIte*100){
		//on a plus de 100 follows --> renvoie de requete
		myajaxFollow(userid,callBack,nbIte+1,tabUsers.pagination.cursor,tabUsers);
	}else{
		myajaxFollowedUsers(tabUsers,callBack);
		console.log("tabUsers");
		console.log(tabUsers);
		//addFollowedUsers(tabUsers);
	}
	
}

function myajaxFollowedUsers(tabUsers,callBack){
	var httpRequest = new XMLHttpRequest();
	console.log(tabUsers);
	total=tabUsers.data.length;
	for(var nbIte=0;nbIte*100<tabUsers.data.length;nbIte++){
		var users ="";
		for (var i = nbIte*100; i < tabUsers.data.length && i<(nbIte+1)*100; i++) {
			users+=tabUsers.data[i].to_id+"&id=";
		}
		users=users.substr(0,users.length-4);
		//users+=tabUsers.data[tabUsers.data.length-1].to_id;
		console.log(users);
	    var url = "https://api.twitch.tv/helix/users?id="+users;
	    httpRequest.open("GET", url, false);
	    httpRequest.setRequestHeader('Client-ID',myid);
    	httpRequest.setRequestHeader("Authorization",token);
	    httpRequest.setRequestHeader("Content-Type", "application/json");
	    httpRequest.addEventListener("load", function (event) {
	    	console.log("callBack" + callBack);
	    	console.log(event);
	    	
	        callBack(JSON.parse(httpRequest.responseText));
	    });
	    httpRequest.send();
	}
}

function myajaxToken(username){
	//Online
	//var urlToken = "https://id.twitch.tv/oauth2/authorize?response_type=token&client_id="+myid+"&redirect_uri=chrome-extension://"+extensionID+"/pages/template_option.html&scope=viewing_activity_read";
	//offline
	var urlToken = "https://id.twitch.tv/oauth2/authorize?response_type=token&client_id="+myid+"&redirect_uri="+document.location.origin+"/pages/template_option.html&scope=viewing_activity_read";
	chrome.tabs.create({url:urlToken});
}

/*function addFollowedUsers(tabUsers) {
	total=tabUsers.data.length;
	for (var i = 0; i < tabUsers.data.length; i++) {
		checkandaddTab(tabUsers.data[i].to_name);
	}
}*/


function enter(event){
	if (event.keyCode==13) {
		//on appuie sur enter
		console.log(event);
		save();
		enregistrer();
	}
}

function close(){
	feedback.innerHTML="";
	feedback.removeEventListener("click",close);
	clearTimeout(close);
}

function close2(){
	feedback2.innerHTML="";
	feedback2.removeEventListener("click",close2);
	clearTimeout(close2);
}

function close3(){
	feedback3.innerHTML="";
	feedback3.removeEventListener("click",close3);
	clearTimeout(close3);
}

function close4(){
	feedback4.innerHTML="";
	feedback4.removeEventListener("click",close4);
	clearTimeout(close4);
}

function getFollow() {
	var username=document.getElementById("toChannelName").value;
	document.getElementById("toChannelName").value="";
	feedback3.innerHTML="";
	feedback3.appendChild(createFeedback("alert-info",chrome.i18n.getMessage("FeedbackGettingInProgress")));
	feedback3.addEventListener("click",close3);
	setTimeout(close3,5000);
	if(localStorage.token!=undefined && localStorage.token!=""){
		myajaxId(username,updateTab);
		//myajaxToken(username);
	}else{
		myajaxToken(username);
	}
}

function updateTab(tab) {
	//feedback3.innerHTML="";
	close3();
	console.log(tab);
	//total=tab.data.length;
	for (var i = 0; i <tab.data.length; i++) {
		checkandaddTab(tab.data[i]);
	}
}

function checkandaddTab(name){
	//console.log(name);
	var username=name.login;
	//console.log(username);
	total--;
	
	if (!tab.includes(username)) {
		tab.push(username);
	}
	console.log(total);
	if (total==0) {
		console.log("total");
		document.getElementById("toChannelName").value="";
		localStorage["streams"]=JSON.stringify(tab);
		feedback3.innerHTML="";
		feedback3.appendChild(createFeedback("alert-info",chrome.i18n.getMessage("FeebackGettingSuccesfull")));
		feedback3.addEventListener("click",close3);
		setTimeout(close3,5000);
		displayChannel();
	}
}

function min(tabl){
	//return la plus petit chaine de caractère du tab
	var min = tabl[0];
	for (var i = 1; i < tabl.length; i++) {
		if (tabl[i].toLowerCase()<min.toLowerCase()) {
			min=tabl[i];
		}
	}
	return min;
}

function sortChannel(){
	//Trie le tableau des streamers, met a jour le localStorage, Feedback et réaffiche les tabs
	var tabl = [];
	//tableau avec les streamers == tab
	var length=tab.length;
	for (var i = 0; i < length; i++) {
		var tmp = min(tab);
		tabl.push(tmp);
		var index=tab.indexOf(tmp);
		tab.splice(index,1);
	}
	localStorage['streams']=JSON.stringify(tabl);
	feedback.innerHTML="";
	feedback.appendChild(createFeedback("alert-info",chrome.i18n.getMessage("FeedbackSortSucess")));
	feedback.addEventListener("click",close);
	setTimeout(close,5000);
	displayChannel();
}

function createFeedback(alertType,texte){
	var feedbackDiv = document.createElement("div");
	feedbackDiv.setAttribute("class","alert "+alertType+" alert-dismissable");
	feedbackDiv.style.marginLeft="1%";
	feedbackDiv.style.marginRight="1%";
		var a = document.createElement("a");
		a.setAttribute("class","close");
		a.setAttribute("data-dismiss","info");
		a.setAttribute("aria-label","close");
		a.innerHTML="&times";
	feedbackDiv.innerHTML=texte;
	feedbackDiv.appendChild(a);
	return feedbackDiv;
}

//change for the app token

window.onload=init();

document.body.addEventListener('onkeydown',enter);