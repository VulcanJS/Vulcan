import Telescope from 'meteor/nova:lib';
import Posts from "meteor/nova:posts";
import Users from 'meteor/nova:users';
import Categories from "./collection.js";

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
        options: function (formProps) {

          // catch the ApolloClient from the form props
          const {client} = formProps;

          // get the current data of the store
          const apolloData = client.store.getState().apollo.data;
          
          // filter these data based on their typename: we are interested in the categories data
          const categories = _.filter(apolloData, (object, key) => {
            return object.__typename === 'Category'
          });

          // give the form component (here: checkboxgroup) exploitable data
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
