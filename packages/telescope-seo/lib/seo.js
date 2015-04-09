// Add SEO settings.
Settings.addToSchema({
  propertyName: "siteImage",
  propertySchema: {
    type: String,
    optional: true,
    regEx: SimpleSchema.RegEx.Url,
    autoform: {
      group: "general",
      instructions: "URL to an image for the open graph image tag for all pages"
    }
  }
});
