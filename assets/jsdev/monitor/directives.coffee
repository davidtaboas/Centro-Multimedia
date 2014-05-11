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

directives.directive "timeago", ->
  restrict: "A"
  link: (scope, element, attrs) ->
    attrs.$observe "timeago", ->
      element.text moment(attrs.timeago).fromNow()
      return

    return
