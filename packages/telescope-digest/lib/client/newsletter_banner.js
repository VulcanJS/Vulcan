var showLoader = function () {
  console.log('show loader')
}

var hideLoader = function () {
  console.log('hide loader')
}

var confirmSubscription = function () {
  $('.newsletter-banner form').css('opacity', 0);
  $('.newsletter-banner .newsletter-subscribed').css('display', 'block').css('opacity', 1);
}

var dismissBanner = function () {
  if(Meteor.user()){
    // if user is connected, change setting in their account
    setUserSetting('showBanner', false);
  }else{
    // set cookie
    Cookie.set('showBaner', "no");    
  }
}

Template[getTemplate('newsletterBanner')].helpers({
  siteName: function () {
    return getSetting('title');
  },
  isNotConnected: function () {
    return !Meteor.user()
  },
  showBanner: function () {
    if( 
          Cookie.get('showBaner') == "no" 
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
    if(Meteor.user()){
      showLoader();
      Meteor.call('addCurrentUserToMailChimpList', function (error, result) {
        hideLoader();
        if(error){
          console.log(error);
          thowError(error.message);
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
      showLoader();
      Meteor.call('addEmailToMailChimpList', function (error, result) {
        hideLoader();
        if(error){
          console.log(error);
          thowError(error.message);
        }else{
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
})