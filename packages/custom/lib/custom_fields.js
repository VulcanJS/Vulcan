// Custom Post Field

var customField = {
  propertyName: 'customField',
  propertySchema: {
    type: String,                           // property type
    label: 'customLabel',                   // key string used for internationalization
    optional: true,                         // make this property optional
    autoform: {
      editable: true,                       // make this property editable by users
      type: "bootstrap-datetimepicker",     // assign a custom input type
      omit: false                           // set to true to omit field from form entirely
    }
  }
}
Posts.registerField(customField);
