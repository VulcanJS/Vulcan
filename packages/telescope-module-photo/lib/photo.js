var photo = {
  propertyName: 'photo',
  propertySchema: {
    type: String,
    label: "Photo",
    optional: true,
    autoform:{
      editable: true,
      omit: false,
        type: "cfs-file",
        collection: "files"
    }
  }
}

addToPostSchema.push(photo);


postModules.push({
  template: 'postPhoto',
  position: 'center-center'
});
