var Preis = {
  propertyName: 'Preis',
  propertySchema: {
    type: String,                           // property type
    label: 'Preis',                   // key string used for internationalization
    optional: true,                         // make this property optional
    autoform: {
      editable: true,                       // make this property editable by users
      type: "number",     // assign a custom input type 
      order: 1,
    omit: false                           // set to true to omit field from form entirely
    }
  }
}
addToPostSchema.push(Preis);



postHeading.push({
  template: 'Preis',
  order: 20
});