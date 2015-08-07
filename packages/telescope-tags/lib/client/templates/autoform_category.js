AutoForm.addInputType("bootstrap-category", {
  template: "afCategory",
  valueOut: function () {
    var categories = [];
    this.find(":checked").each(function() {
      categories.push($(this).val());
    });
    return categories;
  }
});

Template.afCategory_bootstrap3.helpers({
  menuItems: function () {
    var selectedCategories = this.value;
    var menuItems = _.map(Categories.find({}, {sort: {order: 1, name: 1}}).fetch(), function (category) {
      category.isSelected = _.contains(selectedCategories, category._id);
      return {
        _id: category._id,
        parentId: category.parentId,
        template: "category_input_item",
        data: category
      };
    });
    return menuItems;
  },
  atts: function addFormControlAtts() {
    var atts = _.clone(this.atts);
    // Add bootstrap class
    atts = AutoForm.Utility.addClass(atts, "form-control");
    return atts;
  }
});

Template.category_input_item.helpers({
  atts: function () {
    if (this.isSelected) {
      return "checked";
    }
  }
});