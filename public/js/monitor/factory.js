var factories;

factories = angular.module('monitorApp.factories', []);

factories.factory("socket", function($rootScope) {
  var socket;
  socket = socket;
  return {
    on: function(eventName, callback) {
      socket.on(eventName, function() {
        var args;
        args = arguments;
        $rootScope.$apply(function() {
          callback.apply(socket, args);
        });
      });
    },
    emit: function(eventName, data, callback) {
      socket.emit(eventName, data, function() {
        var args;
        args = arguments;
        $rootScope.$apply(function() {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  };
});
