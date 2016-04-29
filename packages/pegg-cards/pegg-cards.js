// Write your package code here!

// Variables exported by this module can be imported by other packages and
// applications. See pegg-cards-tests.js for an example of importing.
export const name = 'pegg-cards';

Posts.addField({
  fieldName: 'question',
  fieldSchema: {
    type: String,
    optional: false
  }
});

Posts.removeField('scheduledAt');
console.log('got here horse feathers!')
