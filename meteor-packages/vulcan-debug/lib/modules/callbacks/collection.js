import { createCollection } from 'meteor/vulcan:lib';
import schema from './schema.js';
import resolvers from './resolvers.js';
import './fragments.js';

const Callbacks = createCollection({

  collectionName: 'Callbacks',

  typeName: 'Callback',

  schema,
  
  resolvers,

});


export default Callbacks;
