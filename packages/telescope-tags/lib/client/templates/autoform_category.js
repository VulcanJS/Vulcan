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
      return {
        _id: category._id,
        parentId: category.parentId,
        template: "category_input_item",
        label: category.name,
        isSelected: _.contains(selectedCategories, category._id)
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

Template.afCategory_bootstrap3.events({
  "click .category-input-item label": function (e) {
    // only trigger on actual checkbox' click event, and if the checkbox has just been checked
    if ($(e.toElement).is("input") && $(e.toElement).prop("checked")) {
      // when marking a category as checked, check all checkboxes of all parent nodes as well
      $(e.currentTarget).parentsUntil('.category-input', ".menu-item").find(">.menu-item-wrapper input:checkbox").prop("checked", true);
    }
  }
});

Template.category_input_item.helpers({
  atts: function () {
    if (this.item.isSelected) {
      return "checked";
    }
  }
});