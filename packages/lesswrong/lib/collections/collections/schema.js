import Users from 'meteor/vulcan:users'
const schema = {

  // default properties

  _id: {
    type: String,
    optional: false,
    viewableBy: ['guests'],
  },

  createdAt: {
    type: Date,
    optional: true,
    viewableBy: ['guests'],
    editableBy: ['admins'],
    insertableBy: ['admins'],
    onInsert: () => {
      return new Date();
    },
  },

  userId: {
    type: String,
    optional: true,
    viewableBy: ['guests'],
    resolveAs: {
      fieldName: 'user',
      type: 'User',
      resolver: (sequence, args, context) => {
        return context.Users.findOne({ _id: sequence.userId }, { fields: context.Users.getViewableFields(context.currentUser, context.Users)})
      },
      addOriginalField: true,
    }
  },

  // Custom Properties

  title: {
    type: String,
    optional: false,
    viewableBy: ['guests'],
    editableBy: ['admins'],
    insertableBy: ['admins'],
  },

  description: {
    type: Object,
    optional: true,
    viewableBy: ['guests'],
    editableBy: ['admins'],
    insertableBy: ['admins'],
  },

  bookIds: {
    type: Array,
    optional: true,
    viewableBy: ["guests"],
    resolveAs: {
      fieldName: 'books',
      type: '[Book]',
      resolver: (collection, args, context) => {
        return (_.map(collection.bookIds, (id) =>
          { return context.Books.findOne({ _id: id }, { fields: context.Users.getViewableFields(context.currentUser, context.Books)})
        }))
      },
      addOriginalField: true,
    }
  },

  'bookIds.$': {
    type: String,
    optional: true,
  },

  imageUrl: {
    type: String,
    optional: true,
    viewableBy: ["guests"],
    editableBy: ['admins'],
    insertableBy: ['admins'],
  }

}


export default schema;
