Template[getTemplate('postVideo')].helpers({
	getTitle: function (data) {
		return data;
	}
});

Template[getTemplate('postVideo')].events({
  'click .post-video-lightbox-hide, click .post-video-lightbox': function (e) {
    e.preventDefault();
    $(e.target).parents('.post').find('.post-video-lightbox').fadeOut('fast');
    $('body').removeClass('showing-lightbox');
  }
})