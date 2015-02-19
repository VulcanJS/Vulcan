var photo = {
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
addToPostSchema.push(photo);

postModules.push({
  template: 'postPhoto',
  position: 'center-center'
});

