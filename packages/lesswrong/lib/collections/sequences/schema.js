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
    editableBy: Users.owns,
  },

  description: {
    type: Object,
    optional: true,
    viewableBy: ['guests'],
    editableBy: Users.owns,
  },

  commentCount:{
    type: Number,
    optional: true,
    viewableBy: ['guests'],
  },

  chapterIds: {
    type: Array,
    optional: true,
    viewableBy: ["guests"],
    resolveAs: {
      fieldName: 'chapters',
      type: '[Chapter]',
      resolver: (sequence, args, context) => {
        return (_.map(sequence.chapterIds, (id) =>
          { return context.Chapters.findOne({ _id: id }, { fields: context.Users.getViewableFields(context.currentUser, context.Chapters)})
        }))
      },
      addOriginalField: true,
    }
  },

  'chapterIds.$': {
    type: String,
    optional: true,
  },

  draft: {
    type: Boolean,
    optional: true,
  }

}


export default schema;
