Meteor.startup(function () {
  Template.pages.helpers({
    pages: function(){
      return Pages.find({}, {sort: {order: 1}});
    }
  });
});
