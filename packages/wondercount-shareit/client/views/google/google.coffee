Template.shareit_google.rendered = () ->
  return unless @data

  #
  # Google share button
  #

  preferred_url = @data.url || location.origin + location.pathname
  href = "https://plus.google.com/share?url=#{preferred_url}"
  @$(".google-share").attr "href", href

Template.shareit_google.helpers(ShareIt.helpers)
