Template.post_thumbnail.helpers({
  postLink: function () {
    return Posts.getLink(this);
  },
  target: function () {
    return !!this.url? "_blank" : "";
  },
  playVideoClass: function () {
    return !!this.media ? 'post-thumbnail-has-video': '';
  }
});

Template.post_thumbnail.events({
  'click .post-thumbnail-has-video': function (e) {
    e.preventDefault();
    $('body').addClass('showing-lightbox');
    $(e.target).parents('.post').find('.post-video-lightbox').fadeIn('fast');
  }
});
