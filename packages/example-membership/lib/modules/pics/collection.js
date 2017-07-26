/*

The main Pics collection definition file.

*/

import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';
import schema from './schema.js';
import './fragments.js';
import './permissions.js';

const Pics = createCollection({

  collectionName: 'Pics',

  typeName: 'Pic',

  schema,
  
  resolvers: getDefaultResolvers('Pics'),

  mutations: getDefaultMutations('Pics'),

});

/*

Set a default results view whenever the Pics collection is queried:

- Pics are sorted by their createdAt timestamp in descending order

*/
Pics.addDefaultView(terms => {
  return {
    options: {sort: {createdAt: -1}}
  };
});

/*

Limit Pics access to users who can perform "pics.view" action

*/
Pics.checkAccess = (currentUser, pic) => {
  return Users.canDo(currentUser, 'pics.view');
}

export default Pics;
