var controllers, messatesToString;

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

messatesToString = function(messages) {
  var i, m, string, _i, _len;
  string = "";
  for (i = _i = 0, _len = messages.length; _i < _len; i = ++_i) {
    m = messages[i];
    string += " // " + m.msg;
  }
  return string;
};

controllers.controller("MessagesCtrl", [
  "$scope", "$http", function($scope, $http) {
    $http.get("/messages").success(function(messages) {
      $scope.messages = messages;
      $scope.lastmessage = messatesToString(messages);
    });
    socket.on("msg", function(data) {
      $scope.$apply(function() {
        $scope.change = function() {
          if ($("#lastmessage div").hasClass("none")) {
            window.changeMask();
          }
        };
        $http.post("/messages", data).success(function(messages) {
          $scope.messages = messages;
          $scope.lastmessage = messatesToString(messages);
        });
      });
    });
    socket.on("filter", function(data) {
      $scope.$apply(function() {
        $http.get("/messages/" + data.filter).success(function(messages) {
          $scope.messages = messages;
        });
      });
    });
  }
]);
