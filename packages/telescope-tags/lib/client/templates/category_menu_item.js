Template.category_menu_item.onCreated(function () {
  this.data.isChecked = _.contains(Router.current().params.query.cat, this.data.item.data.slug) ? "checked": "";
});

Template.category_menu_item.helpers({
  showMultiple: function () {
    return Settings.get("categoriesBehavior", "single") === "multiple";
  },
  isChecked: function () {
    return this.isChecked;
  }
});

Template.category_menu_item.events({
  "click .js-category-toggle": function (event, instance) {
    
    event.preventDefault();

    var slug = instance.data.item.data.slug;
    var input = instance.$(":checkbox");

    input.prop("checked", !input.prop("checked"))    
    
    if (Router.current().route.getName() !== "posts_categories") {

      Router.go("posts_categories", {}, {query: 'cat[]='+slug});
    
    } else {

      if (input.prop("checked")) {
        Router.query.add('cat', slug);
      } else {
        Router.query.remove('cat', slug);
      }
      
    }
  }
});
