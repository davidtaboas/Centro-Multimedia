(function() {
  var app, socket;

  socket = io.connect("http://127.0.0.1:5555/");

  app = app || {};

  $(function() {
    var current, currentIndex, lastTabIndex, player;
    if (typeof MediaElementPlayer === 'function') {
      $("video").mediaelementplayer();
      player = new MediaElementPlayer("video");
      $("video").on("play", function() {
        player.enterFullScreen();
      });
      $("video").on("ended", function() {
        player.exitFullScreen();
      });
    }
    $("a, video").each(function(index) {
      $(this).prop("tabindex", index);
    });
    lastTabIndex = Number($("[tabindex]").length - 1);
    console.log(lastTabIndex);
    $("[tabindex=0]").addClass("current");
    current = $(".current");
    currentIndex = Number(current.attr("tabindex"));
    socket.on("move", function(data) {
      if (data.move === "ok") {
        $(current)[0].click();
      } else {
        $(".current").removeClass("current");
        if (data.move === "next") {
          if (currentIndex === lastTabIndex) {
            currentIndex = 0;
          } else {
            currentIndex += 1;
          }
        } else if (data.move === "prev") {
          if (currentIndex === 0) {
            currentIndex = lastTabIndex;
          } else {
            currentIndex -= 1;
          }
        }
        $("[tabindex=" + currentIndex + "]").addClass("current");
      }
    });
    socket.on("control", function(data) {
      if (data.move === "home") {
        window.location.href = "/monitor";
      } else if (data.move === "back") {
        window.history.back();
      }
    });
  });

}).call(this);
