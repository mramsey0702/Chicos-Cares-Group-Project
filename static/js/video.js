var youtube_id = CMNH.videoId;
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

CMNH.videoPlayers = CMNH.videoPlayers || {};

window.onYouTubeIframeAPIReady = function() {
    CMNH.videoPlayers.large = new YT.Player('ytPlayer-large', {
        videoId: youtube_id,
        wmode: 'opaque',
        playerVars: {
            autohide: 1,
            enablejsapi: 1,
            html5: 1,
           // origin: window.location.protocol + "//" + window.location.host,
            autoplay: 0,
            modestbranding: 1,
            forceSSL: false,
            rel: 0
        },
        events: {
            'onReady': CMNH.onPlayerReady,
            'onStateChange': CMNH.onPlayerStateChange
        }
    });
    
    CMNH.videoPlayers.small = new YT.Player('ytPlayer-small', {
        videoId: youtube_id,
        wmode: 'opaque',
        playerVars: {
            autohide: 1,
            enablejsapi: 1,
            html5: 1,
        //    origin: window.location.protocol + "//" + window.location.host,
            autoplay: 0,
            modestbranding: 1,
            forceSSL: false,
            rel: 0
        },
        events: {
            'onReady': CMNH.onPlayerReady,
            'onStateChange': CMNH.onPlayerStateChange
        }
    });

    CMNH.videoPlayers.large.state = -1;
    CMNH.videoPlayers.large.ready = false;
    CMNH.videoPlayers.small.state = -1;
    CMNH.videoPlayers.small.ready = false;
}

CMNH.onPlayerReady = function(event) {
    
    event.target.ready = true;
    var targetID = $(event.target.getIframe()).attr('id');
    //console.log('playerReady', targetID);

    if (targetID == 'ytPlayer-large') {
        CMNH.onResize();
        CMNH.videoPlayers.large.setPlaybackQuality('hd720');
        $('.play-button, .watch-video-button').animate({
            opacity: 1
        }, 500, function(){
            // console.log('this: ', this);
            $(this).css('cursor', 'pointer');
            $(this).removeClass('disabled');
            $(this).on('click', function(e){
                e.preventDefault();
                CMNH.playVideo(event.target);
				ga('send', 'event', 'Video', 'Clicked Play', {'nonInteraction': true});
            });
        });
		$('.play-video-anywhere').on('click', function(e){
			e.preventDefault();
			CMNH.playVideo(event.target);
			$('html,body').animate({
        		scrollTop: $(".subnav-wrapper").offset().top},
        	'slow');
			ga('send', 'event', 'Video', 'Clicked Play', {'nonInteraction': true});
		});
    }
}

CMNH.onPlayerStateChange = function(event) {

/* 
    player states:
        YT.PlayerState.ENDED
        YT.PlayerState.PLAYING
        YT.PlayerState.PAUSED
        YT.PlayerState.BUFFERING
        YT.PlayerState.CUED
*/

    event.target.state = event.data;

    if (event.target.state == YT.PlayerState.BUFFERING) {
		ga('send', 'event', 'Video', 'Started', {'nonInteraction': 1});
    }

    if (event.target.state == YT.PlayerState.ENDED) {
		ga('send', 'event', 'Video', 'Ended', {'nonInteraction': 1});
    }
    
    //console.log('states - large: ' + CMNH.videoPlayers.large.state + ', small: ' + CMNH.videoPlayers.small.state);
}

CMNH.playVideo = function(player){
    console.log(player);
    console.log(navigator.userAgent);
    var isMobile = /(iPad|iPhone|iPod|Android)/g.test(navigator.userAgent);
    console.log('isMobile?', isMobile);
    if (!isMobile) {
        console.log('playing');
        player.playVideo();
    }
    $('.hero-panel-desktop').animate({
        opacity: 0
    }, 1000, function(){
        console.log(this);
        $(this).css('display', 'none');
    });        
}