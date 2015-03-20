Meteor.startup(function () {
  Template[getTemplate('categoriesMenu')].helpers({
    categoriesMenuData: function () {
      return {
        dropdownName: 'categories',
        dropdownItems: Categories.find({}, {sort: {order: 1, name: 1}}).fetch(),
        dropdownItemLabel: function (category) {
          return category.name;
        },
        dropdownItemPath: function (category) {
          return getCategoryUrl(category.slug);
        }
      }
    }
  });
});
