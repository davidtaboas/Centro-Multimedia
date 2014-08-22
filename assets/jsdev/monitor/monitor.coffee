
# connect to our socketmonitor server
socketmonitor = io.connect("172.16.243.158:4444")
app = app or {}

lastTabIndex = 0
currentIndex = 0

# GESTION DE BOTONES
activarBoton = (id, label) ->

  socketmonitor.emit "controlBotones", {id: id, label: label}
  return

customButtons = (id) ->

  window["funciones"+id]()

  return

###
Los socketmonitors van definidos de forma general
###
socketmonitor.on "move", (data) ->

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

socketmonitor.on "control", (data) ->

  if data.move is "home"
    document.location.href = "/monitor#/"
  else if data.move is "back"
    window.history.back()
  return




socketmonitor.on "change", (data) ->
  if data.change is "mask"
    changeMask()
    setContentHeight()
  else if data.change is "messages"
    $("#messages").toggle()
  return

socketmonitor.on "login", (data) ->
  console.log "Hacemos un log de los datos para identificación"
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
socketmonitor.on "button", (data) ->

  window["customButtons"](data.id)
  return

###
Función para controlar el funcionamiento de la barra de mensajes
###
isActiveNavMessages = 0
barraMensajes = (n) ->
  if isActiveNavMessages
    if n is 0
      $("footer").animate({height: "0"}, 200)
      $("#content").animate({height: "95%"}, 200)
      isActiveNavMessages = 0
  else
    if n isnt 0
      $("footer").animate({height: "25%"}, 200)
      $("#content").animate({height: "70%"}, 200)
      isActiveNavMessages = 1
  if $(".galleria").length > 0
    setTimeout (->

        # trigger callback after 1000ms
        $(".galleria").data("galleria").enterFullscreen()
        return
      ), 300


  return

# Hacemos la presentación de la pantalla animada
animacionVentanas = () ->
  # Limpiamos el fondo
  $("#content").css("background","none")
  # Animacion de pase de ventanas
  $("#content").hide().fadeIn("slow")

  return
###
Separamos en una función los controles
que se tienen que recargar cada vez
que se cambia la página
###
player = ""
fathom = ""
presentacionSlider = ""
reloadControls = () ->

  # Limpiamos el grid de botones personalizados
  # Limpiamos scrits añadidos
  if location.hash is "#/"
    socketmonitor.emit "controlBotones", {id: 0, label: ""}
    # Limpiamos scripts añadidos
    $(".temp").remove()


  #VIDEOS
  if $("video").length > 0
    s = document.createElement("link")
    s.rel = "stylesheet"
    s.href = "/components/mediaelement/build/mediaelementplayer.min.css"
    s.className = "temp"
    $("head").append s

    if typeof MediaElementPlayer is 'function'
      $("video").mediaelementplayer()
      player = new MediaElementPlayer("video")
      $("video").on "play", ->
        player.enterFullScreen()
        return

      $("video").on "ended", ->
        player.exitFullScreen()
        return

  # IMAGENES
  if $(".galleria").length > 0
    if typeof Galleria is 'function'

      Galleria.loadTheme(
        '/components/galleria/themes/classic/galleria.classic.min.js'
      )
      Galleria.configure({
        height: $("#content").height(),
        responsive: true,
        preload: 0,
        idleMode: false,
        debug: false,
        showImagenav: false
        })
      Galleria.run(".galleria")
      $("#content").css("background", "black")
      $(".auto input").on "click", () ->

        $('.galleria').data('galleria').playToggle()
        return

  # PRESENTACIONES
  if typeof Fathom is 'function'
    if $("#presentacion").length > 0
      fathom = new Fathom("#presentacion",
        displayMode: 'single'
        margin: 0
        onActivateSlide: () ->
          if fathom
            $(".currentSlide").html( fathom.$slides.index(fathom.$activeSlide) + 1 )
          $(this).hide().fadeIn()
          return
        onDeactivateSlide: () ->
          $(this).fadeOut()
          return
      )
      $(".totalSlides").html(fathom.$slides.length)


      $(".auto input").on "click", () ->

        if this.checked
          presentacionSlider = setInterval (->

              if fathom.$lastSlide[0] is fathom.$activeSlide[0]
                fathom.activateSlide(fathom.$firstSlide)
                fathom.scrollToSlide(fathom.$firstSlide)
              else
                fathom.nextSlide()

              return
            ), 10000

        else
          clearInterval(presentacionSlider)
        return


  # Navegacion por tabindex
  $("a, video, .auto input").each (index) ->
    $(this).prop "tabindex", index
    return



  lastTabIndex = (Number) $("[tabindex]").length - 1

  $("[tabindex=0]").addClass "current"
  currentIndex = (Number) $(".current").attr "tabindex"
  #socketmonitor STUFF


  return

#variable de modo protegido
protegido = 0;
# window.ready
$(document).ready ->


  $(".clickProtegido").on "click", () ->
    console.log "protegiendo"
    socketmonitor.emit("config", {protegido: protegido})
    return


  socketmonitor.on "protegido", (data) ->
    socketmonitor.emit("config", {protegido: protegido})
    return
  socketmonitor.on "proteger", (data) ->
    console.log data
    if data.protegido is 1
      protegido = 1
      $(".clickProtegido").button("toggle")
      $(".modoprotegido").removeClass("hide").addClass("show")
    else if data.protegido is 0
      protegido = 0
      $(".clickProtegido").button("toggle")
      $(".modoprotegido").removeClass("show").addClass("hide")
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



###
Plantillas preconfiguradas para aplicaciones
###

appPresentacion = () ->
  activarBoton('1', 'Anterior')
  activarBoton('3', 'Siguiente')

  window["funcionesbt1"] = () ->

    fathom.prevSlide()
    return

  window["funcionesbt3"] = () ->
    fathom.nextSlide()
    return
  return

appVideos = () ->
  activarBoton('1', 'Pausa')
  activarBoton('2', 'Play')
  activarBoton('3', 'Stop')

  window["funcionesbt1"] = () ->
    player.pause()
    return
  window["funcionesbt2"] = () ->
    player.play()
    return
  window["funcionesbt3"] = () ->
    player.pause()
    player.exitFullScreen()
    return
  return

appImagenes = () ->
  activarBoton('1', 'Anterior')
  activarBoton('3', 'Siguiente')

  window["funcionesbt1"] = () ->

    $(".galleria").data("galleria").prev()
    return

  window["funcionesbt3"] = () ->
    console.log "BIEN"
    $(".galleria").data("galleria").next()
    return
  return

datosSensor = (marcoID, medida, unidad) ->
  URL = "http://172.16.244.156:8000/"
  request =
    query: "getObservationsByInterval"
    params:
      measure: medida
      start: moment().subtract('days', 7).format('YYYY/MM/DD H:m')
      end: moment().format('YYYY/MM/DD H:m')
  $.ajax
    url: URL
    data: JSON.stringify(request)
    type: "post"
    dataType: "json"
    success: (data) ->
      datos = []
      $.each data, (index, value) ->
        aux = [
          Date.parse(value.measureTime)
          value.measureValue
        ]
        datos.push aux
        return

      # This is for all plots, change Date axis to local timezone
      Highcharts.setOptions global:
        useUTC: false

      chart = new Highcharts.Chart(
        chart:
          renderTo: marcoID
          type: "scatter"
          marginRight: 130
          marginBottom: 25
          borderWidth: 2

        title:
          text: "Última semana de "+ medida
          x: -20 #center

        subtitle:
          text: "" + medida
          x: -20

        xAxis:
          text: "Tiempo"
          type: "datetime"

        yAxis:
          title:
            text: "Consumo " + unidad

        tooltip:
          formatter: ->
            "<b>" + @series.name + "</b><br/>" + Highcharts.dateFormat("%H:%M %e-%b-%Y", new Date(@x)) + "," + @y + " Kwh"

          valueSuffix: unidad

        legend:
          layout: "vertical"
          align: "right"
          verticalAlign: "middle"
          borderWidth: 1

        series: [
          name: "" + medida
          data: datos
        ]
      )
      return

  return
