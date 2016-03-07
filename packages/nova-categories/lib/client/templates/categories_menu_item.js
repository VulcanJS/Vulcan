Template.categories_menu_item.helpers({
  showMultiple: function () {
    return Settings.get("categoriesBehavior", "single") === "multiple";
  },
  isChecked: function () {
    return this.item.isActive ? "checked": "";
  }
});

Template.categories_menu_item.events({
  "change .js-category-toggle": function (event, instance) {
    
    var slug = instance.data.item.data.slug;
    var input = instance.$(":checkbox");

    // use defer to make UI more responsive  
    Meteor.defer(function () {

      if (FlowRouter.getRouteName() !== "postsDefault") {

        FlowRouter.go("postsDefault", {}, {cat:[slug]});

      } else {

        if (input.prop("checked")) {
          FlowRouter.addToQueryArray('cat', slug);

        } else {
          FlowRouter.removeFromQueryArray('cat', slug);

        }

      }

    });

  }
});
