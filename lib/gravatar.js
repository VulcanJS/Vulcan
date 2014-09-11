// super, super simple
Gravatar = {
  getGravatar: function(user, options) {
    if(user.email_hash){
      var options = options || {};

      var protocol = options.secure ? 'https' : 'http';
      delete options.secure;
      var hash = CryptoJS.MD5(getEmail(Meteor.user()).trim().toLowerCase()).toString();
      var url = protocol + '://www.gravatar.com/avatar/' + hash;

      var params = _.map(options, function(val, key) { return key + "=" + val;}).join('&');
      if (params !== '')
      url += '?' + params;
    
      return url;
    
    }else if(user.services && user.services.twitter){
      return user.services.twitter.profile_image_url;//for the oauth-login avatar, diff for diff oauth, maybe it could be better
    }else if(user.services && user.services.facebook){
          return 'http://graph.facebook.com/'+user.services.facebook.id+'/picture';//for the oauth-login avatar, diff for diff oauth, maybe it could be better
    }
  }
};