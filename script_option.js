function enregistrer()//enregistrer les options, fonction appelée par le click sur le bouton
{
	localStorage["showOffline"]=checkboxShowOffline.checked;
	showOffline=localStorage["showOffline"]=="true";
	if (!showOffline) {
		//si showoffline = false, on cache le checkbox
		divOptimisation.style.display="none";
	}else{
		divOptimisation.style.display="inherit";
	}
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

	checkboxShowOffline=document.getElementById("showOffline");
	checkboxShowOffline.checked=showOffline;
	checkboxShowOffline.addEventListener("change",enregistrer);
	//checkboxShowOffline.addEventListener("change",cacheOpti);

	checkboxOptimisation=document.getElementById("optimisationC");
	checkboxOptimisation.checked=optimisation;
	divOptimisation=document.getElementById("optimisation");
	checkboxOptimisation.addEventListener("change",enregistrerOpti);

	bouton=document.getElementsByTagName('button')[0];
	bouton.addEventListener('click',enregistrer);
	bouton.addEventListener('click',enregistrerOpti);
	channels=document.getElementById('channels');
	savediv=document.getElementById('savediv');
	savediv.addEventListener('click',save);
	myid="ufvj1hc6m9qg5txkz9ryvz0hk961cx";

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
	div.setAttribute('class',"form-group col-lg-6");

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
	displayChannel();
}

function save(){
	var name=document.getElementById('toSave').value;
	if (name) {
		//on test si la chaine existe
		document.getElementById('toSave').value="";
		if (tab.indexOf(name)!=-1) {
			//si deja dans tab
			alert("Deja dans vos chaines");
		}else{
			myajax(name,testRetour);
			console.log(name);
		}
		
	}else{
		//chaine non rempli
		alert("Chaine non rempli");
	}
}

function testRetour(httpRequest,nomChaine){
	reponse=JSON.parse(httpRequest.response);
	if (reponse['error']!=null) {
		//il y a une error
		alert("Cet utilisateur n'existe pas");
	}else{
		//on add le channel au données de l'user
		//et on refresh la page
		console.log(reponse['name']);
		var t = JSON.parse(localStorage['streams']);
		t.push(reponse['name']);
		console.log(t);
		t= JSON.stringify(t);
		localStorage['streams']=t;

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

function enter(event){
	if (event.keyCode==13) {
		//on appuie sur enter
		save();
	}
}

window.onload=init();

//var body=document.getElementsByTagName('body')[0];
//document.body.addEventListener('onkeydown',enter);
document.body.onkeydown=enter;