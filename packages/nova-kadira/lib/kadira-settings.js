import Telescope from 'meteor/nova:lib';

var kadiraAppIdProperty = {
  fieldName: "kadiraAppId",
  propertyGroup: "kadira",
  fieldSchema: {
    type: String,
    optional: true,
    form: {
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
    form: {
      group: "kadira",
      class: "private-field"
    }
  }
};
Telescope.settings.collection.addField(kadiraAppSecretProperty);
