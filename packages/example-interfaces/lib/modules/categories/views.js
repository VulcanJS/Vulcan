import Categories from './collection.js';

// will be common to all other view unless specific properties are overwritten
Categories.addDefaultView(function (terms) {
  return {
    options: {
      sort: { name: 1 },
      limit: 1000,
    }
  };
});

Categories.addView("childrenCategories", function (terms) {
  return {
    selector: {
      parentId: terms.parentId,
    },
    options: {
      sort: { name: 1 },
    }
  };
});

Categories.addView("topLevelCategories", function (terms) {
  return {
    selector: {
      $or: [
        { parentId: null },
        { parentId: { $exists: false } },
      ],
    },
    options: {
      sort: { name: 1 },
    }
  };
});
