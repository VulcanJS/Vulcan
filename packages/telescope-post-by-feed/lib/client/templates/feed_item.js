Meteor.startup(function () {
  Template.feed_item.helpers({
    formId: function () {
      return 'updateFeed-'+ this._id;
    }
  });

  Template.feed_item.events({
    'click .delete-link': function(e, instance){
      e.preventDefault();
      if (confirm("Delete feed?")) {
        Feeds.remove(instance.data._id);
      }
    }
  });
});
