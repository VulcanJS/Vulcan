Template.categories_admin.helpers({
  categories: function(){
    return Categories.find({}, {sort: {order: 1, name: 1}});
  },
  menuItems: function () {
    var menuItems = _.map(Categories.find({}, {sort: {order: 1, name: 1}}).fetch(), function (category) {
      return {
        _id: category._id,
        parentId: category.parentId,
        template: "category_item",
        data: category
      };
    });
    return menuItems;
  },
});
