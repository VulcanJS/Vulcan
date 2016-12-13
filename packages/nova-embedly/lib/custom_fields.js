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
      insertableBy: ['members'],
      editableBy: ['members'],
      viewableBy: ['guests'],
      control: EmbedlyURL,
      publish: true
    }
  },
  {
    fieldName: 'thumbnailUrl',
    fieldSchema: {
      type: String,
      optional: true,
      insertableBy: ['members'],
      editableBy: ['members'],
      viewableBy: ['guests'],
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
      viewableBy: ['guests'],
    }
  },
  {
    fieldName: 'sourceName',
    fieldSchema: {
      type: String,
      optional: true,
      publish: true,
      viewableBy: ['guests'],
    }
  },
  {
    fieldName: 'sourceUrl',
    fieldSchema: {
      type: String,
      optional: true,
      publish: true,
      viewableBy: ['guests'],
    }
  }
]);
