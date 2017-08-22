import Users from 'meteor/vulcan:users'
import { Components } from 'meteor/vulcan:core';
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
  },

  description: {
    type: Object,
    optional: true,
    viewableBy: ['guests'],
    editableBy: ['admins'],
    control: EditorFormComponent,
    blackbox: true,
  },

  commentCount:{
    type: Number,
    optional: true,
    viewableBy: ['guests'],
  },

  //Cloudinary image id for the grid Image

  gridImageId: {
    type: String,
    optional: true,
    viewableBy: ['guests'],
    editableBy: ['admins'],
    insertableBy: Users.owns,
  },

  //Cloudinary image id for the banner image (high resolution)

  bannerImageId: {
    type: String,
    optional: true,
    viewableBy: ['guests'],
    editableBy: ['admins'],
    insertableBy: Users.owns,
  },
  
}


export default schema;
