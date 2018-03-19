import { createCollection } from 'meteor/vulcan:lib';
import schema from './schema.js';
import resolvers from './resolvers.js';

const Settings = createCollection({

  collectionName: 'Settings',

  typeName: 'Setting',

  schema,
  
  resolvers,

});


export default Settings;
