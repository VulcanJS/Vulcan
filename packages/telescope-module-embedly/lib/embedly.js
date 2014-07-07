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
  position: 'leftOfCenter'
});

var embedlyKeyProperty = {
  propertyName: 'embedlyKey',
  propertySchema: {
    type: String,
    optional: true
  }
}
addToSettingsSchema.push(embedlyKeyProperty);