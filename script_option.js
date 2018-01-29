function enregistrer()//enregistrer les options, fonction appelée par le click sur le bouton
{
	localStorage["showOffline"]=checkboxShowOffline.checked;
	localStorage['multitwitch']=checkboxMulti.checked;
	localStorage['notifOnLaunch']=checkboxOnLaunch.checked;
	timeInterval=parseInt(inputTimeInterval.value)*1000;
	if (timeInterval<10000) {
		timeInterval=10000;
	}
	localStorage['timeInterval']=timeInterval;
	notifOnLaunch=checkboxOnLaunch.checked;
	showOffline=localStorage["showOffline"]=="true";
	enregistrerOpti();
	if (!showOffline) {
		//si showoffline = false, on cache le checkbox
		divOptimisation.style.display="none";
	}else{
		divOptimisation.style.display="inherit";
	}
	feedback2.innerHTML='<div class="alert alert-success alert-dismissable" style="margin-left: -10px;margin-right: 30px;">  <a href="#" class="close" data-dismiss="success" aria-label="close">&times;</a><strong>Success!</strong> Options modifiés avec succès !</div>';
	feedback2.addEventListener("click",close2);
}

function enregistrerOpti()//enregistrer les options, fonction appelée par le click sur le bouton
{
	localStorage["optimisation"]=checkboxOptimisation.checked;
	optimisation=localStorage["optimisation"]=="true";
}

function init(){
	//initialisation des variables globales
	showOffline=localStorage["showOffline"]=="true";
	optimisation=localStorage["optimisation"]=="true";
	multitwitch=localStorage["multitwitch"]=="true";
	notifOnLaunch=localStorage["notifOnLaunch"]=="true";
	timeInterval=parseInt(localStorage["timeInterval"]);
	if (timeInterval==undefined) {
		timeInterval=10000;
		localStorage["timeInterval"]=timeInterval;
	}

	checkboxMulti=document.getElementById("multitwitch");
	checkboxMulti.checked=showOffline;
	//checkboxMulti.addEventListener("change",enregistrer);

	checkboxShowOffline=document.getElementById("showOffline");
	checkboxShowOffline.checked=showOffline;
	checkboxShowOffline.addEventListener("change",enregistrer);
	//checkboxShowOffline.addEventListener("change",cacheOpti);

	checkboxOptimisation=document.getElementById("optimisationC");
	checkboxOptimisation.checked=optimisation;
	divOptimisation=document.getElementById("optimisation");
	//checkboxOptimisation.addEventListener("change",enregistrerOpti);

	checkboxOnLaunch=document.getElementById("notifOnLaunch");
	checkboxOnLaunch.checked=notifOnLaunch;

	buttonInputChannelFollow=document.getElementById("buttonChannelName");
	buttonInputChannelFollow.addEventListener("click",getFollow);


	inputTimeInterval=document.getElementById('timeInterval').children[0].children[0];
	inputTimeInterval.value=timeInterval/1000;
	console.log(inputTimeInterval);

	bouton=document.getElementsByTagName('button')[0];
	bouton.addEventListener('click',enregistrer);
	bouton.addEventListener('click',enregistrerOpti);
	channels=document.getElementById('channels');
	savediv=document.getElementById('savediv');
	savediv.addEventListener('click',save);
	myid="ufvj1hc6m9qg5txkz9ryvz0hk961cx";

	feedback = document.getElementById("feedback");
	feedback2 = document.getElementById("feedback2");
	feedback3 = document.getElementById('feedback3');

	if (!showOffline) {
		//si showoffline = false, on cache le checkbox
		divOptimisation.style.display="none";
	}

	//enregistrer();
	displayChannel();
}

function displayChannel(){
	clearChannel();
	tab=JSON.parse(localStorage['streams']);
	for (var i = 0; i < tab.length; i++) {
		if(!optimisation){
			myajax(tab[i],displayName);
		}else{
			var request=[];
			request["display_name"]=tab[i];
			displayName(request, true);
		}
	}
}

function displayName(httpRequest, opti){
	if (opti) {
		var reponse=httpRequest;
	} else {
		var reponse=JSON.parse(httpRequest.response);
	}
	
	var div=document.createElement('div');
	div.setAttribute('class',"form-group col-xs-4");

	var label=document.createElement('label')
	label.setAttribute('class','sr-only');
	label.setAttribute('for','channel');
	label.innerHTML='Channel';

	var div2=document.createElement('div');
	div2.setAttribute('class','input-group');
	var div3=document.createElement('div');
	div3.setAttribute('class','input-group-addon');
	div3.innerHTML="<i class='fa fa-times' aria-hidden='true'></i>";
	div3.addEventListener('click',deleteChannel);
	var input=document.createElement('input');
	input.type='text';
	input.setAttribute('class','form-control text-center');
	input.setAttribute('id','channel');
	input.setAttribute("disabled","disabled");
	input.value=reponse['display_name'];

	div.appendChild(label);
	div2.appendChild(div3);
	div2.appendChild(input);
	div.appendChild(div2);
	channels.appendChild(div);
}

function clearChannel(){
	channels.innerHTML='';
}

function deleteChannel(event){
	var div=event.path[2];
	var name=div.getElementsByTagName('input')[0].value;
	var index=tab.indexOf(name);
	var tab2=tab.splice(index,1);
	localStorage['streams']=JSON.stringify(tab);

	feedback.innerHTML='<div class="alert alert-info alert-dismissable" style="margin-left: -10px;margin-right: 30px;">  <a href="#" class="close" data-dismiss="info" aria-label="close">&times;</a><strong>Success!</strong> Chaîne supprimé avec succès !</div>';
	feedback.addEventListener("click",close);
	displayChannel();
}

function save(){
	var name=document.getElementById('toSave').value;
	if (name) {
		//on test si la chaine existe
		document.getElementById('toSave').value="";
		if (tab.indexOf(name)!=-1) {
			//si deja dans tab
			//alert("Deja dans vos chaines");
			feedback.innerHTML='<div class="alert alert-danger alert-dismissable" style="margin-left: -10px;margin-right: 30px;">  <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Error!</strong> Vous avez déjà enregistré cette chaine</div>';
			feedback.addEventListener("click",close);
		}else{
			myajax(name,testRetour);
			console.log(name);
		}
		
	}else{
		//chaine non rempli
		//alert("Chaine non rempli");
		feedback.innerHTML='<div class="alert alert-danger alert-dismissable" style="margin-left: -10px;margin-right: 30px;">  <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Error!</strong> Nom de la chaine vide</div>';
		feedback.addEventListener("click",close);
	}
	document.getElementById('toSave').focus();
}

function testRetour(httpRequest,nomChaine){
	reponse=JSON.parse(httpRequest.response);
	if (reponse['error']!=null) {
		//il y a une error
		//alert("Cet utilisateur n'existe pas");
		feedback.innerHTML='<div class="alert alert-danger alert-dismissable" style="margin-left: -10px;margin-right: 30px;">  <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Error!</strong> Utilisateur inconnu</div>';
		feedback.addEventListener("click",close);
	}else{
		//on add le channel au données de l'user
		//et on refresh la page
		console.log(reponse['name']);
		var t = JSON.parse(localStorage['streams']);
		t.push(reponse['name']);
		console.log(t);
		t= JSON.stringify(t);
		localStorage['streams']=t;

		feedback.innerHTML='<div class="alert alert-success alert-dismissable" style="margin-left: -10px;margin-right: 30px;">  <a href="#" class="close" data-dismiss="success" aria-label="close">&times;</a><strong>Success!</strong> Chaîne ajouté avec succès !</div>';
		feedback.addEventListener("click",close);

		displayChannel();
	}
}

function myajax(nomChaine, callBack) {
    var httpRequest = new XMLHttpRequest();
    var url="https://api.twitch.tv/kraken/channels/"+nomChaine;
    httpRequest.open("GET", url, false);
    httpRequest.setRequestHeader('Client-ID',myid);
    httpRequest.setRequestHeader("Content-Type", "application/json");
    httpRequest.addEventListener("load", function () {
        callBack(httpRequest,false);
    });
    httpRequest.send();
}


function myajaxName(nomChaine, callBack) {
    var httpRequest = new XMLHttpRequest();
    var url="https://api.twitch.tv/helix/users?id="+nomChaine;
    httpRequest.open("GET", url, false);
    httpRequest.setRequestHeader('Client-ID',myid);
    httpRequest.setRequestHeader("Content-Type", "application/json");
    httpRequest.addEventListener("load", function () {
        callBack(JSON.parse(httpRequest.responseText));
    });
    httpRequest.send();
}

function myajaxId(nomChaine, callBack) {
    var httpRequest = new XMLHttpRequest();
    var url="https://api.twitch.tv/kraken/users/"+nomChaine;
    httpRequest.open("GET", url, false);
    httpRequest.setRequestHeader('Client-ID',myid);
    httpRequest.setRequestHeader("Content-Type", "application/json");
    httpRequest.addEventListener("load", function () {
        //callBack(httpRequest,false);
        var req = JSON.parse(httpRequest.responseText);
        console.log(req['error']);
        if (req.error!=null) {
        	feedback3.innerHTML='<div class="alert alert-danger alert-dismissable" style="margin-left: -10px;margin-right: 30px;">  <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Erreur!</strong> Utilisateur inconnu</div>';
			feedback3.addEventListener("click",close3);
        } else {
        	var idchaine=req._id;
	        console.log(idchaine);
	        myajaxFollow(idchaine,callBack);
        }
    });
    httpRequest.send();
}

function myajaxFollow(userid, callBack) {
    var httpRequest = new XMLHttpRequest();
    var url = "https://api.twitch.tv/helix/users/follows?from_id="+userid;
    httpRequest.open("GET", url, false);
    httpRequest.setRequestHeader('Client-ID',myid);
    httpRequest.setRequestHeader("Content-Type", "application/json");
    httpRequest.addEventListener("load", function () {
        callBack(JSON.parse(httpRequest.responseText).data);
    });
    httpRequest.send();
}	


function enter(event){
	if (event.keyCode==13) {
		//on appuie sur enter
		save();
	}
}

function close(){
	feedback.innerHTML="";
	feedback.removeEventListener("click",close);
}

function close2(){
	feedback2.innerHTML="";
	feedback2.removeEventListener("click",close2);
}

function close3(){
	feedback3.innerHTML="";
	feedback3.removeEventListener("click",close3);
}

function getFollow() {
	var username=document.getElementById("toChannelName").value;
	document.getElementById("toChannelName").value="";
	console.log(username);
	feedback3.innerHTML='<div class="alert alert-info alert-dismissable" style="margin-left: -10px;margin-right: 30px;">  <a href="#" class="close" data-dismiss="info" aria-label="close">&times;</a>Récupération en cours !</div>';
	feedback3.addEventListener("click",close3);
	myajaxId(username,updateTab);
	

}

function updateTab(tab) {
	feedback3.innerHTML='<div class="alert alert-info alert-dismissable" style="margin-left: -10px;margin-right: 30px;">  <a href="#" class="close" data-dismiss="info" aria-label="close">&times;</a><strong>Success!</strong> Récupération réalisé avec succès !</div>';
	feedback3.addEventListener("click",close3);
	total=tab.length;
	for (var i = 0; i <tab.length-1; i++) {
		myajaxName(tab[i].to_id,checkandaddTab);
	}
}

function checkandaddTab(name){
	var username=name.data[0].login;
	total--;
	console.log(total);
	if (!tab.includes(username)) {
		console.log(username);
		tab.push(username);
	}
	if (total<=1) {
		console.log("total");
		document.getElementById("toChannelName").value="";
		localStorage["streams"]=JSON.stringify(tab);
		displayChannel();
	}
}

window.onload=init();

//var body=document.getElementsByTagName('body')[0];
//document.body.addEventListener('onkeydown',enter);
document.body.onkeydown=enter;