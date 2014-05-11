###
//
// socketio app
//
###

# connect to our socket server
socket = io.connect("http://192.168.1.36:1337/")
app = app or {}


# shortcut for document.ready
$ ->

  $("#login h1").textfill()


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


  ## GESTION DE EVENTOS PARA IDENTIFICACION

  console.log eventos

  socket.on "login", (data) ->


    if data.login is "ok"
      $("#login").fadeOut()
    else
      $("#login .alert").fadeIn()
      console.log "Volver a intentar"

    return


  $("#login .window").bind eventos.join(' '), (e) ->
    $("#login .alert").fadeOut()
    socket.emit "loginevent", e.type
    return


  return

