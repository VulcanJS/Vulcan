Meteor.startup(function () {
  Template.categories.helpers({
    categories: function(){
      return Categories.find({}, {sort: {order: 1, name: 1}});
    }
  });
});
