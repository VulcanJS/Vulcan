import Users from 'meteor/vulcan:users'
import SequencesListEditor from '../../../components/form-components/SequencesListEditor.jsx';
import EditorFormComponent from '../../editor/EditorFormComponent.jsx';


const schema = {

  // default properties

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
    editableBy: ['members'],
    insertableBy: ['members'],
  },

  subtitle: {
    type: String,
    optional: true,
    viewableBy: ['guests'],
    editableBy: ['members'],
    insertableBy: ['members'],
  },

  description: {
    type: Object,
    optional: true,
    viewableBy: ['guests'],
    editableBy: ['members'],
    insertableBy: ['members'],
    control: EditorFormComponent,
    blackbox: true, 
  },

  collectionId: {
    type: String,
    optional: false,
    viewableBy: ['guests'],
    editableBy: ['admins'],
    insertableBy: ['members'],
  },

  sequenceIds: {
    type: Array,
    optional: false,
    viewableBy: ["guests"],
    editableBy: ['members'],
    insertableBy: ['members'],
    resolveAs: {
      fieldName: 'sequences',
      type: '[Sequence]',
      resolver: (book, args, context) => {
        return (_.map(book.sequenceIds, (id) =>
          { return context.Sequences.findOne({ _id: id }, { fields: context.Users.getViewableFields(context.currentUser, context.Sequences)})
        }))
      },
      addOriginalField: true,
    },
    control: SequencesListEditor,
  },

  'sequenceIds.$': {
    type: String,
    optional: true,
  }

}


export default schema;
