// Write your package code here!

// Variables exported by this module can be imported by other packages and
// applications. See pegg-cards-tests.js for an example of importing.
export const name = 'pegg-cards';

Posts.addField({
  fieldName: 'answer1',
  fieldSchema: {
    type: String,
    insertableIf: Users.is.memberOrAdmin,
    optional: false,
    publish: true
  }
});

Posts.addField({
  fieldName: 'answer2',
  fieldSchema: {
    type: String,
    insertableIf: Users.is.memberOrAdmin,
    optional: false,
    publish: true
  }
});

Posts.addField({
  fieldName: 'answer3',
  fieldSchema: {
    type: String,
    insertableIf: Users.is.memberOrAdmin,
    optional: false,
    publish: true
  }
});

Posts.addField({
  fieldName: 'answer4',
  fieldSchema: {
    type: String,
    insertableIf: Users.is.memberOrAdmin,
    optional: false,
    publish: true
  }
});

Posts.removeField('url');
Posts.removeField('body');
Posts.removeField('thumbnailUrl');
console.log('horse feathers!')
