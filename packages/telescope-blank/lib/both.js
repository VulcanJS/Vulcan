// Custom Post Property

var customProperty = {
  propertyName: 'customProperty',
  propertySchema: {
    type: String,                           // property type
    label: 'customLabel',                   // key string used for internationalization
    optional: true,                         // make this property optional
    autoform: {
      editable: true,                       // make this property editable by users
      type: "bootstrap-datetimepicker"      // assign a custom input type
    }
  }
}
addToPostSchema.push(customProperty);

// Custom Setting

var customSetting = {
  propertyName: 'customSetting',
  propertySchema: {
    type: String,
    optional: true,
    autoform: {
      group: 'customGroup',                 // assign custom group (fieldset) in Settings form
      private: true                         // mark as private (not published to client)
    }
  }
}
addToSettingsSchema.push(customSetting);

// Global Function

myFunction = function (a, b) {
  return a + b;
}