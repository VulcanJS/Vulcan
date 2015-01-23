Template.shareit_twitter.rendered = ->
  return unless @data
  $('meta[property^="twitter:"]').remove()

  if @data.thumbnail
    if typeof @data.thumbnail == "function"
      img = @data.thumbnail()
    else
      img = @data.thumbnail
    if img
      if not /^http(s?):\/\/+/.test(img)
        img = location.origin + img

  #
  # Twitter cards
  #

  $('<meta>', { property: 'twitter:card', content: 'summary' }).appendTo 'head'
  # What should go here?
  #$('<meta>', { property: 'twitter:site', content: '' }).appendTo 'head'

  if @data.author
    author = @data.author() if typeof(@data.author) is 'function'
    author ||= @data.author
  if author and author.profile and author.profile.twitter
    $('<meta>', { property: 'twitter:creator', content: author.profile.twitter }).appendTo 'head'

  description = @data.excerpt || @data.description || @data.summary
  $('<meta>', { property: 'twitter:url', content: location.origin + location.pathname }).appendTo 'head'
  $('<meta>', { property: 'twitter:title', content: "#{@data.title}" }).appendTo 'head'
  $('<meta>', { property: 'twitter:description', content: description }).appendTo 'head'
  $('<meta>', { property: 'twitter:image:src', content: img }).appendTo 'head'

  #
  # Twitter share button
  #

  post_url = 'http://' + window.location.host + '/posts/' + @data._id

  preferred_url = post_url || location.origin + location.pathname
  url = encodeURIComponent preferred_url

  base = "https://twitter.com/intent/tweet"
  text = encodeURIComponent @data.title
  href = base + "?url=" + url + "&text=" + text

  if author and author.profile and author.profile.twitter
    href += "&via=" + author.profile.twitter
  else
    href += "&via=WonderCount"

  @$(".tw-share").attr "href", href


Template.shareit_twitter.helpers(ShareIt.helpers)
