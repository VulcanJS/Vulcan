import PublicationUtils from 'meteor/utilities:smart-publications';

Posts.addField([
  {
    fieldName: 'thumbnailUrl',
    fieldSchema: {
      type: String,
      optional: true,
      insertableIf: Users.is.memberOrAdmin,
      editableIf: Users.is.ownerOrAdmin,
      publish: true,
      autoform: {
        type: 'bootstrap-postthumbnail',
        order: 40
      }
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
PublicationUtils.addToFields(Posts.publishedFields.single, ["thumbnailUrl", "media", "sourceName", "sourceUrl"]);