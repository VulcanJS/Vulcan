import PublicationUtils from 'meteor/utilities:smart-publications';
import Posts from "meteor/nova:posts";
import Users from 'meteor/nova:users';
import Categories from "./collection.js";

Posts.addField(
  {
    fieldName: 'categories',
    fieldSchema: {
      type: [String],
      control: "checkboxgroup",
      optional: true,
      insertableIf: Users.is.memberOrAdmin,
      editableIf: Users.is.ownerOrAdmin,
      autoform: {
        noselect: true,
        type: "bootstrap-category",
        order: 50,
        options: function () {
          var categories = Categories.find().map(function (category) {
            return {
              value: category._id,
              label: category.name
            };
          });
          return categories;
        }
      },
      publish: true,
      join: {
        joinAs: "categoriesArray",
        collection: () => Categories
      }
    }
  }
);

PublicationUtils.addToFields(Posts.publishedFields.list, ["categories"]);
