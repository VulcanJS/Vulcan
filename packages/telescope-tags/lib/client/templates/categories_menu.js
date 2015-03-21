Meteor.startup(function () {
  Template[getTemplate('categoriesMenu')].helpers({
    categoriesMenuData: function () {
      return {
        dropdownName: 'categories',
        dropdownItems: _.map(Categories.find({}, {sort: {order: 1, name: 1}}).fetch(), function (category) {
          return {
            route: function () {
              return getCategoryUrl(category.slug);
            },
            label: category.name
          }
        })
      }
    }
  });
});
