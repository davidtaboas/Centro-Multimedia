var app, changeMask, currentMask, masks, messages, pushMsg, reloadControls, socket;

socket = io.connect("http://127.0.0.1:5555/");

app = app || {};


/*
Los sockets van definidos de forma general
 */

socket.on("move", function(data) {
  var currentIndex;
  if (data.move === "ok") {
    $(current).click();
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

socket.on("msg", function(data) {
  console.log(data);
  changeMask(currentMask);
  pushMsg(data);
});

socket.on("change", function(data) {
  changeMask(currentMask);
});


/*
Función para recibir mensajes
 */

messages = [];

pushMsg = function(data) {
  var p;
  messages.push(data);
  p = document.createElement("p");
  $("#messages div p").each(function(index) {
    $(this).fadeOut("fast");
  });
  $(p).addClass("last").append("<span class='" + data.priority + "'>" + decodeURI(data.msg) + "</span>");
  $("#messages div").append($(p).fadeIn("slow"));
};


/*
Función para cambiar máscara de mensajes
 */

masks = ["none", "bottom", "popup"];

currentMask = 0;

changeMask = function(current) {

  /*
  
  Si hay prioridad 0 entonces no se tiene que ocultar la máscara
  
  if currentMask is masks.indexOf("none")
    currentMask = masks.indexOf("none")+1
   */
  currentMask = (currentMask + 1) % masks.length;
  $("#messages div").removeClass();
  $("#messages div").addClass(masks[currentMask]);
};


/*
Separamos en una función los controles
que se tienen que recargar cada vez
que se cambia la página
 */

reloadControls = function() {
  var current, currentIndex, lastTabIndex, player;
  if (typeof MediaElementPlayer === 'function') {
    if ($("video").length > 0) {
      $("video").mediaelementplayer();
      player = new MediaElementPlayer("video");
      $("video").on("play", function() {
        player.enterFullScreen();
      });
      $("video").on("ended", function() {
        player.exitFullScreen();
      });
    }
  }
  $("a, video").each(function(index) {
    $(this).prop("tabindex", index);
  });
  lastTabIndex = Number($("[tabindex]").length - 1);
  $("[tabindex=0]").addClass("current");
  current = $(".current");
  currentIndex = Number(current.attr("tabindex"));
};
