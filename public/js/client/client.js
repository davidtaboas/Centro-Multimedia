
/*
//
// socketio app
//
 */
var app, socket;

socket = io.connect("http://127.0.0.1:1337/");

app = app || {};

$(function() {
  var $allMsgs, $appMsgs, $changeMask, $goBack, $goHome, $messages, $moveLeft, $moveRight, $sendOk;
  $moveLeft = $("#left");
  $moveRight = $("#right");
  $sendOk = $("#ok");
  $goHome = $("#home");
  $goBack = $("#goback");
  $changeMask = $("#changeMask");
  $messages = $("#messages");
  $appMsgs = $("#appmsgs");
  $allMsgs = $("#allmsgs");
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
});
