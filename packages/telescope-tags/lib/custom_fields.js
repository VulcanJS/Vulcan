Posts.registerField(
  {
    propertyName: 'categories',
    propertySchema: {
      type: [String],
      optional: true,
      editableBy: ["owner", "admin"],
      autoform: {
        noselect: true,
        options: function () {
          var categories = Categories.find().map(function (category) {
            return {
              value: category._id,
              label: category.name
            }
          });
          return categories;
        }
      }
    }
  }
);
