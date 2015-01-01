addToPostSchema.push(
  {
    propertyName: 'categories',
    propertySchema: {
      type: [String],
      optional: true,
      editable: true,
      autoform: {
        editable: true,
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