Posts.addField(
  {
    fieldName: 'categories',
    fieldSchema: {
      type: [String],
      optional: true,
      editableBy: ["member", "admin"],
      autoform: {
        noselect: true,
        options: function () {
          var categories = Categories.find().map(function (category) {
            return {
              value: category._id,
              label: category.name
            };
          });
          return categories;
        }
      }
    }
  }
);
