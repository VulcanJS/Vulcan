// category schema
const schema = {
  _id: {
    type: String,
    viewableBy: ['guests'],
    optional: true,
    publish: true
  },
  name: {
    type: String,
    viewableBy: ['guests'],
    insertableBy: ['members'],
    editableBy: ['members'],
    publish: true
  },
  description: {
    type: String,
    optional: true,
    viewableBy: ['guests'],
    insertableBy: ['members'],
    editableBy: ['members'],
    publish: true,
    form: {
      rows: 3
    }
  },
  order: {
    type: Number,
    optional: true,
    viewableBy: ['guests'],
    insertableBy: ['members'],
    editableBy: ['members'],
    publish: true
  },
  slug: {
    type: String,
    optional: true,
    viewableBy: ['guests'],
    insertableBy: ['members'],
    editableBy: ['members'],
    publish: true,
  },
  image: {
    type: String,
    optional: true,
    viewableBy: ['guests'],
    insertableBy: ['members'],
    editableBy: ['members'],
    publish: true
  },
  // parentId: {
  //   type: String,
  //   optional: true,
  //   viewableBy: ['guests'],
  //   insertableBy: ['members'],
  //   editableBy: ['members'],
  //   publish: true,
  //   resolveAs: 'parent: Category',
  //   form: {
  //     options: function () {
  //       // todo: get the collection from the options in form
  //       var categories = Categories.find().map(function (category) {
  //         return {
  //           value: category._id,
  //           label: category.name
  //         };
  //       });
  //       return categories;
  //     }
  //   }
  // }
};

export default schema;
