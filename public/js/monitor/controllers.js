var controllers;

controllers = angular.module("monitorApp.controllers", []);

controllers.controller("MonitorCtrl", [
  "$scope", "$http", "$location", function($scope, $http, $location) {
    $scope.$on("$routeChangeSuccess", function($currentRoute, $previousRoute) {
      var modulo;
      if ($location.path() === "/") {
        modulo = "/home";
      } else {
        modulo = $location.path();
      }
      $http.get("/modulo" + modulo + "/config").success(function(data) {
        $scope.titulo = data.titulo;
      });
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
      console.log("Filtrado de mensajes:");
      console.log(filtrado);
      $http.get("/messages/" + filtrado).success(function(messages) {
        $scope.messages = messages;
        console.log("Numero de mensajes:");
        console.log(messages.length);
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
      lastFilter = data.filter;
      console.log(lastFilter);
      $scope.$apply(function() {
        cargarMensajes(lastFilter);
      });
    });
  }
]);
