monitorApp = angular.module("monitorApp", [
  "ngRoute"
  "monitorApp.directives",
  "monitorApp.controllers"
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

controllers = angular.module("monitorApp.controllers", [])

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

directives = angular.module 'monitorApp.directives', []

directives.directive "lazyStyle", ->
  loadedStyles = {}
  restrict: "E"
  link: (scope, element, attrs) ->
    attrs.$observe "href", (value) ->
      stylePath = value
      return  if stylePath of loadedStyles
      if document.createStyleSheet
        document.createStyleSheet stylePath #IE
      else
        link = document.createElement("link")
        link.type = "text/css"
        link.rel = "stylesheet"
        link.href = stylePath
        document.getElementsByTagName("head")[0].appendChild link
      loadedStyles[stylePath] = true
      return

    return

directives.directive "lazyScript", ->
  loadedScripts = {}
  restrict: "E"
  link: (scope, element, attrs) ->
    attrs.$observe "srcscript", (value) ->
      stylePath = value
      return  if stylePath of loadedScripts
      if document.createStyleSheet
        document.createStyleSheet stylePath #IE
      else
        link = document.createElement("script")
        link.type = "text/javascript"
        link.src = stylePath
        link.async = true
        document.getElementsByTagName("head")[0].appendChild link
      loadedScripts[stylePath] = true
      return

    return