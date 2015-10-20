Settings.addField({
  fieldName: "prerenderIOToken",
  propertyGroup: "prerender",
  fieldSchema: {
    type: String,
    optional: true,
    private: true,
    autoform: {
      group: "prerender",
      class: "private-field"
    }
  }
});
