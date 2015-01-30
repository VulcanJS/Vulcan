Template.shareit.helpers
  useFB: () ->
    ShareIt.settings.useFB

  useTwitter: () ->
    ShareIt.settings.useTwitter

  useGoogle: () ->
    ShareIt.settings.useGoogle

Template.shareit.events
	'click .show-share-btns': () ->
		$('.show-share-btns').popup({
			inline   : true,
			hoverable: true,
			position : 'bottom left',
			transition :'fade down',
			delay: {
				show: 100,
				hide: 300
			}
		})
	'mouseenter .show-share-btns': () ->
		$('.show-share-btns').popup({
			inline   : true,
			hoverable: true,
			position : 'bottom left',
			transition :'fade down',
			delay: {
				show: 100,
				hide: 300
			}
		})
	'click .facebook.icon.button': () ->
		post_url = 'http://' + window.location.host + '/posts/' + this._id
		url = encodeURIComponent post_url

		base = "https://www.facebook.com/sharer/sharer.php"
		href = base + "?u=" + url

		window.open(href)
