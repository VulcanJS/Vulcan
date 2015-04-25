var kadiraAppIdProperty = {
  propertyName: "kadiraAppId",
  propertyGroup: "kadira",
  propertySchema: {
    type: String,
    optional: true,
    autoform: {
      group: "kadira"
    }
  }
};
Settings.registerField(kadiraAppIdProperty);

var kadiraAppSecretProperty = {
  propertyName: "kadiraAppSecret",
  propertyGroup: "kadira",
  propertySchema: {
    type: String,
    optional: true,
    private: true,
    autoform: {
      group: "kadira",
      class: "private-field"
    }
  }
};
Settings.registerField(kadiraAppSecretProperty);
