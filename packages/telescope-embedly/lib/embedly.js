Posts.addField([
  {
    fieldName: 'thumbnailUrl',
    fieldSchema: {
      type: String,
      optional: true,
      editableBy: ["member", "admin"],
      autoform: {
        type: 'bootstrap-postthumbnail'
      }
    }
  },
  {
    fieldName: 'media',
    fieldSchema: {
      type: Object,
      optional: true,
      blackbox: true
    }
  },
  {
    fieldName: 'sourceName',
    fieldSchema: {
      type: String,
      optional: true,
    }
  },
  {
    fieldName: 'sourceUrl',
    fieldSchema: {
      type: String,
      optional: true,
    }
  }
]);

Telescope.modules.add("postThumbnail", {
  template: 'post_thumbnail',
  order: 15
});

Settings.addField([
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

function addThumbnailClass (postClass, post) {
  var thumbnailClass = !!post.thumbnailUrl ? "has-thumbnail" : "no-thumbnail";
  return postClass + " " + thumbnailClass;
}
// add callback that adds "has-thumbnail" or "no-thumbnail" CSS classes
Telescope.callbacks.add("postClass", addThumbnailClass);
