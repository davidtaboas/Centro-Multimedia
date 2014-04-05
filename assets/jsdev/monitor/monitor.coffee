
# connect to our socket server
socket = io.connect("http://127.0.0.1:5555/")
app = app or {}


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

  return
