Template.post_thumbnail.onCreated(function () {
  var instance = this;
  instance.showVideo = new ReactiveVar(false);
});

Template.post_thumbnail.helpers({
  playVideoClass: function () {
    var url = this.url;
    var isVideoSite = url && _.some(["youtube", "vimeo"], function (site) {
      return url.indexOf(site) !== -1;
    });
    return (this.media && this.media.type === "video" && isVideoSite) ? 'post-thumbnail-has-video': '';
  },
  showVideo: function () {
    return Template.instance().showVideo.get();
  }
});

Template.post_thumbnail.events({
  'click .post-thumbnail-has-video': function (e, instance) {
    
    e.preventDefault();
    instance.showVideo.set(true);
    
    // use Meteor.defer to make sure the elements are rendered by Blaze
    Meteor.defer(function () {
      $('body').addClass('showing-lightbox');
      $(e.target).parents('.post').find('.post-video-lightbox').fadeIn('fast');
      $(".js-video").fitVids();
    });
  
  },
  'click .post-video-lightbox-hide, click .post-video-lightbox': function (e, instance) {
    
    e.preventDefault();
    $(e.target).parents('.post').find('.post-video-lightbox').fadeOut('fast');
    $('body').removeClass('showing-lightbox');
    
    Meteor.defer(function () {
      instance.showVideo.set(false);
    });
    
    }
});
