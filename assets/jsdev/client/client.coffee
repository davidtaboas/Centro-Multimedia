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

  $("input#textoMensaje").maxlength
    alwaysShow: true
    warningClass: "label label-info"
    limitReachedClass: "label label-warning"
    placement: "top"
    message: 'usados %charsTyped% de %charsTotal% caracteres.'

  #setup some common vars
  $moveLeft   = $("#left")
  $moveRight  = $("#right")
  $sendOk     = $("#ok")
  $goHome     = $("#home")
  $goBack     = $("#goback")
  $changeMask = $("#changeMask")
  $messages   = $("#messages")
  $logout     = $("#logout, #outwaiting")
  $reload     = $("#reload")
  $sendMsg    = $(".sendmsgok")
  $viewSend   = $(".sendmsg")



  # CUSTOM BUTTONS STUFF

  socket.on "botonesUsuario", (data) ->

    if data.button is 0
      i = 1
      while i < 10
        custombutton = "#bt"+i
        $(custombutton).hide()
        $(custombutton).html("")
        i++
    else
      custombutton = "#bt" + data.button;

      $(custombutton).show()
      $(custombutton).html(data.label)

    return

  $("#bt1,#bt2,#bt3,#bt4,#bt5,#bt6,#bt7,#bt8,#bt9").on "tap", (e) ->
    socket.emit "botonesMonitor", this.id
    return




  #SOCKET STUFF
  socket.on "left", (data) ->
    console.log data
    return

  socket.on "right", (data) ->
    console.log data
    return

  # BUTTONS STUFF
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

    # boton con ocultar activo
    if $changeMask.hasClass("active") is true
      $changeMask.button('reset')
      socket.emit "filtermsgs", "all"
    else
      $changeMask.button('complete')
      socket.emit "filtermsgs", "app"

    # socket.emit "change", "mask"
    return

  $messages.on "tap", () ->
    socket.emit "change", "messages"
    return


  $logout.on "tap", () ->
    $("#login .alert-warning").fadeOut()
    $("#login .alert-success").fadeOut()
    $("#login .alert-danger").fadeOut()
    $("#login .alert-info").fadeIn()
    $("#login").show()
    socket.disconnect()
    return

  $reload.on "tap", () ->
    location.reload()
    return



  # MODAL STUFF
  $viewSend.on "tap", () ->
    $("#modalMensajes").modal('toggle')
    return

  $("button[data-dismiss='modal']").on "tap", () ->
    $("#modalMensajes").modal('toggle')
    return

  $sendMsg.on "tap", () ->

    if $("#textoMensaje").val() is ""
      $("#textoMensaje").focus()
      $("#textoMensaje").parent().addClass("has-error")
    else
      $("#modalMensajes").modal('toggle')
      socket.emit("mensaje", { texto: $("#textoMensaje").val(), caducidad: $("input[name=expiracion]:checked").val() });
      $("#textoMensaje").val("")
    return

  socket.on "logoff", (data) ->

    $("#login .alert-warning").fadeOut()
    $("#login .alert-success").fadeOut()
    $("#login .alert-danger").fadeOut()
    $("#login .alert-info").fadeIn()
    $("#login .alert-info").append "<p>Desconeción por inactividad</p>"
    $("#login").show()
    socket.disconnect()
    return


  # LOGIN STUFF
  socket.on "login", (data) ->


    if data.login is "ok"
      $(".remote-control").show()
      $("#login").fadeOut()
      $("#login .window").unbind eventos.join(' ')
    else if data.login is "go"
      $("#login").show()
      $("#login .alert-warning").fadeOut()
      $("#login .alert-success").fadeIn()
      socket.emit "monitor", "go"
      $("#login .window").bind eventos.join(' '), (e) ->
        $("#login .alert-danger").fadeOut()
        socket.emit "loginevent", e.type
        return


    else if data.login is "error"
      $("#login .alert-success").fadeOut()
      $("#login .alert-danger").fadeIn()
      console.log "Volver a intentar"



    else if data.login is "wait"
      console.log "Se ha identificado otro usuario"
      $("#login .alert-success").fadeOut()
      $("#login .alert-danger").fadeOut()
      $("#login .alert-warning").fadeIn()
      $("#login .window").unbind eventos.join(' ')


    else if data.login is "disconnect"
      $("#login .alert-warning").fadeOut()
      $("#login .alert-success").fadeOut()
      $("#login .alert-danger").fadeOut()
      $("#login .alert-info").fadeIn()
      $("#login").fadeIn()
      $(".remote-control").hide()
      socket.disconnect()
    return





  return

