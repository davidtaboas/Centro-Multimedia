
/*
//
// socketio app
//
 */
var app, socket;

socket = io.connect("http://127.0.0.1:1337/");

app = app || {};

$(function() {
  var $goBack, $goHome, $moveLeft, $moveRight, $sendOk;
  $moveLeft = $("#left");
  $moveRight = $("#right");
  $sendOk = $("#ok");
  $goHome = $("#home");
  $goBack = $("#goback");
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
});
