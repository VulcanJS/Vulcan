Template.shareit_fb.rendered = ->
  return unless @data

  $('meta[property^="og:"]').remove()

  #
  # OpenGraph tags
  #

  description = @data.description || @data.excerpt || @data.summary

  $('<meta>', { property: 'og:type', content: 'article' }).appendTo 'head'
  $('<meta>', { property: 'og:site_name', content: location.hostname }).appendTo 'head'
  $('<meta>', { property: 'og:url', content: location.origin + location.pathname }).appendTo 'head'
  $('<meta>', { property: 'og:title', content: "#{@data.title}" }).appendTo 'head'
  $('<meta>', { property: 'og:description', content: description }).appendTo 'head'

  if @data.thumbnail
    if typeof @data.thumbnail == "function"
      img = @data.thumbnail()
    else
      img = @data.thumbnail
    if img
      if not /^http(s?):\/\/+/.test(img)
        img = location.origin + img
      $('<meta>', { property: 'og:image', content: img }).appendTo 'head'

  #
  # Facebook share button
  #

  post_url = 'http://' + window.location.host + '/posts/' + @data._id


  preferred_url = post_url || location.origin + location.pathname
  url = encodeURIComponent preferred_url

  base = "https://www.facebook.com/sharer/sharer.php"
  title = encodeURIComponent @data.title
  summary = encodeURIComponent description
  href = base + "?u=" + url + "&t=" + title + "&s=" + summary

  if img
    href += "&p[images][0]=" + encodeURIComponent img

  @$(".fb-share").attr "href", href


Template.shareit_fb.helpers(ShareIt.helpers)


