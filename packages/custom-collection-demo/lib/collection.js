import Telescope from 'meteor/nova:lib';
import schema from './schema.js';
import fragments from './fragments.js';
import mutations from './mutations.js';
import resolvers from './resolvers.js';

const Movies = Telescope.createCollection({

  collectionName: 'movies',

  typeName: 'Movie',

  schema,
  
  fragments,

  resolvers,

  mutations,

});

export default Movies;
