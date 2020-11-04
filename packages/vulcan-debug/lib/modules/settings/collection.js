import { createCollection } from 'meteor/vulcan:lib';
import schema from './schema.js';

const Settings = createCollection({

  collectionName: 'Settings',

  typeName: 'Setting',

  schema,
  
  resolvers: null,

  mutations: null,

});


export default Settings;
