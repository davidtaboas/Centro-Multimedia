factories = angular.module 'monitorApp.factories', []

factories.factory "socketmonitor", ($rootScope) ->
  socketmonitor = socketmonitor
  on: (eventName, callback) ->
    socketmonitor.on eventName, ->
      args = arguments
      $rootScope.$apply ->
        callback.apply socketmonitor, args
        return

      return

    return

  emit: (eventName, data, callback) ->
    socketmonitor.emit eventName, data, ->
      args = arguments
      $rootScope.$apply ->
        callback.apply socketmonitor, args  if callback
        return

      return

    return

