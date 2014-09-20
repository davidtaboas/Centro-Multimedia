var appVideos, player,s;

if ($("video").length > 0) {
  s = document.createElement("link");
  s.rel = "stylesheet";
  s.href = "/components/mediaelement/build/mediaelementplayer.min.css";
  s.className = "temp";
  $("head").append(s);
}


appVideos = function() {
    activarBoton('1', 'Pausa');
    activarBoton('2', 'Play');
    activarBoton('3', 'Stop');
    window["funcionesbt1"] = function() {
        player.pause();
    };
    window["funcionesbt2"] = function() {
        player.play();
    };
    window["funcionesbt3"] = function() {
        player.pause();
        player.exitFullScreen();
    };

    $(".current").on("click", function(event){
        event.preventDefault();
        player = new MediaElementPlayer("video.current");


    });

    $("video").on("play", function() {
        player = new MediaElementPlayer("video.current");
        player.play()
        player.enterFullScreen();
    });

    $("video.current").on("ended", function() {
        player.exitFullScreen();
    });
};

$("video").mediaelementplayer();
player = new MediaElementPlayer("video");
appVideos()
