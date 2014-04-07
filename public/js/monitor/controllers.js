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
    $scope.messages = [];
    $scope.totalmessages = 0;
    socket.on("msg", function(data) {
      $scope.$apply(function() {
        $scope.messages.push(data);
        $scope.lastmessage = data;
        $scope.change = function() {
          if ($("#lastmessage div").hasClass("none")) {
            window.changeMask();
          }
        };
        $scope.change();
        $scope.totalmessages = $scope.messages.length;
      });
    });
  }
]);
