/*

Custom fields on Posts collection

*/

import { Posts } from '../../modules/posts/index.js';
import { getCategoriesAsOptions } from './schema.js';

Posts.addField([
  {
    fieldName: 'categoriesIds',
    fieldSchema: {
      type: Array,
      control: 'checkboxgroup',
      optional: true,
      insertableBy: ['members'],
      editableBy: ['members'],
      viewableBy: ['guests'],
      options: props => {
        return getCategoriesAsOptions(props.data.CategoriesList);
      },
      query: `
        CategoriesList{
          _id
          name
          slug
          order
        }
      `,
      resolveAs: {
        fieldName: 'categories',
        type: '[Category]',
        resolver: async (post, args, {currentUser, Users, Categories}) => {
          if (!post.categories) return [];
          const categories = _.compact(await Categories.loader.loadMany(post.categories));
          return Users.restrictViewableFields(currentUser, Categories, categories);
        },
        addOriginalField: true,
      }
    }
  },
  {
    fieldName: 'categoriesIds.$',
    fieldSchema: {
      type: String,
      optional: true
    }
  }
]);
