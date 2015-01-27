var confirmSubscription = function () {
  $('.newsletter-banner form').css('opacity', 0);
  $('.newsletter-banner .newsletter-subscribed').css('display', 'block').css('opacity', 1);
  Meteor.setInterval(function () {
    // required because otherwise banner disappears immediately after confirmation
    dismissBanner();
  }, 2000)
}

var dismissBanner = function () {
  $('.newsletter-banner').fadeOut('fast', function () {
    if(Meteor.user()){
      // if user is connected, change setting in their account
      setUserSetting('showBanner', false);
    }else{
      // set cookie
      Cookie.set('showBanner', "no");
    }
  });
}

Meteor.startup(function () {
  Template[getTemplate('newsletterBanner')].helpers({
    siteName: function () {
      return getSetting('title');
    },
    isNotConnected: function () {
      return !Meteor.user()
    },
    showBanner: function () {
      // note: should not be reactive
      if(
            getSetting('showBanner', false) == false
        ||  !can.view(Meteor.user())
        ||  Router.current().location.get().path != '/'
        ||  Cookie.get('showBanner') == "no"
        ||  (Meteor.user() && getUserSetting('showBanner', true) == false)
        ||  (Meteor.user() && getUserSetting('subscribedToNewsletter', false) == true)
      ){
        return false;
      }else{
        return true;
      }
    }
  });

  Template[getTemplate('newsletterBanner')].events({
    'click .newsletter-button': function (e) {
      e.preventDefault();
      var $banner = $('.newsletter-banner');
      if(Meteor.user()){
        $banner.addClass('show-loader');
        Meteor.call('addCurrentUserToMailChimpList', function (error, result) {
          $banner.removeClass('show-loader');
          if(error){
            console.log(error);
            flashMessage(error.message, "error");
          }else{
            console.log(result);
            confirmSubscription();
          }
        });
      }else{
        var email = $('.newsletter-email').val();
        if(!email){
          alert('Please fill in your email.');
          return
        }
        $banner.addClass('show-loader');
        Meteor.call('addEmailToMailChimpList', email, function (error, result) {
          $banner.removeClass('show-loader');
          if(error){
            console.log(error);
            flashMessage(error.reason, "error");
          }else{
            clearSeenMessages();
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
