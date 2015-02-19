var picture = {
  propertyName: 'photo',
  propertySchema: {
    type: String,
    label: "Photo",
    optional: true,
    autoform:{
      editable: true,
      omit: false,
      afFieldInput: {
        type: "cfs-file"
      }
    }
  }
}
addToPostSchema.push(picture);