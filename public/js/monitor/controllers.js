var controllers;

controllers = angular.module("monitorApp.controllers", []);

controllers.controller("MonitorCtrl", [
  "$scope", "$http", function($scope, $http) {
    $scope.$on("$routeChangeSuccess", function($currentRoute, $previousRoute) {
      animacionVentanas();
      return setTimeout(function() {
        return reloadControls();
      }, 500);
    });
  }
]);

controllers.controller("MessagesCtrl", [
  "$scope", "$http", function($scope, $http) {
    var cargarMensajes, lastFilter;
    lastFilter = "all";
    cargarMensajes = function(filtrado) {
      $http.get("/messages/" + filtrado).success(function(messages) {
        $scope.messages = messages;
        barraMensajes(messages.length);
      });
    };
    cargarMensajes(lastFilter);
    socket.on("msg", function(data) {
      $scope.$apply(function() {
        $http.post("/messages", data).success(function(ok) {});
        cargarMensajes(lastFilter);
      });
    });
    socket.on("filter", function(data) {
      $scope.$apply(function() {
        cargarMensajes(data.filter);
      });
    });
  }
]);
