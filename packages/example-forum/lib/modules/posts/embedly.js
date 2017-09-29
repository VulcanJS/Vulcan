import { Posts } from '../posts/index.js';

Posts.addField([
  {
    fieldName: 'url',
    fieldSchema: {
      control: 'EmbedURL', // we are just extending the field url, not replacing it
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
      hidden: true
    }
  },
  {
    fieldName: 'media',
    fieldSchema: {
      type: Object,
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
      viewableBy: ['guests'],
    }
  },
  {
    fieldName: 'sourceUrl',
    fieldSchema: {
      type: String,
      optional: true,
      viewableBy: ['guests'],
    }
  }
]);