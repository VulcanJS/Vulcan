Meteor.startup(function () {
  Template.pages.helpers({
    pages: function(){
      return Pages.collection.find({}, {sort: {order: 1}});
    },
    pageItem: function () {
      return getTemplate('pageItem');
    }
  });
});
