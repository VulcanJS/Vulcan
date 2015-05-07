// Custom Setting

var customSetting = {
  propertyName: "customSetting",
  propertySchema: {
    type: String,
    optional: true,
    private: true,                         // mark as private (not published to client)
    autoform: {
      group: "customGroup",                 // assign custom group (fieldset) in Settings form
      class: "private-field"
    }
  }
}
Settings.registerField(customSetting);
