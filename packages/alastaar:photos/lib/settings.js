// Custom Setting

var pictureSetting = {
  propertyName: 'pictureSetting',
  propertySchema: {
    type: String,
    optional: true,
    autoform: {
      group: 'pictureGroup',                 // assign custom group (fieldset) in Settings form
      private: true                         // mark as private (not published to client)
    }
  }
}
addToSettingsSchema.push(customSetting);