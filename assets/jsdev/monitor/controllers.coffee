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
    $scope.messages = []
    $scope.totalmessages = 0
    socket.on "msg", (data) ->

      $scope.$apply ->

        $scope.messages.push data
        $scope.lastmessage =  data
        $scope.change = () ->
          if $("#lastmessage div").hasClass("none")
            window.changeMask()
          return
        $scope.change()
        $scope.totalmessages = $scope.messages.length
        return

      return

    return


]