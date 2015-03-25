Meteor.startup(function () {
  Template[getTemplate('categoriesMenu')].helpers({
    categoriesMenuData: function () {

      if (!!this.mobile) {
        var dropdownMode = 'list';
      } else if (getSetting('navLayout', 'top-nav') === 'top-nav') {
        var dropdownMode = 'hover';
      } else {
        var dropdownMode = 'accordion';
      }

      var dropdownItems = _.map(Categories.find({}, {sort: {order: 1, name: 1}}).fetch(), function (category) {
        return {
          route: function () {
            return getCategoryUrl(category.slug);
          },
          label: category.name
        }
      });
      return {
        dropdownName: 'categories',
        dropdownItems: [{
          route: 'posts_default',
          label: 'all_categories',
          itemClass: 'item-never-active'
        }].concat(dropdownItems),
        dropdownClass: 'header-submodule',
        dropdownMode: dropdownMode
      }
    }
  });
});
