/*

The main Movies collection definition file.

*/

import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';
import schema from './schema.js';

/*

Movies collection definition

*/
const Movies = createCollection({

  collectionName: 'Movies',

  typeName: 'Movie',

  schema,
  
  resolvers: getDefaultResolvers('Movies'),

  mutations: getDefaultMutations('Movies'),

});

/*

Permissions for members (regular users)

*/
const membersActions = [
  'movies.new',
  'movies.edit.own',
  'movies.remove.own',
];
Users.groups.members.can(membersActions);

/*

Default sort

*/
Movies.addDefaultView(terms => ({
  options: {
    sort: {
      createdAt: -1
    }
  }
}));

export default Movies;
