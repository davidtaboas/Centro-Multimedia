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
    var lastFilter;
    lastFilter = "all";
    console.log(lastFilter);
    $http.get("/messages/" + lastFilter).success(function(messages) {
      $scope.messages = messages;
    });
    socket.on("msg", function(data) {
      $scope.$apply(function() {
        $http.post("/messages", data).success(function(ok) {});
        console.log(lastFilter);
        $http.get("/messages/" + lastFilter).success(function(messages) {
          $scope.messages = messages;
        });
      });
    });
    socket.on("filter", function(data) {
      $scope.$apply(function() {
        lastFilter = data.filter;
        $http.get("/messages/" + lastFilter).success(function(messages) {
          $scope.messages = messages;
        });
      });
    });
  }
]);
