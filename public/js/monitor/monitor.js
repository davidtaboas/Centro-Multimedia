var activarBoton, animacionVentanas, app, changeMask, currentIndex, customButtons, isActiveNavMessages, lastTabIndex, reloadControls, setContentHeight, socialcenter, socket;

socket = io.connect("http://127.0.0.1:5555/");

app = app || {};

lastTabIndex = 0;

currentIndex = 0;

activarBoton = function(id, label) {
  socket.emit("controlBotones", {
    id: id,
    label: label
  });
};

customButtons = function(id) {
  window["funciones" + id]();
};


/*
Los sockets van definidos de forma general
 */

socket.on("move", function(data) {
  if (data.move === "ok") {
    $(".current").click();
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
    document.location.href = "/monitor#/";
  } else if (data.move === "back") {
    window.history.back();
  }
});

socket.on("change", function(data) {
  if (data.change === "mask") {
    changeMask();
    setContentHeight();
  } else if (data.change === "messages") {
    $("#messages").toggle();
  }
});

socket.on("login", function(data) {
  console.log(data);
  if (data.login === "ok") {
    $("#login").fadeOut();
  } else {
    $("#login").fadeIn();
    $("#login .event div").removeClass();
    $("#login .event div").addClass(data.login);
  }
});

socket.on("button", function(data) {
  window["customButtons"](data.id);
});


/*
Función para obtener la altura del contenido
 */

setContentHeight = function() {
  var alturaContent, footerHeight;
  if (isActiveNavMessages) {
    footerHeight = $("footer").css("height");
  } else {
    footerHeight = 0;
  }
  alturaContent = $(window).height() - ($("header").height() + footerHeight + 40);
  $("#content").height(alturaContent);
  $(".galleria-container").height(alturaContent);
};


/*
Función para cambiar máscara de mensajes
 */

isActiveNavMessages = 1;

changeMask = function() {

  /*
  Si hay prioridad 0 entonces no se tiene que ocultar la máscara
   */
  if (isActiveNavMessages) {
    $("footer .bottom").animate({
      height: "0px"
    }, 200);
    isActiveNavMessages = 0;
  } else {
    $("footer .bottom").animate({
      height: "300px"
    }, 200);
    isActiveNavMessages = 1;
  }
};

animacionVentanas = function() {
  $("#views").hide().fadeIn();
};


/*
Separamos en una función los controles
que se tienen que recargar cada vez
que se cambia la página
 */

reloadControls = function() {
  var fathom, player;
  if (location.hash === "#/") {
    socket.emit("controlBotones", {
      id: 0,
      label: ""
    });
  }
  $("#content").css("background", "none");
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
  if (typeof Galleria === 'function') {
    if ($(".galleria").length > 0) {
      Galleria.loadTheme('/components/galleria/themes/classic/galleria.classic.min.js');
      Galleria.configure({
        height: $("#content").height(),
        responsive: true,
        preload: 0,
        idleMode: false
      });
      Galleria.run(".galleria");
      $("#content").css("background", "black");
    }
  }
  if (typeof Fathom === 'function') {
    if ($("#presentacion").length > 0) {
      fathom = new Fathom("#presentacion");
      if (fathom.$length > 1) {
        $(".presentacionderecha").show();
      }
      $(".presentacionizquierda").on("click", function() {
        fathom.prevSlide();
      });
      $(".presentacionderecha").on("click", function() {
        fathom.nextSlide();
      });
    }
  }
  $("a, video, .galleria-image-nav div").each(function(index) {
    $(this).prop("tabindex", index);
  });
  lastTabIndex = Number($("[tabindex]").length - 1);
  $("[tabindex=0]").addClass("current");
  currentIndex = Number($(".current").attr("tabindex"));
};

$(document).ready(function() {
  var moveRight;
  setContentHeight();
  moveRight = function() {
    $("#slider").fadeOut("slow", function() {
      $("footer").animate({
        width: "0%"
      }, 400, function() {
        $("#slider ul li:first-child").appendTo("#slider ul");
        $("footer").animate({
          width: "95%"
        }, 400, function() {
          $("#slider").fadeIn("fast", function() {});
        });
      });
    });
  };
  $("#slider ul li:last-child").prependTo("#slider ul");
  setInterval((function() {
    moveRight();
  }), 10000);
});

socialcenter = {
  protegido: function() {
    var var_protegido;
    var_protegido = prompt("¿Quieres poner la aplicación en modo protegido? (1=protegido / 0=promiscuo)", "");
    socket.emit("config", {
      protegido: var_protegido
    });
  }
};
