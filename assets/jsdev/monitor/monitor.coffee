
# connect to our socket server
socket = io.connect("http://127.0.0.1:5555/")
app = app or {}

lastTabIndex = 0
currentIndex = 0

###
Los sockets van definidos de forma general
###
socket.on "move", (data) ->

  if data.move is "ok"
    $(".fcurrent").click()
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
    window.location.href = "/monitor"
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

###
Función para obtener la altura del contenido

###

setContentHeight = () ->


  if isActiveNavMessages
    footerHeight = 150
  else
    footerHeight = 0
  alturaContent =$(window).height() - ($("header").height() + footerHeight + 40)
  $("#content").height(alturaContent)
  $(".galleria-container").height(alturaContent)
  return


###
Función para cambiar máscara de mensajes
###
isActiveNavMessages = 1
changeMask = () ->
  ###
  Si hay prioridad 0 entonces no se tiene que ocultar la máscara
  ###

  if isActiveNavMessages
    $("footer .bottom").animate(height: "0px", 200)
    isActiveNavMessages = 0
  else
    $("footer .bottom").animate(height: "150px", 200)
    isActiveNavMessages = 1

  return


###
Separamos en una función los controles
que se tienen que recargar cada vez
que se cambia la página
###
reloadControls = () ->

  $("#content").css("background","none")

  $("#slider ul li").width($("body").width())

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
        idleMode: false
        })
      Galleria.run(".galleria")
      $("#content").css("background", "black")

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



  setContentHeight()

  moveLeft = ->
    $("#slider ul").animate
      left: +slideWidth
    , 200, ->
      $("#slider ul li:last-child").prependTo "#slider ul"
      $("#slider ul").css "left", ""
      return

    return
  moveRight = ->
    $("#slider ul").animate
      left: -slideWidth
    , 200, ->
      $("#slider ul li:first-child").appendTo "#slider ul"
      $("#slider ul").css "left", ""
      return

    return
  slideCount = $("#slider ul li").length
  slideWidth = $("#slider ul li").width()
  slideHeight = $("#slider ul li").height()
  sliderUlWidth = slideCount * slideWidth
  $("#slider").css
    width: slideWidth
    height: slideHeight

  $("#slider ul").css
    width: sliderUlWidth
    marginLeft: -slideWidth

  $("#slider ul li:last-child").prependTo "#slider ul"



  setInterval (->
    moveRight()
    return
  ), 3000

  return