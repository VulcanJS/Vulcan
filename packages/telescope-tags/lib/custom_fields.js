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

/* Workaround for https://github.com/aldeed/meteor-autoform/issues/765 */
postEditMethodCallbacks.push(function(modifier) {
  // Force ''categories'' into an Array. AutoForm will send us an update that
  // looks like:
  //
  // { $set: {
  //    "categories.0": "<_id1>",
  //    "categories.1": "<_id2>",
  // }}
  //
  // which mongo treats as creating an object rather than an array.  Convert that into
  //
  // { $set: { categories: ["<_id1>", "<_id2>"] }}
  var categoryIds = [];
  _.each(modifier.$set, function(val, key) {
    if (/categories\.\d+/.test(key)) {
      categoryIds.push(val);
      delete modifier.$set[key];
    }
  });
  if (categoryIds.length) {
    modifier.$set.categories = categoryIds;
  }
  return modifier;
});
