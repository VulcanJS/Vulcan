Meteor.startup(function () {
  Template[getTemplate('categories')].helpers({
    categories: function(){
      return Categories.find({}, {sort: {order: 1, name: 1}});
    },
    categoryItem: function () {
      return getTemplate('categoryItem');
    }
  });
});
