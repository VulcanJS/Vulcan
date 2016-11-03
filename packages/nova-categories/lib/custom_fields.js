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

          const query = Telescope.graphQL.client.query({
            query: gql`
              query getAppData {
                categories {
                  _id
                  name
                  description
                  order
                  slug
                  image
                }
              }
            `,
            noFetch: true
          });

          query.then((result)=>{
            console.log(result.data.categories); 
            return result.data.categories;
          })
          // note: not sure how to use the promise in a sync way to return data yet

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
