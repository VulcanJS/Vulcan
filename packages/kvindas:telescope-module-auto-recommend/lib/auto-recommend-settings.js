console.log("adding settings to addToSettings");
var autoRecommendProperty = {
  propertyName: 'autoRecommendTitleAndContent',
  propertySchema: {
    type: Boolean,
    label: "Auto Recommend Title and Content",
    optional: true
  }
}
addToSettingsSchema.push(autoRecommendProperty);