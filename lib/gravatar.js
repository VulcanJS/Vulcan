// super, super simple
Gravatar = {
  hash: function(email) {
    return CryptoJS.MD5(email.trim().toLowerCase());
  },
  
  imageUrl: function(email, options) {
    var options = options || {};
    
    var protocol = options.secure ? 'https' : 'http';
    delete options.secure;
    var hash = Gravatar.hash(email);
    var url = protocol + '://www.gravatar.com/avatar/' + hash;
    
    var params = _.map(options, function(val, key) { return key + "=" + val}).join('&');
    if (params !== '')
      url += '?' + params;
    
    return url;
  },

  getGravatar: function(user, options){
    return Gravatar.imageUrl(user.emails[0].email, options)
  }
}