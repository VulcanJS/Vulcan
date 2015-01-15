var categories = Categories.find().map(function (category) {
  return {
    value: category._id,
    label: category.name
  }  
});

if (categories.length > 0) {
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
            return categories;
          }
        }
      }
    }
  );
}