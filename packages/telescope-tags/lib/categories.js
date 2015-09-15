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

Meteor.startup(function(){
  Categories.internationalize();
});

Categories.attachSchema(Categories.schema);

Meteor.startup(function () {
  Categories.allow({
    insert: Users.is.adminById,
    update: Users.is.adminById,
    remove: Users.is.adminById
  });
});


Settings.addField([
  {
    fieldName: 'categoriesBehavior',
    fieldSchema: {
      type: String,
      optional: true,
      autoform: {
        group: 'categories',
        instructions: 'Let users filter by one or multiple categories at a time.', 
        options: function () {
          return [
            {value: "single", label: i18n.t("categories_behavior_one_at_a_time")},
            {value: "multiple", label: i18n.t("categories_behavior_multiple")}
          ];
        }
      }
    }
  },
  {
    fieldName: 'hideEmptyCategories',
    fieldSchema: {
      type: Boolean,
      optional: true,
      autoform: {
        group: 'categories',
        instructions: 'Hide empty categories in navigation'
      }
    }
  }
]);