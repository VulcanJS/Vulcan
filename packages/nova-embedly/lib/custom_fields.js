import Telescope from 'meteor/nova:lib';
import EmbedlyURL from './components/EmbedlyURL.jsx';
import ThumbnailURL from './components/ThumbnailURL.jsx';
import Posts from "meteor/nova:posts";

Posts.addField([
  {
    fieldName: 'url',
    fieldSchema: {
      type: String,
      optional: true,
      max: 500,
      insertableIf: ['default'],
      editableIf: ['default'],
      viewableIf: ['anonymous'],
      control: EmbedlyURL,
      publish: true
    }
  },
  {
    fieldName: 'thumbnailUrl',
    fieldSchema: {
      type: String,
      optional: true,
      insertableIf: ['default'],
      editableIf: ['default'],
      viewableIf: ['anonymous'],
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
      viewableIf: ['anonymous'],
    }
  },
  {
    fieldName: 'sourceName',
    fieldSchema: {
      type: String,
      optional: true,
      publish: true,
      viewableIf: ['anonymous'],
    }
  },
  {
    fieldName: 'sourceUrl',
    fieldSchema: {
      type: String,
      optional: true,
      publish: true,
      viewableIf: ['anonymous'],
    }
  }
]);
