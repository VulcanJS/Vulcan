Meteor.startup(function () {

  Template.current_release.created = function () {
    this.release = function () {
      return Releases.find({read: false}).fetch()[0];
    };
  };

  Template.current_release.helpers({
    current_release: function () {
      return Template.instance().release();
    }
  });

  Template.current_release.events({
    'click .release-dismiss': function (event, instance) {
      event.preventDefault();
      Releases.update(instance.release()._id, {$set: {read: true}});
    }
  });

});
