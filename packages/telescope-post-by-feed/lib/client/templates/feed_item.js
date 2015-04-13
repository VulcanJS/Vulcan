Meteor.startup(function () {
  Template.feedItem.helpers({
    formId: function () {
      return 'updateFeed-'+ this._id
    }
  });

  Template.feedItem.events({
    'click .delete-link': function(e, instance){
      e.preventDefault();
      if (confirm("Delete feed?")) {
        Feeds.remove(instance.data._id);
      }
    }
  });
});
