Meteor.startup(function () {
  Template.categories_menu.helpers({
    hasCategories: function () {
      return Categories.find().count();
    },
    menuItems: function () {
      var defaultItem = [{
        route: 'posts_default',
        label: 'all_categories',
        itemClass: 'item-never-active'
      }];
      var menuItems = _.map(Categories.find({}, {sort: {order: 1, name: 1}}).fetch(), function (category) {
        return {
          route: function () {
            return Categories.getUrl(category);
          },
          label: category.name+" <span class=\"category-posts-count\">("+category.postsCount+")</span>",
          description: category.description,
          _id: category._id,
          parentId: category.parentId
        };
      });
      return defaultItem.concat(menuItems);
    },
    menuClass: function () {
      // go back up 4 levels to get the zone that's including the menu
      if (Template.parentData(4).zone === "mobileNav") {
        return 'menu-collapsible';
      } else if (Settings.get('navLayout', 'top-nav') === 'top-nav') {
        return 'menu-dropdown';
      } else {
        return 'menu-collapsible menu-always-expanded';
      }
    }
  });
});
