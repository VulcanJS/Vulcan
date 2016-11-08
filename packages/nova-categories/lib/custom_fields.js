import Telescope from 'meteor/nova:lib';
import PublicationUtils from 'meteor/utilities:smart-publications';
import Posts from "meteor/nova:posts";
import Users from 'meteor/nova:users';
import Categories from "./collection.js";

// import { client } from 'meteor/nova:base-apollo';
import gql from 'graphql-tag';

// check if user can create a new post
const canInsert = user => Users.canDo(user, "posts.new");
// check if user can edit a post
const canEdit = Users.canEdit;

const alwaysPublic = user => true;

Posts.addField(
  {
    fieldName: 'categories',
    fieldSchema: {
      type: [String],
      control: "checkboxgroup",
      optional: true,
      insertableIf: canInsert,
      editableIf: canEdit,
      viewableIf: alwaysPublic,
      form: {
        noselect: true,
        type: "bootstrap-category",
        order: 50,
        options: function () {

          const apolloData = Telescope.graphQL.client.store.getState().apollo.data;
          const categoryNames = apolloData.ROOT_QUERY.categories;
          const categories = _.filter(Telescope.graphQL.client.store.getState().apollo.data, (object, key) => {return categoryNames.indexOf(key) !== -1});
          
          const categoriesOptions = categories.map(function (category) {
            return {
              value: category._id,
              label: category.name
            };
          });

          return categoriesOptions;
        }
      },
      // publish: true,
      // join: {
      //   joinAs: "categoriesArray",
      //   collection: () => Categories
      // },
      resolveAs: 'categories: [Category]'
    }
  }
);

PublicationUtils.addToFields(Posts.publishedFields.list, ["categories"]);
