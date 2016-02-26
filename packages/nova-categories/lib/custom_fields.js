Posts.addField(
  {
    fieldName: 'categories',
    fieldSchema: {
      type: [String],
      control: "checkboxgroup",
      optional: true,
      editableBy: ["member", "admin"],
      autoform: {
        noselect: true,
        type: "bootstrap-category",
        order: 50,
        options: function () {
          var categories = Categories.find().map(function (category) {
            return {
              value: category._id,
              label: category.name
            };
          });
          return categories;
        }
      },
      join: {
        joinAs: "categoriesArray",
        collection: () => Categories
      }
    }
  }
);

Telescope.utils.addToFields(Posts.publishedFields.list, ["categories"]);
Telescope.utils.addToFields(Posts.publishedFields.single, ["categories"]);