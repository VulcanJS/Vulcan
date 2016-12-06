import Telescope from 'meteor/nova:lib';
import Users from 'meteor/nova:users';
import mutations from './mutations.js';

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
  parentId: {
    type: String,
    optional: true,
    viewableBy: ['guests'],
    insertableBy: ['members'],
    editableBy: ['members'],
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