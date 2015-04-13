Meteor.startup(function () {

  Template.customTemplate.helpers({
    name: function () {
      return "Bruce Willis";
    }
  });

});
