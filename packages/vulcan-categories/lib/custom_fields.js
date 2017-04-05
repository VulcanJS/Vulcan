import Posts from "meteor/vulcan:posts";
import { getCategoriesAsOptions } from './schema.js';

Posts.addField([
  {
    fieldName: 'categories',
    fieldSchema: {
      type: Array,
      control: "checkboxgroup",
      optional: true,
      insertableBy: ['members'],
      editableBy: ['members'],
      viewableBy: ['guests'],
      form: {
        noselect: true,
        type: "bootstrap-category",
        order: 50,
        options: formProps => getCategoriesAsOptions(formProps.client),
      },
      resolveAs: 'categories: [Category]'
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
