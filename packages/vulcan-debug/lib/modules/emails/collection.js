import { createCollection } from 'meteor/vulcan:lib';
import schema from './schema.js';

const Emails = createCollection({

  collectionName: 'Emails',

  typeName: 'Email',

  schema,
  
  resolvers: null,

  mutations: null,

});


export default Emails;
