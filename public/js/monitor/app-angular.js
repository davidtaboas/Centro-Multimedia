var monitorApp;

monitorApp = angular.module("monitorApp", ["ngRoute", "monitorApp.directives", "monitorApp.controllers", "monitorApp.factories"]);

monitorApp.config([
  "$routeProvider", function($routeProvider) {
    $routeProvider.when("/", {
      templateUrl: "/modulo/home",
      controller: "MonitorCtrl"
    }).when("/:name", {
      templateUrl: function(params) {
        return "/modulo/" + params.name;
      }
    }, {
      controller: "MonitorCtrl"
    }).otherwise({
      redirectTo: "/"
    });
  }
]);
