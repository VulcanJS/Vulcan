Meteor.startup(function () {
  Template[getTemplate('feeds')].helpers({
    feeds: function(){
      return Feeds.find({}, {sort: {url: 1}});
    },
    feedItem: function () {
      return getTemplate('feedItem');
    }
  });
});
