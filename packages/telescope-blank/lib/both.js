var customProperty = {
  propertyName: 'customProperty',
  propertySchema: {
    type: String, // property type
    label: 'customLabel', // key string used for internationalization
    optional: true, // make this property optional
    autoform: {
      editable: true, // make this property editable by users
      group: 'xyz', // assign a custom form group
      type: "bootstrap-datetimepicker" // assign a custom input type
    }
  }
}
addToPostSchema.push(customProperty);