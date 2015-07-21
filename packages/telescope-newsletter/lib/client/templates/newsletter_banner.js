var confirmSubscription = function () {
  $('.newsletter-banner form').css('opacity', 0);
  $('.newsletter-banner .newsletter-subscribed').css('display', 'block').css('opacity', 1);
  Meteor.setInterval(function () {
    // required because otherwise banner disappears immediately after confirmation
    dismissBanner();
  }, 2000);
};

var dismissBanner = function () {
  $('.newsletter-banner').fadeOut('fast', function () {
    if(Meteor.user()){
      // if user is connected, change setting in their account
      Users.setSetting(Meteor.user(), 'newsletter.showBanner', false);
    }else{
      // set cookie
      Cookie.set('showBanner', "no");
    }
  });
};

Meteor.startup(function () {
  Template.newsletter_banner.helpers({
    siteName: function () {
      return Settings.get('title');
    },
    isNotConnected: function () {
      return !Meteor.user();
    },
    showBanner: function () {
      // note: should not be reactive
      if(
            Settings.get('showBanner', false) === false
        ||  !Users.can.view(Meteor.user())
        ||  Router.current().location.get().path !== '/'
        ||  Cookie.get('showBanner') === "no"
        ||  (Meteor.user() && Meteor.user().getSetting('newsletter.showBanner', true) === false)
        ||  (Meteor.user() && Meteor.user().getSetting('newsletter.subscribeToNewsletter', false) === true)
      ){
        return false;
      }else{
        return true;
      }
    }
  });

  Template.newsletter_banner.events({
    'click .newsletter-button': function (e) {
      e.preventDefault();
      var $banner = $('.newsletter-banner');
      if(Meteor.user()){
        $banner.addClass('show-loader');
        Meteor.call('addCurrentUserToMailChimpList', function (error, result) {
          $banner.removeClass('show-loader');
          if(error){
            console.log(error);
            Messages.flash(error.message, "error");
          }else{
            console.log(result);
            confirmSubscription();
          }
        });
      }else{
        var email = $('.newsletter-email').val();
        if(!email){
          alert('Please fill in your email.');
          return;
        }
        $banner.addClass('show-loader');
        Meteor.call('addEmailToMailChimpList', email, function (error, result) {
          $banner.removeClass('show-loader');
          if(error){
            console.log(error);
            Messages.flash(error.reason, "error");
          }else{
            Messages.clearSeen();
            console.log(result);
            confirmSubscription();
          }
        });
      }
      // $('body').addClass('showing-lightbox');
      // $(e.target).parents('.post').find('.post-video-lightbox').fadeIn('fast');
    },
    'click .newsletter-dismiss': function (e) {
      $('.newsletter-banner').fadeOut('fast');
      dismissBanner();
      e.preventDefault();
    }
  });
});
