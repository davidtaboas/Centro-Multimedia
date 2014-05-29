controllers = angular.module "monitorApp.controllers", []

controllers.controller "MonitorCtrl", [
  "$scope"
  "$http"
  ($scope, $http) ->

    $scope.$on "$routeChangeSuccess", ($currentRoute, $previousRoute) ->
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
      $http.get("/messages/"+filtrado).success (messages) ->
        $scope.messages = messages
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


      $scope.$apply ->

        cargarMensajes(data.filter)
        return

      return #end $socket filter

    return


]