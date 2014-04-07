factories = angular.module 'monitorApp.factories', []

factories.factory "socket", ($rootScope) ->
  socket = socket
  on: (eventName, callback) ->
    socket.on eventName, ->
      args = arguments
      $rootScope.$apply ->
        callback.apply socket, args
        return

      return

    return

  emit: (eventName, data, callback) ->
    socket.emit eventName, data, ->
      args = arguments
      $rootScope.$apply ->
        callback.apply socket, args  if callback
        return

      return

    return