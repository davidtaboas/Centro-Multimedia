controllers = angular.module "monitorApp.controllers", []

controllers.controller "MonitorCtrl", [
  "$scope"
  "$http"
  ($scope, $http) ->

    $scope.scriptremotefunction = () ->
      # setTimeout(reloadControls(), 15000)
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

    $http.get("/messages").success (messages) ->
      $scope.messages = messages

      return


    socket.on "msg", (data) ->

      $scope.$apply ->
        $http.post("/messages", data).success (messages) ->
          $scope.messages = messages
          return
        $scope.lastmessage =  data
        $scope.change = () ->
          if $("#lastmessage div").hasClass("none")
            window.changeMask()
          return
        $scope.change()
        return

      return

    return


]