import { createCollection } from 'meteor/vulcan:lib';
import schema from './schema.js';
import resolvers from './resolvers.js';

const Emails = createCollection({

  collectionName: 'Emails',

  typeName: 'Email',

  schema,
  
  resolvers,

  mutations: null,

});


export default Emails;
