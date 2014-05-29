
# connect to our socket server
socket = io.connect("http://127.0.0.1:5555/")
app = app or {}

lastTabIndex = 0
currentIndex = 0

# GESTION DE BOTONES
activarBoton = (id, label) ->

  socket.emit "controlBotones", {id: id, label: label}
  return

customButtons = (id) ->

  window["funciones"+id]()

  return

###
Los sockets van definidos de forma general
###
socket.on "move", (data) ->

  if data.move is "ok"
    $(".current").click()
  else
    $(".current").removeClass "current"
    if data.move is "next"
      if currentIndex == lastTabIndex
        currentIndex = 0
      else
        currentIndex += 1
    else if data.move is "prev"

      if currentIndex == 0
        currentIndex = lastTabIndex
      else
        currentIndex -= 1



    $("[tabindex="+ (currentIndex) + "]").addClass "current"

  return

socket.on "control", (data) ->

  if data.move is "home"
    document.location.href = "/monitor#/"
  else if data.move is "back"
    window.history.back()
  return




socket.on "change", (data) ->
  if data.change is "mask"
    changeMask()
    setContentHeight()
  else if data.change is "messages"
    $("#messages").toggle()
  return

socket.on "login", (data) ->
  console.log data
  if data.login is "ok"
    # Pasamos a la visualización completa
    $("#login").fadeOut()
  else
    $("#login").fadeIn()
    $("#login .event div").removeClass()
    $("#login .event div").addClass(data.login)
  return

# Custom buttons
socket.on "button", (data) ->

  window["customButtons"](data.id)
  return

###
Función para controlar el funcionamiento de la barra de mensajes
###
isActiveNavMessages = 1
barraMensajes = (n) ->
  if isActiveNavMessages
    if n is 0
      $("footer").animate({height: "0"}, 200)
      $("#content").animate({height: "95%"}, 200)
      isActiveNavMessages = 0
  else
    $("footer").animate({height: "25%"}, 200)
    $("#content").animate({height: "70%"}, 200)
    isActiveNavMessages = 1

  return

# Hacemos la presentación de la pantalla animada
animacionVentanas = () ->
  $("#views").hide().fadeIn()

  return
###
Separamos en una función los controles
que se tienen que recargar cada vez
que se cambia la página
###
reloadControls = () ->

  # Limpiamos el grid de botones personalizados
  if location.hash is "#/"
    socket.emit "controlBotones", {id: 0, label: ""}

  # Limpiamos el fondo
  $("#content").css("background","none")


  #VIDEOS
  if typeof MediaElementPlayer is 'function'
    if $("video").length > 0
      $("video").mediaelementplayer()
      player = new MediaElementPlayer("video")
      $("video").on "play", ->
        player.enterFullScreen()
        return

      $("video").on "ended", ->
        player.exitFullScreen()
        return

  # IMAGENES
  if typeof Galleria is 'function'
    if $(".galleria").length > 0
      Galleria.loadTheme(
        '/components/galleria/themes/classic/galleria.classic.min.js'
      )
      Galleria.configure({
        height: $("#content").height(),
        responsive: true,
        preload: 0,
        idleMode: false,
        debug: false
        })
      Galleria.run(".galleria")
      $("#content").css("background", "black")

  # PRESENTACIONES
  if typeof Fathom is 'function'
    if $("#presentacion").length > 0
      fathom = new Fathom("#presentacion")

      if fathom.$length > 1
        $(".presentacionderecha").show()

      $(".presentacionizquierda").on "click", () ->
        fathom.prevSlide()
        return

      $(".presentacionderecha").on "click", () ->
        fathom.nextSlide()
        return


  # Navegacion por tabindex
  $("a, video, .galleria-image-nav div").each (index) ->
    $(this).prop "tabindex", index
    return



  lastTabIndex = (Number) $("[tabindex]").length - 1

  $("[tabindex=0]").addClass "current"
  currentIndex = (Number) $(".current").attr "tabindex"
  #SOCKET STUFF


  return

# window.ready
$(document).ready ->

  protegido = 0;
  $(".clickProtegido").on "click", () ->

    if protegido is 0
      protegido = 1
      $(".clickProtegido").button("toggle")
      $(".modoprotegido").removeClass("hide").addClass("show")
    else if protegido is 1
      protegido = 0
      $(".clickProtegido").button("toggle")
      $(".modoprotegido").removeClass("show").addClass("hide")

    socket.emit("config", {protegido: protegido})
    return

  sliderBarra = ->
    if $("#slider ul li").length > 1
      $("#slider ul li:not(:first-child) .mensaje").fadeOut 400
      $("#slider ul li:first-child .mensaje").fadeOut 400, () ->
          $("#slider ul li:not(:first-child)").css("width", "0%")
          $("#slider ul li:first-child").animate
            width: "0%"
          , 400, () ->
              $("#slider ul li:first-child").appendTo "#slider ul"
              $("#slider ul li:first-child").animate
                width: "95%"
              , 400, () ->
                  $("#slider ul li .mensaje").fadeIn 400
                  return
              return
          return
        return



  $("#slider ul li:last-child").prependTo "#slider ul"


  setInterval (->
    sliderBarra()
    return
  ), 5000

  return




