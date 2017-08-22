import Users from 'meteor/vulcan:users';
import PostsListEditor from '../../../components/form-components/PostsListEditor.jsx';
import EditorFormComponent from '../../editor/EditorFormComponent.jsx';

const schema = {

  _id: {
    type: String,
    optional: true,
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
    editableBy: ["admins"],
    insertableBy: ['members'],
  },

  subtitle: {
    type: String,
    optional: true,
    viewableBy: ['guests'],
    editableBy: ["admins"],
    insertableBy: ['members'],
  },

  description: {
    type: Object,
    blackbox: true,
    optional: true,
    viewableBy: ['guests'],
    editableBy: ["admins"],
    insertableBy: ['members'],
    control: EditorFormComponent,
  },

  number: {
    type: Number,
    optional: true,
    viewableBy: ['guests'],
    editableBy: ['members'],
    insertableBy: ['members'],
  },

  sequenceId: {
    type: String,
    optional: true,
    hidden: true,
    viewableBy: ['guests'],
    editableBy: ['admins'],
    insertableBy: ['members'],
    resolveAs: {
      fieldName: 'sequence',
      type: 'Sequence',
      resolver: (chapter, args, context) => {
        return context.Sequences.findOne({_id: chapter.sequenceId}, {fields: context.Users.getViewableFields(context.currentUser, context.Posts)})
      },
      addOriginalField: true,
    }
  },

  postIds: {
    type: Array,
    optional: false,
    viewableBy: ["guests"],
    editableBy: ["admins"],
    insertableBy: ['members'],
    resolveAs: {
      fieldName: 'posts',
      type: '[Post]',
      resolver: (chapter, args, context) => {
        return (_.map(chapter.postIds, (id) =>
          { return context.Posts.findOne({ _id: id }, { fields: context.Users.getViewableFields(context.currentUser, context.Posts)})
        }))
      },
      addOriginalField: true,
    },
    control: PostsListEditor,
  },

  "postIds.$": {
    type: String,
    optional: true,
  },
}

export default schema;
