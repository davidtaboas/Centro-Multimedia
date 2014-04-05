var controllers, directives, monitorApp;

monitorApp = angular.module("monitorApp", ["ngRoute", "monitorApp.directives", "monitorApp.controllers"]);

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

directives = angular.module('monitorApp.directives', []);

directives.directive("lazyStyle", function() {
  var loadedStyles;
  loadedStyles = {};
  return {
    restrict: "E",
    link: function(scope, element, attrs) {
      attrs.$observe("href", function(value) {
        var link, stylePath;
        stylePath = value;
        if (stylePath in loadedStyles) {
          return;
        }
        if (document.createStyleSheet) {
          document.createStyleSheet(stylePath);
        } else {
          link = document.createElement("link");
          link.type = "text/css";
          link.rel = "stylesheet";
          link.href = stylePath;
          document.getElementsByTagName("head")[0].appendChild(link);
        }
        loadedStyles[stylePath] = true;
      });
    }
  };
});

directives.directive("lazyScript", function() {
  var loadedScripts;
  loadedScripts = {};
  return {
    restrict: "E",
    link: function(scope, element, attrs) {
      attrs.$observe("srcscript", function(value) {
        var link, stylePath;
        stylePath = value;
        if (stylePath in loadedScripts) {
          return;
        }
        if (document.createStyleSheet) {
          document.createStyleSheet(stylePath);
        } else {
          link = document.createElement("script");
          link.type = "text/javascript";
          link.src = stylePath;
          link.async = true;
          document.getElementsByTagName("head")[0].appendChild(link);
        }
        loadedScripts[stylePath] = true;
      });
    }
  };
});
