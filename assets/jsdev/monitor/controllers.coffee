controllers = angular.module "monitorApp.controllers", []

controllers.controller "MonitorCtrl", [
  "$scope"
  "$http"
  ($scope, $http) ->

    $scope.scriptremotefunction = () ->
      # setTimeout(reloadControls(), 15000)
      animacionVentanas()
      setTimeout( () ->
                    reloadControls()
                  ,500)
      return
    $scope.$watch($scope.scriptremotefunction)

    return


]


controllers.controller "MessagesCtrl", [
  "$scope"
  "$http"
  ($scope, $http) ->

    lastFilter = "all"

    console.log lastFilter
    $http.get("/messages/"+lastFilter).success (messages) ->
      $scope.messages = messages
      return



    socket.on "msg", (data) ->

      $scope.$apply ->

        $http.post("/messages", data).success (ok) ->

          return
        console.log lastFilter
        $http.get("/messages/"+lastFilter).success (messages) ->
          $scope.messages = messages
          return

        return

      return #fin $socket msg

    socket.on "filter", (data) ->

      $scope.$apply ->
        lastFilter = data.filter
        $http.get("/messages/"+lastFilter).success (messages) ->
          $scope.messages = messages
          return
        return

      return #end $socket filter

    return


]