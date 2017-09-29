export const CloudinaryCollections = [];

export const addCustomFields = collection => {

  CloudinaryCollections.push(collection);

  collection.addField([
    {
      fieldName: 'cloudinaryId',
      fieldSchema: {
        type: String,
        optional: true,
        viewableBy: ['guests'],
      }
    },
    {
      fieldName: 'cloudinaryUrls',
      fieldSchema: {
        type: Array,
        optional: true,
        viewableBy: ['guests'],
      }
    },
    {
      fieldName: 'cloudinaryUrls.$',
      fieldSchema: {
        type: Object,
        blackbox: true,
        optional: true
      }
    }
  ]);
  
}