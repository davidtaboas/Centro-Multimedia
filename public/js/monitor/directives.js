var directives;

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
          link.className = "temp";
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
          link.className = "temp";
          link.async = true;
          document.getElementsByTagName("head")[0].appendChild(link);
        }
        loadedScripts[stylePath] = true;
      });
    }
  };
});

directives.directive("timeago", function() {
  return {
    restrict: "A",
    link: function(scope, element, attrs) {
      attrs.$observe("timeago", function() {
        element.text(moment(attrs.timeago).fromNow());
      });
    }
  };
});
