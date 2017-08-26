import Users from 'meteor/vulcan:users'
import { Components } from 'meteor/vulcan:core';
import EditorFormComponent from '../../editor/EditorFormComponent.jsx';
import ImageUpload from '../../../components/form-components/ImageUpload.jsx';

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

  descriptionPlaintext: {
    type: String,
    optional: true,
    viewableBy: ['guests'],
  },

  commentCount:{
    type: Number,
    optional: true,
    viewableBy: ['guests'],
  },

  baseScore: {
    type: Number,
    optional: true,
    viewableBy: ['guests'],
    editableBy: ['admins'],
    insertableBy: ['admins'],
  },

  score: {
    type: Number,
    optional: true,
    viewableBy: ['guests'],
    editableBy: ['admins'],
    insertableBy: ['admins'],
  },

  chaptersDummy: {
    type: Array,
    optional: true,
    viewableBy: ['guests'],
    resolveAs: {
      fieldName: 'chapters',
      type: '[Chapter]',
      resolver: (sequence, args, context) => {
        const books = context.Chapters.find({sequenceId: sequence._id}, {fields: context.Users.getViewableFields(context.currentUser, context.Chapters)}).fetch();
        return books;
      }
    }
  },

  'chaptersDummy.$': {
    type: String,
    optional: true,
  },

  //Cloudinary image id for the grid Image

  gridImageId: {
    type: String,
    optional: true,
    viewableBy: ['guests'],
    editableBy: ['admins'],
    insertableBy: ['members'],
    control: ImageUpload,
  },

  //Cloudinary image id for the banner image (high resolution)

  bannerImageId: {
    type: String,
    optional: true,
    viewableBy: ['guests'],
    editableBy: ['admins'],
    insertableBy: ['members'],
    control: ImageUpload,
  },

  draft: {
    type: Boolean,
    optional: true,
    viewableBy: ['guests'],
    editableBy: ['members'],
    insertableBy: ['members'],
    control: "checkbox"
  },

  isDeleted: {
    type: Boolean,
    optional: true,
    viewableBy: ['guests'],
    editableBy: ['members'],
    insertableBy: ['members'],
    control: "checkbox"
  },

  algoliaIndexAt: {
    type: Date,
    optional: true,
    viewableBy: ['guests'],
  },

}


export default schema;
