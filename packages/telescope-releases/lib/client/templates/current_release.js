Meteor.startup(function () {

  Template[getTemplate('currentRelease')].created = function () {
    this.release = function () {
      return Releases.find({read: false}).fetch()[0];
    }
  };

  Template[getTemplate('currentRelease')].helpers({
    currentRelease: function () {
      return Template.instance().release();
    }
  });

  Template[getTemplate('currentRelease')].events({
    'click .release-dismiss': function (event, instance) {
      event.preventDefault();
      Releases.update(instance.release()._id, {$set: {read: true}});
    }
  })

});
