Meteor.publish('rssUrls', function() {
  if(isAdminById(this.userId)){
    return RssUrls.find();
  }
  return [];
});
