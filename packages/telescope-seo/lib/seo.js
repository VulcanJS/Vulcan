// Add SEO settings.
addToSettingsSchema.push({
  propertyName: "seoDescription",
  propertySchema: {
    type: String,
    optional: true,
    label: "description",
    autoform: {
      group: "search engine optimization",
      instructions: "Content for the meta description og:description tags for the front page and others that don't otherwise specify it.",
      rows: 2
    }
  }
});
addToSettingsSchema.push({
  propertyName: "seoOgImage",
  propertySchema: {
    type: String,
    optional: true,
    regEx: SimpleSchema.RegEx.Url,
    label: "og:image",
    autoform: {
      group: "search engine optimization",
      instructions: "URL to an image for the open graph image tag for all pages"
    }
  }
});
addToSettingsSchema.push({
  propertyName: "seoGenerateSitemap",
  propertySchema: {
    type: Boolean,
    defaultValue: false,
    label: "Generate sitemap",
    autoform: {
      group: "search engine optimization",
      instructions: "Automatically generate an XML sitemap for search engines, and append the sitemap URL to the output of robots.txt?  NOTE: Requires restart to reflect change."
    }
  }
})
