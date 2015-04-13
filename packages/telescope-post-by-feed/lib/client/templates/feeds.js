Meteor.startup(function () {
  Template.feeds.helpers({
    feeds: function(){
      return Feeds.find({}, {sort: {url: 1}});
    }
  });
});
