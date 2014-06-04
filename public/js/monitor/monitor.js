var activarBoton, animacionVentanas, app, barraMensajes, currentIndex, customButtons, fathom, isActiveNavMessages, lastTabIndex, presentacionSlider, reloadControls, socket;

socket = io.connect("http://127.0.0.1:4444/");

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
Función para controlar el funcionamiento de la barra de mensajes
 */

isActiveNavMessages = 1;

barraMensajes = function(n) {
  if (isActiveNavMessages) {
    if (n === 0) {
      $("footer").animate({
        height: "0"
      }, 200);
      $("#content").animate({
        height: "95%"
      }, 200);
      isActiveNavMessages = 0;
    }
  } else {
    $("footer").animate({
      height: "25%"
    }, 200);
    $("#content").animate({
      height: "70%"
    }, 200);
    isActiveNavMessages = 1;
  }
};

animacionVentanas = function() {
  $("#content").css("background", "none");
  $("#content").hide().fadeIn("slow");
};


/*
Separamos en una función los controles
que se tienen que recargar cada vez
que se cambia la página
 */

fathom = "";

presentacionSlider = "";

reloadControls = function() {
  var player;
  if (location.hash === "#/") {
    socket.emit("controlBotones", {
      id: 0,
      label: ""
    });
    $(".temp").remove();
  }
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
        idleMode: false,
        debug: false
      });
      Galleria.run(".galleria");
      $("#content").css("background", "black");
    }
  }
  if (typeof Fathom === 'function') {
    if ($("#presentacion").length > 0) {
      fathom = new Fathom("#presentacion", {
        displayMode: 'single',
        margin: 0,
        onActivateSlide: function() {
          if (fathom) {
            $(".currentSlide").html(fathom.$slides.index(fathom.$activeSlide) + 1);
          }
          $(this).hide().fadeIn();
        },
        onDeactivateSlide: function() {
          $(this).fadeOut();
        }
      });
      $(".totalSlides").html(fathom.$slides.length);
      $(".auto input").on("click", function() {
        if (this.checked) {
          presentacionSlider = setInterval((function() {
            if (fathom.$lastSlide[0] === fathom.$activeSlide[0]) {
              fathom.activateSlide(fathom.$firstSlide);
              fathom.scrollToSlide(fathom.$firstSlide);
            } else {
              fathom.nextSlide();
            }
          }), 10000);
        } else {
          clearInterval(presentacionSlider);
        }
      });
    }
  }
  $("a, video, .galleria-image-nav div, .auto input").each(function(index) {
    $(this).prop("tabindex", index);
  });
  lastTabIndex = Number($("[tabindex]").length - 1);
  $("[tabindex=0]").addClass("current");
  currentIndex = Number($(".current").attr("tabindex"));
};

$(document).ready(function() {
  var protegido, sliderBarra;
  protegido = 0;
  $(".clickProtegido").on("click", function() {
    if (protegido === 0) {
      protegido = 1;
      $(".clickProtegido").button("toggle");
      $(".modoprotegido").removeClass("hide").addClass("show");
    } else if (protegido === 1) {
      protegido = 0;
      $(".clickProtegido").button("toggle");
      $(".modoprotegido").removeClass("show").addClass("hide");
    }
    socket.emit("config", {
      protegido: protegido
    });
  });
  sliderBarra = function() {
    if ($("#slider ul li").length > 1) {
      $("#slider ul li:not(:first-child) .mensaje").fadeOut(400);
      $("#slider ul li:first-child .mensaje").fadeOut(400, function() {
        $("#slider ul li:not(:first-child)").css("width", "0%");
        $("#slider ul li:first-child").animate({
          width: "0%"
        }, 400, function() {
          $("#slider ul li:first-child").appendTo("#slider ul");
          $("#slider ul li:first-child").animate({
            width: "95%"
          }, 400, function() {
            $("#slider ul li .mensaje").fadeIn(400);
          });
        });
      });
    }
  };
  $("#slider ul li:last-child").prependTo("#slider ul");
  setInterval((function() {
    sliderBarra();
  }), 5000);
});
