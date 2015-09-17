Template.category_menu_item.helpers({
  showMultiple: function () {
    return Settings.get("categoriesBehavior", "single") === "multiple";
  },
  isChecked: function () {
    return this.item.isActive ? "checked": "";
  }
});

Template.category_menu_item.events({
  "click .js-category-toggle": function (event, instance) {
    
    event.preventDefault();

    var slug = instance.data.item.data.slug;
    var input = instance.$(":checkbox");

    input.prop("checked", !input.prop("checked"))    
    
    if (FlowRouter.getRouteName() !== "postsDefault") {

      FlowRouter.go("postsDefault", {}, {cat:[slug]});

    } else {

      if (input.prop("checked")) {
        FlowRouter.addToQueryArray('cat', slug);
      } else {
        FlowRouter.removeFromQueryArray('cat', slug);
      }
      
    }
  }
});
