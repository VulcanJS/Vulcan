import { createCollection } from 'meteor/vulcan:lib';
import schema from './schema.js';
import './fragments.js';

const Callbacks = createCollection({

  collectionName: 'Callbacks',

  typeName: 'Callback',

  schema,
  
  resolvers: null,

  mutations: null,

});


export default Callbacks;
