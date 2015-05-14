Template.category_title.helpers({
  title: function () {
    var category = Categories.findOne({slug: this.terms.category});
    return category && category.name;
  }
});