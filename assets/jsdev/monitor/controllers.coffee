controllers = angular.module "monitorApp.controllers", []

controllers.controller "MonitorCtrl", [
  "$scope"
  "$http"
  "$location"
  ($scope, $http, $location) ->


    $scope.$on "$routeChangeSuccess", ($currentRoute, $previousRoute) ->

      if $location.path() is "/"
        modulo = "/home"
      else
        modulo = $location.path()

      $http.get("/modulo"+modulo+"/config").success (data) ->
        $scope.titulo = data.titulo
        return


      animacionVentanas()
      setTimeout( () ->
                    reloadControls()
                  ,500)


    return


]


controllers.controller "MessagesCtrl", [
  "$scope"
  "$http"
  ($scope, $http) ->

    lastFilter = "all"


    cargarMensajes = (filtrado) ->
      console.log "Filtrado de mensajes:"
      console.log filtrado

      $http.get("/messages/"+filtrado).success (messages) ->
        $scope.messages = messages
        console.log "Numero de mensajes:"
        console.log messages.length
        barraMensajes(messages.length)
        return
      return

    cargarMensajes(lastFilter)




    socket.on "msg", (data) ->

      $scope.$apply ->

        $http.post("/messages", data).success (ok) ->

          return

        cargarMensajes(lastFilter)

        return

      return #fin $socket msg

    socket.on "filter", (data) ->

      lastFilter = data.filter
      console.log lastFilter
      $scope.$apply ->
        cargarMensajes(lastFilter)
        return

      return #end $socket filter

    return


]