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

messatesToString = (messages) ->
  string = ""

  for m, i in messages
    string += " // " + m.msg

  return string


controllers.controller "MessagesCtrl", [
  "$scope"
  "$http"
  ($scope, $http) ->

    $http.get("/messages").success (messages) ->
      $scope.messages = messages
      $scope.lastmessage = messatesToString(messages)
      return



    socket.on "msg", (data) ->

      $scope.$apply ->
        $scope.change = () ->
          if $("#lastmessage div").hasClass("none")
            window.changeMask()
          return

        $http.post("/messages", data).success (messages) ->
          $scope.messages = messages
          $scope.lastmessage = messatesToString(messages)
          return


        return

      return #fin $socket msg

    socket.on "filter", (data) ->

      $scope.$apply ->

        $http.get("/messages/"+data.filter).success (messages) ->
          $scope.messages = messages
          return
        return

      return #end $socket msg

    return


]