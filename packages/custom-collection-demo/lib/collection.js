import Telescope from 'meteor/nova:lib';
import schema from './schema.js';
import mutations from './mutations.js';
import resolvers from './resolvers.js';

const Movies = Telescope.createCollection({

  collectionName: 'movies',

  typeName: 'Movie',

  // a SimpleSchema-compatible JSON schema
  schema,
  
  /*
  Three resolvers are expected:
    - list (e.g.: moviesList(terms: JSON, offset: Int, limit: Int) )
    - single (e.g.: moviesSingle(_id: String) )
    - listTotal (e.g.: moviesTotal )
  */
  resolvers,

  /*
  Three mutations are expected:
    - new (e.g.: moviesNew(document: moviesInput) : Movie )
    - edit (e.g.: moviesEdit(documentId: String, set: moviesInput, unset: moviesUnset) : Movie )
    - remove (e.g.: moviesRemove(documentId: String) : Movie )
  */
  mutations,

});

export default Movies;
