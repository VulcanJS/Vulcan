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
};
Settings.addToSchema(kadiraAppIdProperty);

var kadiraAppSecretProperty = {
  propertyName: 'kadiraAppSecret',
  propertyGroup: 'kadira',
  propertySchema: {
    type: String,
    optional: true,
    autoform: {
      group: 'kadira',
      private: true
    }
  }
};
Settings.addToSchema(kadiraAppSecretProperty);
