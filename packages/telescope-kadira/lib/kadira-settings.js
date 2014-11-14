var kadiraAppIdProperty = {
  propertyName: 'kadiraAppId',
  propertyGroup: 'kadira',
  propertySchema: {
    type: String,
    optional: true,
    autoform: {
      group: 'kadira'
    }
  }
}
addToSettingsSchema.push(kadiraAppIdProperty);

var kadiraAppSecretProperty = {
  propertyName: 'kadiraAppSecret',
  propertyGroup: 'kadira',
  propertySchema: {
    type: String,
    optional: true,
    autoform: {
      group: 'kadira'
    }
  }
}
addToSettingsSchema.push(kadiraAppSecretProperty);