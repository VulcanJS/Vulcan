/*

Custom fields on Posts collection

*/

import { Posts } from '../../modules/posts/index.js';
import { getCategoriesAsOptions } from './schema.js';

Posts.addField([
  {
    fieldName: 'categories',
    fieldSchema: {
      type: Array,
      control: 'checkboxgroup',
      optional: true,
      insertableBy: ['members'],
      editableBy: ['members'],
      viewableBy: ['guests'],
      form: {
        noselect: true,
        type: 'bootstrap-category',
        order: 50,
        options: formProps => getCategoriesAsOptions(formProps.client),
      },
      resolveAs: {
        fieldName: 'categories',
        type: '[Category]',
        resolver: async (post, args, {currentUser, Users, Categories}) => {
          if (!post.categories) return [];
          const categories = _.compact(await Categories.loader.loadMany(post.categories));
          return Users.restrictViewableFields(currentUser, Categories, categories);
        }
      }
    }
  },
  {
    fieldName: 'categories.$',
    fieldSchema: {
      type: String,
      optional: true
    }
  }
]);
