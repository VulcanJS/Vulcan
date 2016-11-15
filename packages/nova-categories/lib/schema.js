import Telescope from 'meteor/nova:lib';
import Categories from "./collection.js";
import Users from 'meteor/nova:users';

const canInsert = user => Users.canDo(user, "categories.new");
const canEdit = user => Users.canDo(user, "categories.edit.all");
const alwaysPublic = user => true;

// category schema
Categories.schema = new SimpleSchema({
  _id: {
    type: String,
    viewableIf: alwaysPublic,
    optional: true,
    publish: true
  },
  name: {
    type: String,
    viewableIf: alwaysPublic,
    insertableIf: canInsert,
    editableIf: canEdit,
    publish: true
  },
  description: {
    type: String,
    optional: true,
    viewableIf: alwaysPublic,
    insertableIf: canInsert,
    editableIf: canEdit,
    publish: true,
    form: {
      rows: 3
    }
  },
  order: {
    type: Number,
    optional: true,
    viewableIf: alwaysPublic,
    insertableIf: canInsert,
    editableIf: canEdit,
    publish: true
  },
  slug: {
    type: String,
    optional: true,
    viewableIf: alwaysPublic,
    insertableIf: canInsert,
    editableIf: canEdit,
    publish: true,
  },
  image: {
    type: String,
    optional: true,
    viewableIf: alwaysPublic,
    insertableIf: canInsert,
    editableIf: canEdit,
    publish: true
  },
  parentId: {
    type: String,
    optional: true,
    viewableIf: alwaysPublic,
    insertableIf: canInsert,
    editableIf: canEdit,
    publish: true,
    resolveAs: 'parent: Category',
    form: {
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


// Telescope.settings.collection.addField([
//   {
//     fieldName: 'categoriesBehavior',
//     fieldSchema: {
//       type: String,
//       optional: true,
//       form: {
//         group: 'categories',
//         instructions: 'Let users filter by one or multiple categories at a time.', 
//         options: function () {
//           return [
//             {value: "single", label: "categories_behavior_one_at_a_time"},
//             {value: "multiple", label: "categories_behavior_multiple"}
//           ];
//         }
//       }
//     }
//   },
//   {
//     fieldName: 'hideEmptyCategories',
//     fieldSchema: {
//       type: Boolean,
//       optional: true,
//       form: {
//         group: 'categories',
//         instructions: 'Hide empty categories in navigation'
//       }
//     }
//   }
// ]);


// Categories.graphQLSchema = `
//   type Category {
//     _id: String
//     name: String
//     description: String
//     order: Int
//     slug: String
//     image: String
//     parent: Category
//   }

//   input categoriesInput {
//     name: String!
//     description: String
//     order: Int
//     slug: String
//     image: String
//     parent: String
//   }

//   input categoriesUnset {
//     _id: Boolean
//     description: Boolean
//     order: Boolean
//     slug: Boolean
//     image: Boolean
//     parent: Boolean
//   }
// `;

Telescope.graphQL.addCollection(Categories);

Telescope.graphQL.addToContext({ Categories });
