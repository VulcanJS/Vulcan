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
    onInsert: () => {
      return new Date();
    },
  },
  // Custom Properties

  title: {
    type: String,
    optional: false,
    viewableBy: ['guests'],
    editableBy: Users.owns,
  },

  subtitle: {
    type: String,
    optional: false,
    viewableBy: ['guests'],
    editableBy: Users.owns,
  },

  description: {
    type: Object,
    optional: true,
    viewableBy: ['guests'],
    editableBy: Users.owns,
  },

  sequenceIds: {
    type: Array,
    optional: false,
    viewableBy: ["guests"],
    resolveAs: {
      fieldName: 'sequences',
      type: '[Sequence]',
      resolver: (book, args, context) => {
        return (_.map(book.sequenceIds, (id) =>
          { return context.Sequences.findOne({ _id: id }, { fields: context.Users.getViewableFields(context.currentUser, context.Sequences)})
        }))
      },
      addOriginalField: true,
    }
  },

  'sequenceIds.$': {
    type: String,
    optional: true,
  }

}


export default schema;
