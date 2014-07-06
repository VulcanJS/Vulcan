var thumbnailProperty = {
  propertyName: 'thumbnailUrl',
  propertySchema: {
    type: String,
    optional: true
  }
}
addToPostSchema.push(thumbnailProperty);

postModules.push({
  template: 'postThumbnail', 
  position: 'rightOfLeft'
});

var embedlyKeyProperty = {
  propertyName: 'embedlyKey',
  propertySchema: {
    type: String,
    optional: true
  }
}
addToSettingsSchema.push(embedlyKeyProperty);