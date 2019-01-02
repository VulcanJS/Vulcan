export const CloudinaryCollections = [];

export const addCustomFields = collection => {

  CloudinaryCollections.push(collection);

  collection.addField([
    {
      fieldName: 'cloudinaryId',
      fieldSchema: {
        type: String,
        optional: true,
        canRead: ['guests'],
      }
    },
    {
      fieldName: 'cloudinaryUrls',
      fieldSchema: {
        type: Array,
        optional: true,
        canRead: ['guests'],
      }
    },
    {
      fieldName: 'cloudinaryUrls.$',
      fieldSchema: {
        type: Object,
        blackbox: true,
        optional: true
      }
    },

    // GraphQL only
    {
      fieldName: 'cloudinaryUrl',
      fieldSchema: {
        type: String,
        optional: true,
        canRead: ['guests'],
        resolveAs: {
          type: 'String',
          arguments: 'format: String',
          resolver: (document, {format}, context) => {
            const image = format ? _.findWhere(document.cloudinaryUrls, {name: format}) : document.cloudinaryUrls[0];
            return image && image.url;
          }
        },
      }
    },

  ]);
  
};