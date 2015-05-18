var thumbnailProperty = {
  fieldName: 'thumbnailUrl',
  fieldSchema: {
    type: String,
    optional: true,
    editableBy: ["member", "admin"],
    autoform: {
      type: 'bootstrap-postthumbnail'
    }
  }
};
Posts.addField(thumbnailProperty);

var mediaProperty = {
  fieldName: 'media',
  fieldSchema: {
    type: Object,
    optional: true,
    blackbox: true
  }
};
Posts.addField(mediaProperty);

Telescope.modules.add("postThumbnail", {
  template: 'post_thumbnail',
  order: 15
});

var embedlyKeyProperty = {
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
};
Settings.addField(embedlyKeyProperty);

var thumbnailWidthProperty = {
  fieldName: 'thumbnailWidth',
  fieldSchema: {
    type: Number,
    optional: true,
    autoform: {
      group: 'embedly'
    }
  }
};
Settings.addField(thumbnailWidthProperty);

var thumbnailHeightProperty = {
  fieldName: 'thumbnailHeight',
  fieldSchema: {
    type: Number,
    optional: true,
    autoform: {
      group: 'embedly'
    }
  }
};
Settings.addField(thumbnailHeightProperty);

function addThumbnailClass (post, postClass) {
  var thumbnailClass = !!post.thumbnailUrl ? "has-thumbnail" : "no-thumbnail";
  return postClass + " " + thumbnailClass;
}
// add callback that adds "has-thumbnail" or "no-thumbnail" CSS classes
Telescope.callbacks.add("postClass", addThumbnailClass);
