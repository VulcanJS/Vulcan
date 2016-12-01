import Telescope from 'meteor/nova:lib';
import Users from 'meteor/nova:users';
import mutations from './mutations.js';

// category schema
const schema = {
  _id: {
    type: String,
    viewableIf: ['anonymous'],
    optional: true,
    publish: true
  },
  name: {
    type: String,
    viewableIf: ['anonymous'],
    insertableIf: ['default'],
    editableIf: ['default'],
    publish: true
  },
  description: {
    type: String,
    optional: true,
    viewableIf: ['anonymous'],
    insertableIf: ['default'],
    editableIf: ['default'],
    publish: true,
    form: {
      rows: 3
    }
  },
  order: {
    type: Number,
    optional: true,
    viewableIf: ['anonymous'],
    insertableIf: ['default'],
    editableIf: ['default'],
    publish: true
  },
  slug: {
    type: String,
    optional: true,
    viewableIf: ['anonymous'],
    insertableIf: ['default'],
    editableIf: ['default'],
    publish: true,
  },
  image: {
    type: String,
    optional: true,
    viewableIf: ['anonymous'],
    insertableIf: ['default'],
    editableIf: ['default'],
    publish: true
  },
  parentId: {
    type: String,
    optional: true,
    viewableIf: ['anonymous'],
    insertableIf: ['default'],
    editableIf: ['default'],
    publish: true,
    resolveAs: 'parent: Category',
    form: {
      options: function () {
        var categories = Categories.find().map(function (category) {
          return {
            value: category._id,
            label: category.name
          };
        });
        return categories;
      }
    }
  }
};

export default schema;