import Telescope from 'meteor/nova:lib';
import EmbedlyURL from './components/EmbedlyURL.jsx';
import ThumbnailURL from './components/ThumbnailURL.jsx';
import Posts from "meteor/nova:posts";
import Users from 'meteor/nova:users';

// check if user can create a new post
const canInsert = user => Users.canDo(user, "posts.new");
// check if user can edit a post
const canEdit = Users.canEdit;

const alwaysPublic = user => true;

Posts.addField([
  {
    fieldName: 'url',
    fieldSchema: {
      type: String,
      optional: true,
      max: 500,
      insertableIf: canInsert,
      editableIf: canEdit,
      viewableIf: alwaysPublic,
      control: EmbedlyURL,
      publish: true
    }
  },
  {
    fieldName: 'thumbnailUrl',
    fieldSchema: {
      type: String,
      optional: true,
      insertableIf: canInsert,
      editableIf: canEdit,
      viewableIf: alwaysPublic,
      publish: true,
      control: ThumbnailURL
    }
  },
  {
    fieldName: 'media',
    fieldSchema: {
      type: Object,
      publish: true,
      optional: true,
      blackbox: true,
      viewableIf: alwaysPublic,
    }
  },
  {
    fieldName: 'sourceName',
    fieldSchema: {
      type: String,
      optional: true,
      publish: true,
      viewableIf: alwaysPublic,
    }
  },
  {
    fieldName: 'sourceUrl',
    fieldSchema: {
      type: String,
      optional: true,
      publish: true,
      viewableIf: alwaysPublic,
    }
  }
]);
