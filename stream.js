window.onload= function(){
	console.log(localStorage);
	chrome.windows.onFocusChanged.addListener(function(){
		focus();
	});

	new Twitch.Embed("twitch-embed", {
        width: "100%",
        height: "100%",
        layout:"video",
        channel: "ogaminglol"
      });


}