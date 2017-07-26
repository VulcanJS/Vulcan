import Users from 'meteor/vulcan:users'
const schema = {

  // default properties

  _id: {
    type: String,
    optional: false,
    viewableBy: ['guests'],
  },

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

  chapterIds: {
    type: Array,
    optional: false,
    viewableBy: ["guests"],
    resolveAs: {
      fieldName: 'chapters',
      type: '[Chapters]',
      resolver: (sequence, args, context) => {
        return _.map(sequence.chapterIds, (id) => {
          return context.Chapters.findOne({_id: id}, {fields: context.Users.getViewableFields(context.currentUser, context.Sequences)})
        });
      }
    }
  },

  'chapterIds.$': {
    type: String,
    optional: true,
  }


}


export default schema;
