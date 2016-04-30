Template.feeds.onCreated(function () {
  var template = this;
  template.subscribe('feeds');
  template.subscribe('allUsersAdmin');
});

Template.feeds.helpers({
  feeds: function(){
    return Feeds.find({}, {sort: {url: 1}});
  }
});
