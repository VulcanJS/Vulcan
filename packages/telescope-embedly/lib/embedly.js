var thumbnailProperty = {
  propertyName: 'thumbnailUrl',
  propertySchema: {
    type: String,
    optional: true,
    editableBy: ["member", "admin"],
    autoform: {
      type: 'bootstrap-postthumbnail'
    }
  }
};
Posts.registerField(thumbnailProperty);

var mediaProperty = {
  propertyName: 'media',
  propertySchema: {
    type: Object,
    optional: true,
    blackbox: true
  }
};
Posts.registerField(mediaProperty);

Telescope.modules.register("postThumbnail", {
  template: 'postThumbnail',
  order: 15
});

var embedlyKeyProperty = {
  propertyName: 'embedlyKey',
  propertySchema: {
    type: String,
    optional: true,
    private: true,
    autoform: {
      group: 'embedly',
      class: 'private-field'
    }
  }
};
Settings.registerField(embedlyKeyProperty);

var thumbnailWidthProperty = {
  propertyName: 'thumbnailWidth',
  propertySchema: {
    type: Number,
    optional: true,
    autoform: {
      group: 'embedly'
    }
  }
};
Settings.registerField(thumbnailWidthProperty);

var thumbnailHeightProperty = {
  propertyName: 'thumbnailHeight',
  propertySchema: {
    type: Number,
    optional: true,
    autoform: {
      group: 'embedly'
    }
  }
};
Settings.registerField(thumbnailHeightProperty);

function addThumbnailClass (post, postClass) {
  var thumbnailClass = !!post.thumbnailUrl ? "has-thumbnail" : "no-thumbnail";
  return postClass + " " + thumbnailClass;
}
// add callback that adds "has-thumbnail" or "no-thumbnail" CSS classes
Telescope.callbacks.register("postClass", addThumbnailClass);
