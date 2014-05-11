var app, changeMask, currentIndex, isActiveNavMessages, lastTabIndex, reloadControls, setContentHeight, socket;

socket = io.connect("http://127.0.0.1:5555/");

app = app || {};

lastTabIndex = 0;

currentIndex = 0;


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
    window.location.href = "/monitor";
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
      height: "150px"
    }, 200);
    isActiveNavMessages = 1;
  }
};


/*
Separamos en una función los controles
que se tienen que recargar cada vez
que se cambia la página
 */

reloadControls = function() {
  var player;
  $("#content").css("background", "none");
  $("#slider ul li").width($("body").width());
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
  $("a, video, .galleria-image-nav div").each(function(index) {
    $(this).prop("tabindex", index);
  });
  lastTabIndex = Number($("[tabindex]").length - 1);
  $("[tabindex=0]").addClass("current");
  currentIndex = Number($(".current").attr("tabindex"));
};

$(document).ready(function() {
  var moveLeft, moveRight, slideCount, slideHeight, slideWidth, sliderUlWidth;
  setContentHeight();
  moveLeft = function() {
    $("#slider ul").animate({
      left: +slideWidth
    }, 200, function() {
      $("#slider ul li:last-child").prependTo("#slider ul");
      $("#slider ul").css("left", "");
    });
  };
  moveRight = function() {
    $("#slider ul").animate({
      left: -slideWidth
    }, 200, function() {
      $("#slider ul li:first-child").appendTo("#slider ul");
      $("#slider ul").css("left", "");
    });
  };
  slideCount = $("#slider ul li").length;
  slideWidth = $("#slider ul li").width();
  slideHeight = $("#slider ul li").height();
  sliderUlWidth = slideCount * slideWidth;
  $("#slider").css({
    width: slideWidth,
    height: slideHeight
  });
  $("#slider ul").css({
    width: sliderUlWidth,
    marginLeft: -slideWidth
  });
  $("#slider ul li:last-child").prependTo("#slider ul");
  setInterval((function() {
    moveRight();
  }), 3000);
});
