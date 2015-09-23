Meteor.methods({
  phoneHome: function  () {

    var url = 'http://version.telescopeapp.org/';

    if(Meteor.user() && Users.is.admin(Meteor.user())){
    
      var params = {
        currentVersion: Telescope.VERSION,
        siteTitle: Settings.get('title'),
        siteUrl: Telescope.utils.getSiteUrl(),
        users: Meteor.users.find().count(),
        posts: Posts.find().count(),
        comments: Comments.find().count()
      };
    
      this.unblock();
      try {
        var result = HTTP.get(url, {
          params: params
        });
        return result;
      } catch (e) {
        // Got a network error, time-out or HTTP error in the 400 or 500 range.
        return false;
      }
    }
  }
});