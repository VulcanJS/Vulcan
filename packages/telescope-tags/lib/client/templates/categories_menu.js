Meteor.startup(function () {
  Template[getTemplate('categoriesMenu')].helpers({
    menuItems: function () {
      var defaultItem = [{
        route: 'posts_default',
        label: 'all_categories',
        itemClass: 'item-never-active'
      }];
      var menuItems = _.map(Categories.find({}, {sort: {order: 1, name: 1}}).fetch(), function (category) {
        return {
          route: function () {
            return getCategoryUrl(category.slug);
          },
          label: category.name
        }
      });
      return defaultItem.concat(menuItems);
    },
    menuMode: function () {
      if (!!this.mobile) {
        return 'list';
      } else if (Settings.get('navLayout', 'top-nav') === 'top-nav') {
        return 'dropdown';
      } else {
        return 'accordion';
      }
    }
  });
});
