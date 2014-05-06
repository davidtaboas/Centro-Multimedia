
/*
//
// socketio app
//
 */
var app, eventos, login, socket;

socket = io.connect("http://192.168.1.36:1337/");

app = app || {};

eventos = ["tap", "hold", "singleTap", "doubleTap", "touch", "swipe", "swipeLeft", "swipeRight", "swipeUp", "swipeDown", "rotate", "rotateLeft", "rotateRight", "pinch", "pinchIn", "pinchOut"];

login = function() {
  $("#login").remove();
};

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
  eventos.sort(function() {
    return 0.5 - Math.random();
  });
  console.log(eventos);
  alert(eventos[0]);
  $$("#login .window").on(eventos[0], login);
});
