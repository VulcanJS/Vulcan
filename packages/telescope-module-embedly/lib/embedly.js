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