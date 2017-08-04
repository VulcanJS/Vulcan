import Users from 'meteor/vulcan:users';

const schema = {

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
    optional: true,
    viewableBy: ['guests'],
    editableBy: Users.owns,
  },

  subtitle: {
    type: String,
    optional: true,
    viewableBy: ['guests'],
    editableBy: Users.owns,
  },

  description: {
    type: String,
    blackbox: true,
    optional: true,
    viewableBy: ['guests'],
    editableBy: Users.owns,
  },

  number: {
    type: Number,
    optional: false,
    viewableBy: ['guests'],
    editableBy: Users.owns,
  },

  postIds: {
    type: Array,
    optional: false,
    viewableBy: ["guests"],
    resolveAs: {
      fieldName: 'posts',
      type: '[Post]',
      resolver: (chapter, args, context) => {
        return (_.map(chapter.postIds, (id) =>
          { return context.Posts.findOne({ _id: id }, { fields: context.Users.getViewableFields(context.currentUser, context.Posts)})
        }))
      },
      addOriginalField: true,
    }
  },

  "postIds.$": {
    type: String,
    optional: true,
  },
}

export default schema;
