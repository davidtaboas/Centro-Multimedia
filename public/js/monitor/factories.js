var factories;

factories = angular.module('monitorApp.factories', []);

factories.factory("socketmonitor", function($rootScope) {
  var socketmonitor;
  socketmonitor = socketmonitor;
  return {
    on: function(eventName, callback) {
      socketmonitor.on(eventName, function() {
        var args;
        args = arguments;
        $rootScope.$apply(function() {
          callback.apply(socketmonitor, args);
        });
      });
    },
    emit: function(eventName, data, callback) {
      socketmonitor.emit(eventName, data, function() {
        var args;
        args = arguments;
        $rootScope.$apply(function() {
          if (callback) {
            callback.apply(socketmonitor, args);
          }
        });
      });
    }
  };
});
