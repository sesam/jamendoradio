function manipulatePage() {
    overrideLinks("jambutton_miniactionicon_inner");
    overrideLinks("jambutton_bigactionicon");
    overrideLinks("album_simple_play");
    overrideLinks("container_artistpage_play");
    overrideLinks("visual_radio");
    overrideLinks("jambutton_playbutton_maxi");
    overrideLinks("g_playbutton");
    overrideLinks("jambutton_smallactionicon");

	createArtistRadio("info_artistapage_avatar");
}

function overrideLinks(cssClass) {
	var playButtons = document.body.getElementsByClassName(cssClass);
	for(i = 0; i < playButtons.length; i++) {
	    playButtons[i].onclick = start;
		
		var subLinks = playButtons[i].getElementsByTagName("a");
		for(j = 0; j < subLinks.length; j++) {
			if(subLinks[j].onclick) subLinks[j].onclick = "";
		}
	}
}

function createArtistRadio(cssClass) {
	var playButton = document.body.getElementsByClassName(cssClass)[0];
	playButton.onclick = function() {
	    chrome.extension.sendRequest({ target: "loadArtistRadio", data: /artist\/([\w\.%]+)/.exec(location.href)[1] }, function (response) { }); 
		return false;
	}
}

function start() {
    var rxRadio = new RegExp("radio\\/(\\d+)'");
    var rxTrack = new RegExp("\\?id=(\\d+)");
    var rxAlbum = new RegExp("album\\/(\\d+)'");
    var rxPlaylist = new RegExp("playlist\\/(\\d+)'");
    var rxMisc = new RegExp("misc/([\\d+/]+)");
    var rxMiscId = new RegExp("\\d+", "g");
    var rxMiscIndex = new RegExp("/(\\d*)");

    if (this.innerHTML.match(rxRadio))
        chrome.extension.sendRequest({ target: "loadRadioPlayList", data: rxRadio.exec(this.innerHTML)[1] }, function (response) { });
    else if (this.innerHTML.match(rxTrack))
        chrome.extension.sendRequest({ target: "loadTrackPlayList", data: rxTrack.exec(this.innerHTML)[1] }, function (response) { });
    else if (this.innerHTML.match(rxAlbum))
        chrome.extension.sendRequest({ target: "loadAlbumPlayList", data: rxAlbum.exec(this.innerHTML)[1] }, function (response) { });
    else if (this.innerHTML.match(rxPlaylist))
        chrome.extension.sendRequest({ target: "loadPlayList", data: rxPlaylist.exec(this.innerHTML)[1] }, function (response) { });

    else if (this.innerHTML.match(rxMisc)) {
        var ids = rxMisc.exec(this.innerHTML)[1];
        var index = parseInt(rxMiscIndex.exec(ids)[1]);

        for (i = 0; i < index; i++) rxMiscId.exec(ids);
        chrome.extension.sendRequest({ target: "loadTrackPlayList", data: rxMiscId.exec(ids)[0] }, function (response) { });
    }

    return false;
}

chrome.extension.sendRequest({target: "manipulatePage"}, function(response) { if(response.GoAhead) manipulatePage(); });