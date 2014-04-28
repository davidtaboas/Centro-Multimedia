var monitorApp;

monitorApp = angular.module("monitorApp", ["ngRoute", "monitorApp.directives", "monitorApp.controllers", "monitorApp.factories"]);

monitorApp.config([
  "$routeProvider", function($routeProvider) {
    $routeProvider.when("/", {
      templateUrl: "monitor/monitor",
      controller: "MonitorCtrl"
    }).when("/:name", {
      templateUrl: function(params) {
        return "monitor/" + params.name;
      }
    }, {
      controller: "MonitorCtrl"
    }).otherwise({
      redirectTo: "/"
    });
  }
]);
