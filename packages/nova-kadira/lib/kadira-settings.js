var kadiraAppIdProperty = {
  fieldName: "kadiraAppId",
  propertyGroup: "kadira",
  fieldSchema: {
    type: String,
    optional: true,
    autoform: {
      group: "kadira"
    }
  }
};
Telescope.settings.collection.addField(kadiraAppIdProperty);

var kadiraAppSecretProperty = {
  fieldName: "kadiraAppSecret",
  propertyGroup: "kadira",
  fieldSchema: {
    type: String,
    optional: true,
    private: true,
    autoform: {
      group: "kadira",
      class: "private-field"
    }
  }
};
Telescope.settings.collection.addField(kadiraAppSecretProperty);
