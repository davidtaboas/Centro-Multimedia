(($) ->
  "use strict"
  $.fn.extend maxlength: (options, callback) ->
    # if true the indicator it's always shown.
    # Represents how many chars left are needed to show up the counter
    # show the number of characters typed and not the number of characters remaining
    # if the browser doesn't support the maxlength attribute, attempt to type more than
    # the indicated chars, will be prevented.
    # counts using bytesize rather than length.  eg: '£' is counted as 2 characters.

    ###*
    Return the length of the specified input.

    @param input
    @return {number}
    ###
    inputLength = (input) ->
      text = input.val()

      # Remove all double-character (\r\n) linebreaks, so they're counted only once.
      text = text.replace(new RegExp("\r?\n", "g"), "\n")

      # var matches = text.match(/\n/g);
      currentLength = 0
      if options.utf8
        currentLength = utf8Length(input.val())
      else
        currentLength = input.val().length
      currentLength

    ###*
    Return the length of the specified input in UTF8 encoding.

    @param input
    @return {number}
    ###
    utf8Length = (string) ->
      utf8length = 0
      n = 0

      while n < string.length
        c = string.charCodeAt(n)
        if c < 128
          utf8length++
        else if (c > 127) and (c < 2048)
          utf8length = utf8length + 2
        else
          utf8length = utf8length + 3
        n++
      utf8length

    ###*
    Return true if the indicator should be showing up.

    @param input
    @param thereshold
    @param maxlength
    @return {number}
    ###
    charsLeftThreshold = (input, thereshold, maxlength) ->
      output = true
      output = false  if not options.alwaysShow and (maxlength - inputLength(input) > thereshold)
      output

    ###*
    Returns how many chars are left to complete the fill up of the form.

    @param input
    @param maxlength
    @return {number}
    ###
    remainingChars = (input, maxlength) ->
      length = maxlength - inputLength(input)
      length

    ###*
    When called displays the indicator.

    @param indicator
    ###
    showRemaining = (indicator) ->
      indicator.css display: "block"
      return

    ###*
    When called shows the indicator.

    @param indicator
    ###
    hideRemaining = (indicator) ->
      indicator.css display: "none"
      return

    ###*
    This function updates the value in the indicator

    @param maxLengthThisInput
    @param typedChars
    @return String
    ###
    updateMaxLengthHTML = (maxLengthThisInput, typedChars) ->
      output = ""
      if options.message
        output = options.message.replace("%charsTyped%", typedChars).replace("%charsRemaining%", maxLengthThisInput - typedChars).replace("%charsTotal%", maxLengthThisInput)
      else
        output += options.preText  if options.preText
        unless options.showCharsTyped
          output += maxLengthThisInput - typedChars
        else
          output += typedChars
        output += options.separator + maxLengthThisInput  if options.showMaxLength
        output += options.postText  if options.postText
      output

    ###*
    This function updates the value of the counter in the indicator.
    Wants as parameters: the number of remaining chars, the element currently managed,
    the maxLength for the current input and the indicator generated for it.

    @param remaining
    @param currentInput
    @param maxLengthCurrentInput
    @param maxLengthIndicator
    ###
    manageRemainingVisibility = (remaining, currentInput, maxLengthCurrentInput, maxLengthIndicator) ->
      maxLengthIndicator.html updateMaxLengthHTML(maxLengthCurrentInput, (maxLengthCurrentInput - remaining))
      if remaining > 0
        if charsLeftThreshold(currentInput, options.threshold, maxLengthCurrentInput)
          showRemaining maxLengthIndicator.removeClass(options.limitReachedClass).addClass(options.warningClass)
        else
          hideRemaining maxLengthIndicator
      else
        showRemaining maxLengthIndicator.removeClass(options.warningClass).addClass(options.limitReachedClass)
      return

    ###*
    This function returns an object containing all the
    informations about the position of the current input

    @param currentInput
    @return object {bottom height left right top  width}
    ###
    getPosition = (currentInput) ->
      el = currentInput[0]
      $.extend {}, (if (typeof el.getBoundingClientRect is "function") then el.getBoundingClientRect() else
        width: el.offsetWidth
        height: el.offsetHeight
      ), currentInput.offset()

    ###*
    This function places the maxLengthIndicator at the
    top / bottom / left / right of the currentInput

    @param currentInput
    @param maxLengthIndicator
    @return null
    ###
    place = (currentInput, maxLengthIndicator) ->
      pos = getPosition(currentInput)
      inputOuter = currentInput.outerWidth()
      outerWidth = maxLengthIndicator.outerWidth()
      actualWidth = maxLengthIndicator.width()
      actualHeight = maxLengthIndicator.height()
      switch options.placement
        when "bottom"
          maxLengthIndicator.css
            top: pos.top + pos.height
            left: pos.left + pos.width / 2 - actualWidth / 2

        when "top"
          maxLengthIndicator.css
            top: pos.top - actualHeight
            left: pos.left + pos.width / 2 - actualWidth / 2

        when "left"
          maxLengthIndicator.css
            top: pos.top + pos.height / 2 - actualHeight / 2
            left: pos.left - actualWidth

        when "right"
          maxLengthIndicator.css
            top: pos.top + pos.height / 2 - actualHeight / 2
            left: pos.left + pos.width

        when "bottom-right"
          maxLengthIndicator.css
            top: pos.top + pos.height
            left: pos.left + pos.width

        when "top-right"
          maxLengthIndicator.css
            top: pos.top - actualHeight
            left: pos.left + inputOuter

        when "top-left"
          maxLengthIndicator.css
            top: pos.top - actualHeight
            left: pos.left - outerWidth

        when "bottom-left"
          maxLengthIndicator.css
            top: pos.top + currentInput.outerHeight()
            left: pos.left - outerWidth

        when "centered-right"
          maxLengthIndicator.css
            top: pos.top + (actualHeight / 2)
            left: pos.left + inputOuter - outerWidth - 3


    ###*
    This function retrieves the maximum length of currentInput

    @param currentInput
    @return {number}
    ###
    getMaxLength = (currentInput) ->
      currentInput.attr("maxlength") or currentInput.attr("size")
    documentBody = $("body")
    defaults =
      alwaysShow: false
      threshold: 10
      warningClass: "label label-success"
      limitReachedClass: "label label-important"
      separator: " / "
      preText: ""
      postText: ""
      showMaxLength: true
      placement: "bottom"
      showCharsTyped: true
      validate: false
      utf8: false

    if $.isFunction(options) and not callback
      callback = options
      options = {}
    options = $.extend(defaults, options)
    @each ->
      currentInput = $(this)
      maxLengthCurrentInput = undefined
      maxLengthIndicator = undefined
      $(window).resize ->
        place currentInput, maxLengthIndicator  if maxLengthIndicator
        return

      currentInput.focus ->
        maxlengthContent = updateMaxLengthHTML(maxLengthCurrentInput, "0")
        maxLengthCurrentInput = getMaxLength(currentInput)
        unless maxLengthIndicator
          maxLengthIndicator = $("<span class=\"bootstrap-maxlength\"></span>").css(
            display: "none"
            position: "absolute"
            whiteSpace: "nowrap"
            zIndex: 1099
          ).html(maxlengthContent)

        # We need to detect resizes if we are dealing with a textarea:
        if currentInput.is("textarea")
          currentInput.data "maxlenghtsizex", currentInput.outerWidth()
          currentInput.data "maxlenghtsizey", currentInput.outerHeight()
          currentInput.mouseup ->
            place currentInput, maxLengthIndicator  if currentInput.outerWidth() isnt currentInput.data("maxlenghtsizex") or currentInput.outerHeight() isnt currentInput.data("maxlenghtsizey")
            currentInput.data "maxlenghtsizex", currentInput.outerWidth()
            currentInput.data "maxlenghtsizey", currentInput.outerHeight()
            return

        documentBody.append maxLengthIndicator
        remaining = remainingChars(currentInput, getMaxLength(currentInput))
        manageRemainingVisibility remaining, currentInput, maxLengthCurrentInput, maxLengthIndicator
        place currentInput, maxLengthIndicator
        return

      currentInput.blur ->
        maxLengthIndicator.remove()  if maxLengthIndicator
        return

      currentInput.keyup ->
        remaining = remainingChars(currentInput, getMaxLength(currentInput))
        output = true
        if options.validate and remaining < 0
          output = false
        else
          manageRemainingVisibility remaining, currentInput, maxLengthCurrentInput, maxLengthIndicator
        output

      return


  return
) jQuery