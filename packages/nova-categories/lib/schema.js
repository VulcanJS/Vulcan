import Categories from "./collection.js";
import Users from 'meteor/nova:users';

// category schema
Categories.schema = new SimpleSchema({
  name: {
    type: String,
    insertableIf: Users.is.admin,
    editableIf: Users.is.admin,
    publish: true
  },
  description: {
    type: String,
    optional: true,
    insertableIf: Users.is.admin,
    editableIf: Users.is.admin,
    publish: true,
    autoform: {
      rows: 3
    }
  },
  order: {
    type: Number,
    optional: true,
    insertableIf: Users.is.admin,
    editableIf: Users.is.admin,
    publish: true
  },
  slug: {
    type: String,
    optional: true,
    insertableIf: Users.is.admin,
    editableIf: Users.is.admin,
    publish: true
  },
  image: {
    type: String,
    optional: true,
    insertableIf: Users.is.admin,
    editableIf: Users.is.admin,
    publish: true
  },
  parentId: {
    type: String,
    optional: true,
    insertableIf: Users.is.admin,
    editableIf: Users.is.admin,
    publish: true,
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

// Meteor.startup(function(){
//   Categories.internationalize();
// });

Categories.attachSchema(Categories.schema);


Telescope.settings.collection.addField([
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
            {value: "single", label: "categories_behavior_one_at_a_time"},
            {value: "multiple", label: "categories_behavior_multiple"}
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