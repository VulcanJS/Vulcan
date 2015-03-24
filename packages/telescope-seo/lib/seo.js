// Add SEO settings.
addToSettingsSchema.push({
  propertyName: "seoOgImage",
  propertySchema: {
    type: String,
    optional: true,
    regEx: SimpleSchema.RegEx.Url,
    label: "og image",
    autoform: {
      group: "search engine optimization",
      instructions: "URL to an image for the open graph image tag for all pages"
    }
  }
});
