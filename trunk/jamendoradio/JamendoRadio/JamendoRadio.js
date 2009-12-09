function manipulatePage() {
	overrideAlbumLinks("album_simple_play");
	overrideAlbumLinks("album_browser_playbutton");
	overrideAlbumLinks("album_page_big_play");
	overrideAlbumLinks("container_artistpage_play");
	overrideTrackLinks("trackstable_play");
	createArtistRadio("info_artistapage_avatar");
}

function overrideTrackLinks(cssClass) {
	var playButtons = document.body.getElementsByClassName(cssClass);
	for(i = 0; i < playButtons.length; i++) {
		playButtons[i].onclick = function() { 
			chrome.extension.sendRequest({target: "loadTrackPlayList", data: /id=(\d+)/.exec(this.innerHTML)[1]}, function(response) { }); 
			return false; 
		}
		
		var subLinks = playButtons[i].getElementsByTagName("a");
		for(j = 0; j < subLinks.length; j++) {
			if(subLinks[j].onclick) subLinks[j].onclick = "";
		}
	}
}

function overrideAlbumLinks(cssClass) {
	var playButtons = document.body.getElementsByClassName(cssClass);
	for(i = 0; i < playButtons.length; i++) {
		playButtons[i].onclick = function() { 
			chrome.extension.sendRequest({target: "loadAlbumPlayList", data: /album.(\d+)/.exec(this.innerHTML)[1]}, function(response) { }); 
			return false; 
		}
		
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
chrome.extension.sendRequest({target: "manipulatePage"}, function(response) { if(response.GoAhead) manipulatePage(); });