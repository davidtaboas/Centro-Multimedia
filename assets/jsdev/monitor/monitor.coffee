
# connect to our socket server
socket = io.connect("http://127.0.0.1:5555/")
app = app or {}

masks= ["none", "bottom", "popup"]
currentMask = 0

###
Los sockets van definidos de forma general
###
socket.on "move", (data) ->

  if data.move is "ok"
    $(current).click()
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

socket.on "msg", (data) ->
  console.log(data)
  if currentMask is masks.indexOf("none")
    currentMask = masks.indexOf("bottom")
    changeMask(currentMask)
  $("#messages div p").append(
    "<span class="+data.priority+">"+decodeURI(data.msg)+"<span>"
  )
  return

socket.on "change", (data) ->

  currentMask = (currentMask+1)%masks.length
  if masks.indexOf("none") is currentMask
    if ($("#messages div p span").attr "class") == "0"
      currentMask++
  changeMask(currentMask)
  return

###
Functión para cambiar máscara de mensajes
###

changeMask = (current) ->
  $("#messages div").removeClass()
  $("#messages div").addClass masks[currentMask]
  return

###
Separamos en una función los controles
que se tienen que recargar cada vez
que se cambia la página
###
reloadControls = () ->

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




  $("a, video").each (index) ->
    $(this).prop "tabindex", index
    return
  #setup some common vars


  lastTabIndex =  (Number) $("[tabindex]").length - 1

  $("[tabindex=0]").addClass "current"
  current = $(".current")
  currentIndex = (Number) current.attr "tabindex"
  #SOCKET STUFF


  return
