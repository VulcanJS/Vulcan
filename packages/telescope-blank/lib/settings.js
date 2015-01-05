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