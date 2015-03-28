Meteor.methods({
  phoneHome: function  () {

    var url = 'http://version.telescopeapp.org/';

    var params = {
      currentVersion: telescopeVersion,
      siteTitle: Settings.get('title'),
      siteUrl: getSiteUrl(),
      users: Meteor.users.find().count(),
      posts: Posts.find().count(),
      comments: Comments.find().count()
    }

    if(Meteor.user() && isAdmin(Meteor.user())){

      this.unblock();
      try {
        var result = HTTP.get(url, {
          params: params
        })
        return result;
      } catch (e) {
        // Got a network error, time-out or HTTP error in the 400 or 500 range.
        return false;
      }
    }
  }
})
