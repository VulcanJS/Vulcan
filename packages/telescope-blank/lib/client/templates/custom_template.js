Meteor.startup(function () {

  Template[getTemplate('customTemplate')].helpers({
    name: function () {
      return "Bruce Willis";
    }
  });

});
