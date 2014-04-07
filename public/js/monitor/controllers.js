var controllers;

controllers = angular.module("monitorApp.controllers", []);

controllers.controller("MonitorCtrl", [
  "$scope", "$http", function($scope, $http) {
    $scope.scriptremotefunction = function() {
      setTimeout(function() {
        return reloadControls();
      }, 500);
    };
    $scope.$watch($scope.scriptremotefunction);
  }
]);

controllers.controller("MessagesCtrl", [
  "$scope", "$http", function($scope, $http) {
    $http.get("/messages").success(function(messages) {
      $scope.messages = messages;
    });
    socket.on("msg", function(data) {
      $scope.$apply(function() {
        $http.post("/messages", data).success(function(messages) {
          $scope.messages = messages;
        });
        $scope.lastmessage = data;
        $scope.change = function() {
          if ($("#lastmessage div").hasClass("none")) {
            window.changeMask();
          }
        };
        $scope.change();
      });
    });
  }
]);
