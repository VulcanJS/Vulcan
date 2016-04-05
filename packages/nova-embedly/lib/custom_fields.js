import PublicationUtils from 'meteor/utilities:smart-publications';
import EmbedlyThumbnail from './components/EmbedlyThumbnail.jsx';

Posts.addField([
  {
    fieldName: 'thumbnailUrl',
    fieldSchema: {
      type: String,
      optional: true,
      insertableIf: Users.is.memberOrAdmin,
      editableIf: Users.is.ownerOrAdmin,
      publish: true,
      control: EmbedlyThumbnail
    }
  },
  {
    fieldName: 'media',
    fieldSchema: {
      type: Object,
      publish: true,
      optional: true,
      blackbox: true
    }
  },
  {
    fieldName: 'sourceName',
    fieldSchema: {
      type: String,
      optional: true,
      publish: true,
    }
  },
  {
    fieldName: 'sourceUrl',
    fieldSchema: {
      type: String,
      optional: true,
      publish: true,
    }
  }
]);

PublicationUtils.addToFields(Posts.publishedFields.list, ["thumbnailUrl", "media", "sourceName", "sourceUrl"]);

if (typeof Telescope.settings.collection !== "undefined") {
  Telescope.settings.collection.addField([
    {
      fieldName: 'embedlyKey',
      fieldSchema: {
        type: String,
        optional: true,
        private: true,
        autoform: {
          group: 'embedly',
          class: 'private-field'
        }
      }
    },
    {
      fieldName: 'thumbnailWidth',
      fieldSchema: {
        type: Number,
        optional: true,
        autoform: {
          group: 'embedly'
        }
      }
    },
    {
      fieldName: 'thumbnailHeight',
      fieldSchema: {
        type: Number,
        optional: true,
        autoform: {
          group: 'embedly'
        }
      }
    }
  ]);
}