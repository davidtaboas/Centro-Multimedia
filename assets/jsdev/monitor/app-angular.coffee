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
      templateUrl: "/modulo/home"
      controller: "MonitorCtrl"
    )
    .when("/:name",
       templateUrl: (params) ->
          "/modulo/" + params.name
      controller: "MonitorCtrl"
    ).otherwise redirectTo: "/"
    return
]



