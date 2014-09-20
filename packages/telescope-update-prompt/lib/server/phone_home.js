Meteor.methods({
  phoneHome: function  () {
    
    var url = 'http://version.telescopeapp.org/';

    if(Meteor.user() && isAdmin(Meteor.user())){

      this.unblock();
      try {
        var result = HTTP.get(url, {
          params: {
            currentVersion: telescopeVersion,
            siteTitle: getSetting('title'),
            siteUrl: getSiteUrl(),
            users: Meteor.users.find().count(),
            posts: Posts.find().count(),
            comments: Comments.find().count()
          }
        })
        return result;
      } catch (e) {
        // Got a network error, time-out or HTTP error in the 400 or 500 range.
        return false;
      }
    }
  }
})