
/*
//
// socketio app
//
 */
var app, socket;

socket = io.connect("http://192.168.1.36:1337/");

app = app || {};

$(function() {
  var $allMsgs, $appMsgs, $changeMask, $goBack, $goHome, $logout, $messages, $moveLeft, $moveRight, $sendMsg, $sendOk;
  $("#caducidadMensaje").slider({
    tooltip: "show"
  });
  $("#caducidadMensaje").on("slide", function(slideEvt) {
    $("#ex6SliderVal").text(slideEvt.value / 24);
  });
  $("#login h1").textfill();
  $moveLeft = $("#left");
  $moveRight = $("#right");
  $sendOk = $("#ok");
  $goHome = $("#home");
  $goBack = $("#goback");
  $changeMask = $("#changeMask");
  $messages = $("#messages");
  $appMsgs = $("#appmsgs");
  $allMsgs = $("#allmsgs");
  $logout = $("#logout");
  $sendMsg = $(".sendmsgok");
  $sendMsg.on("tap", function() {
    if ($("#textoMensaje").val() === "") {
      $("#textoMensaje").focus();
      $("#textoMensaje").parent().addClass("has-error");
    } else {
      $("#modalMensajes").modal('hide');
      socket.emit("mensaje", {
        texto: $("#textoMensaje").val(),
        caducidad: $("#caducidadMensaje").val()
      });
    }
  });
  socket.on("left", function(data) {
    console.log(data);
  });
  socket.on("right", function(data) {
    console.log(data);
  });
  $moveLeft.on("tap", function() {
    socket.emit("move", "prev");
  });
  $moveRight.on("tap", function() {
    socket.emit("move", "next");
  });
  $sendOk.on("tap", function() {
    socket.emit("move", "ok");
  });
  $goHome.on("tap", function() {
    socket.emit("control", "home");
  });
  $goBack.on("tap", function() {
    socket.emit("control", "back");
  });
  $changeMask.on("tap", function() {
    socket.emit("change", "mask");
  });
  $messages.on("tap", function() {
    socket.emit("change", "messages");
  });
  $appMsgs.on("tap", function() {
    socket.emit("filtermsgs", "app");
  });
  $allMsgs.on("tap", function() {
    socket.emit("filtermsgs", "all");
  });
  $logout.on("tap", function() {
    $("#login .alert-warning").fadeOut();
    $("#login .alert-success").fadeOut();
    $("#login .alert-danger").fadeOut();
    $("#login .alert-info").fadeIn();
    $("#login").fadeIn();
    socket.disconnect();
  });
  socket.on("login", function(data) {
    if (data.login === "ok") {
      $("#login").fadeOut();
      $("#login .window").unbind(eventos.join(' '));
    } else if (data.login === "go") {
      $("#login").fadeIn();
      $("#login .alert-warning").fadeOut();
      $("#login .alert-success").fadeIn();
      socket.emit("monitor", "go");
      $("#login .window").bind(eventos.join(' '), function(e) {
        $("#login .alert-danger").fadeOut();
        socket.emit("loginevent", e.type);
      });
    } else if (data.login === "error") {
      $("#login .alert-success").fadeOut();
      $("#login .alert-danger").fadeIn();
      console.log("Volver a intentar");
    } else if (data.login === "wait") {
      console.log("Se ha identificado otro usuario");
      $("#login .alert-success").fadeOut();
      $("#login .alert-danger").fadeOut();
      $("#login .alert-warning").fadeIn();
      $("#login .window").unbind(eventos.join(' '));
    } else if (data.login === "disconnect") {
      $("#login .alert-warning").fadeOut();
      $("#login .alert-success").fadeOut();
      $("#login .alert-danger").fadeOut();
      $("#login .alert-info").fadeIn();
      $("#login").fadeIn();
      socket.disconnect();
    }
  });
});
