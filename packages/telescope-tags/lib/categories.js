Categories = new Mongo.Collection("categories");

// category schema
Categories.schema = new SimpleSchema({
  name: {
    type: String,
    editableBy: ["admin"]
  },
  description: {
    type: String,
    optional: true,
    editableBy: ["admin"],
    autoform: {
      rows: 3
    }
  },
  order: {
    type: Number,
    optional: true,
    editableBy: ["admin"]
  },
  slug: {
    type: String,
    optional: true,
    editableBy: ["admin"]
  },
  image: {
    type: String,
    optional: true,
    editableBy: ["admin"]
  },
  postsCount: {
    type: Number,
    optional: true,
  },
  parentId: {
    type: String,
    optional: true,
    editableBy: ["admin"],
    autoform: {
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
});

Categories.schema.internationalize();

Categories.attachSchema(Categories.schema);

Meteor.startup(function () {
  Categories.allow({
    insert: Users.is.adminById,
    update: Users.is.adminById,
    remove: Users.is.adminById
  });
});