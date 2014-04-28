monitorApp = angular.module("monitorApp", [
  "ngRoute"
  "monitorApp.directives",
  "monitorApp.controllers",
  "monitorApp.factories"
])
monitorApp.config [
  "$routeProvider"
  ($routeProvider) ->
    $routeProvider
    .when("/",
      templateUrl: "monitor/monitor"
      controller: "MonitorCtrl"
    )
    .when("/:name",
       templateUrl: (params) ->
          "monitor/" + params.name
      controller: "MonitorCtrl"
    ).otherwise redirectTo: "/"
    return
]



