var getRoute = function () {
  FlowRouter.watchPathChange()
  var categoryName = this.data.slug;
  var currentQuery = _.clone(FlowRouter.current().queryParams);
  var newQuery = _.extend(currentQuery, {cat: categoryName});
  return FlowRouter.path("postsDefault", FlowRouter.current().params, newQuery);
};

Meteor.startup(function () {
  Template.categories_menu.helpers({
    hasCategories: function () {
      return Categories.find().count();
    },
    menuItems: function () {

      var activeCategories = FlowRouter.getQueryParam("cat");

      var defaultItem = [{
        route: 'postsDefault',
        label: 'all_categories',
        itemClass: 'item-never-active'
      }];

      var menuItems = Categories.find({}, {sort: {order: 1, name: 1}}).fetch();

      // filter out categories with no items
      if (Settings.get("hideEmptyCategories", false)) {
        menuItems = _.filter(menuItems, function (category){
          return !!Counts.get(category.getCounterName());
        });
      }

      menuItems = _.map(menuItems, function (category) {

        // if any of this category's children are included in the active categories, expand it
        var isExpanded = _.intersection(activeCategories, _.pluck(category.getChildren(), "slug")).length > 0;

        // is this category active?
        var isActive = _.contains(activeCategories, category.slug);

        return {
          route: getRoute,
          label: category.name+=" <span class=\"category-posts-count\">("+Counts.get(category.getCounterName())+")</span>",
          description: category.description,
          _id: category._id,
          parentId: category.parentId,
          template: 'category_menu_item',
          isExpanded: isExpanded,
          isActive: isActive,
          data: category
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
