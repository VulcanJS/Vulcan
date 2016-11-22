import Telescope from 'meteor/nova:lib';
import Users from 'meteor/nova:users';
import mutations from './mutations.js';

const canInsert = user => Users.canDo(user, "categories.new");
const canEdit = mutations.edit.check
const alwaysPublic = user => true;

// category schema
const schema = {
  _id: {
    type: String,
    viewableIf: alwaysPublic,
    optional: true,
    publish: true
  },
  name: {
    type: String,
    viewableIf: alwaysPublic,
    insertableIf: canInsert,
    editableIf: canEdit,
    publish: true
  },
  description: {
    type: String,
    optional: true,
    viewableIf: alwaysPublic,
    insertableIf: canInsert,
    editableIf: canEdit,
    publish: true,
    form: {
      rows: 3
    }
  },
  order: {
    type: Number,
    optional: true,
    viewableIf: alwaysPublic,
    insertableIf: canInsert,
    editableIf: canEdit,
    publish: true
  },
  slug: {
    type: String,
    optional: true,
    viewableIf: alwaysPublic,
    insertableIf: canInsert,
    editableIf: canEdit,
    publish: true,
  },
  image: {
    type: String,
    optional: true,
    viewableIf: alwaysPublic,
    insertableIf: canInsert,
    editableIf: canEdit,
    publish: true
  },
  parentId: {
    type: String,
    optional: true,
    viewableIf: alwaysPublic,
    insertableIf: canInsert,
    editableIf: canEdit,
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