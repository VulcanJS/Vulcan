Meteor.startup(function () {

  Template[getTemplate('currentRelease')].helpers({
    currentRelease: function () {
      return Releases.find({read: false}).fetch()[0];
    }
  });

});
