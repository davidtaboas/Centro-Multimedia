
/*
//
// socketio app
//
 */
var app, socket;

socket = io.connect("http://192.168.1.36:1337/");

app = app || {};

$(function() {
  var $allMsgs, $appMsgs, $changeMask, $goBack, $goHome, $logout, $messages, $moveLeft, $moveRight, $reload, $sendMsg, $sendOk, $viewSend;
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
  $logout = $("#logout, #outwaiting");
  $reload = $("#reload");
  $sendMsg = $(".sendmsgok");
  $viewSend = $(".sendmsg");
  socket.on("botonesUsuario", function(data) {
    var custombutton, i;
    if (data.button === 0) {
      i = 1;
      while (i < 10) {
        custombutton = "#bt" + i;
        $(custombutton).hide();
        $(custombutton).html("");
        i++;
      }
    } else {
      custombutton = "#bt" + data.button;
      $(custombutton).show();
      $(custombutton).html(data.label);
    }
  });
  $("#bt1,#bt2,#bt3,#bt4,#bt5,#bt6,#bt7,#bt8,#bt9").on("tap", function(e) {
    socket.emit("botonesMonitor", this.id);
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
    $("#login").show();
    socket.disconnect();
  });
  $reload.on("tap", function() {
    location.reload();
  });
  $viewSend.on("tap", function() {
    $("#modalMensajes").modal('toggle');
  });
  $("button[data-dismiss='modal']").on("tap", function() {
    $("#modalMensajes").modal('toggle');
  });
  $sendMsg.on("tap", function() {
    if ($("#textoMensaje").val() === "") {
      $("#textoMensaje").focus();
      $("#textoMensaje").parent().addClass("has-error");
    } else {
      $("#modalMensajes").modal('toggle');
      socket.emit("mensaje", {
        texto: $("#textoMensaje").val(),
        caducidad: $("#caducidadMensaje").val()
      });
    }
  });
  socket.on("login", function(data) {
    if (data.login === "ok") {
      $(".remote-control").show();
      $("#login").fadeOut();
      $("#login .window").unbind(eventos.join(' '));
    } else if (data.login === "go") {
      $("#login").show();
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
      $(".remote-control").hide();
      socket.disconnect();
    }
  });
});
