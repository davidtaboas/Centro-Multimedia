###
//
// socketio app
//
###

# connect to our socket server
socket = io.connect("http://192.168.1.36:1337/")
app = app or {}


# array de posibles eventos

eventos = ["tap","hold","singleTap","doubleTap","touch","swipe","swipeLeft","swipeRight","swipeUp","swipeDown","rotate","rotateLeft","rotateRight","pinch","pinchIn","pinchOut"]

login = () ->
  $("#login").remove()
  return
# shortcut for document.ready
$ ->

  #setup some common vars
  $moveLeft   = $("#left")
  $moveRight  = $("#right")
  $sendOk     = $("#ok")
  $goHome     = $("#home")
  $goBack     = $("#goback")
  $changeMask = $("#changeMask")
  $messages   = $("#messages")
  $appMsgs    = $("#appmsgs")
  $allMsgs    = $("#allmsgs")
  #SOCKET STUFF
  socket.on "left", (data) ->
    console.log data
    return

  socket.on "right", (data) ->
    console.log data
    return

  $moveLeft.on "tap", () ->
    socket.emit "move", "prev"
    return

  $moveRight.on "tap", () ->
    socket.emit "move", "next"
    return

  $sendOk.on "tap", () ->
    socket.emit "move", "ok"
    return

  $goHome.on "tap", () ->
    socket.emit "control", "home"
    return

  $goBack.on "tap", () ->
    socket.emit "control", "back"
    return

  $changeMask.on "tap", () ->
    socket.emit "change", "mask"
    return

  $messages.on "tap", () ->
    socket.emit "change", "messages"
    return

  $appMsgs.on "tap", () ->
    socket.emit "filtermsgs", "app"
    return

  $allMsgs.on "tap", () ->
    socket.emit "filtermsgs", "all"
    return


  eventos.sort () ->
    return 0.5 - Math.random()

  console.log eventos
  alert eventos[0]
  $$("#login .window").on eventos[0], login

  return

