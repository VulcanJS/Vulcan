Meteor.startup(function () {
  if(!Meteor.isClient){
    return;
  }
  var overrideTemplate = Template['post_submit_plus'];
  Template['post_submit'] = overrideTemplate;
});

var thumbnailProperty = {
  propertyName: 'thumbnailUrl',
  propertySchema: {
    type: String,
    optional: true
  }
}
addToPostSchema.push(thumbnailProperty);

var mediaProperty = {
  propertyName: 'media',
  propertySchema: {
    type: Object,
    optional: true,
    blackbox: true
  }
}
addToPostSchema.push(mediaProperty);


postModules.push({
  template: 'postThumbnail',
  position: 'center-left'
});


var embedlyKeyProperty = {
  propertyName: 'embedlyKey',
  propertySchema: {
    type: String,
    optional: true,
    autoform: {
      group: 'embedly'
    }
  }
}
addToSettingsSchema.push(embedlyKeyProperty);

var embedlyThumbnailHeight = {
  propertyName: 'embedlyThumbnailHeight',
  propertySchema: {
    type: Number,
    optional: true,
    autoform: {
      group: 'embedly'
    }
  }
}
addToSettingsSchema.push(embedlyThumbnailHeight);

var embedlyThumbnailWidth = {
  propertyName: 'embedlyThumbnailWidth',
  propertySchema: {
    type: Number,
    optional: true,
    autoform: {
      group: 'embedly'
    }
  }
}
addToSettingsSchema.push(embedlyThumbnailWidth);

