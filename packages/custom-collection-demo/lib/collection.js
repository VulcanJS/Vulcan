import Telescope from 'meteor/nova:lib';
import schema from './schema.js';
import fragments from './fragments.js';
import mutations from './mutations.js';
import resolvers from './resolvers.js';

const Movies = Telescope.createCollection({

  collectionName: 'movies',

  typeName: 'Movie',

  schema: schema,
  
  fragments: {
    list: {
      name: 'moviesListFragment',
      fragment: fragments.moviesListFragment
    },
    single: {
      name: 'moviesSingleFragment',
      fragment: fragments.moviesSingleFragment
    } 
  },

  resolvers: {
    list: {
      name: 'moviesList',
      resolver: resolvers.moviesList,
    },
    single: {
      name: 'moviesSingle',
      resolver: resolvers.moviesSingle,
    },
    total: {
      name: 'moviesTotal',
      resolver: resolvers.moviesTotal,
    }
  },

  mutations: {
    new: { // e.g. "moviesNew(document: moviesInput) : Movie"
      name: 'moviesNew',
      mutation: mutations.moviesNew,
    },
    edit: { // e.g. "moviesEdit(documentId: String, set: moviesInput, unset: moviesUnset) : Movie"
      name: 'moviesEdit',
      mutation: mutations.moviesEdit
    },
    remove: { // e.g. "moviesRemove(documentId: String) : Movie"
      name: 'moviesRemove',
      mutation: mutations.moviesRemove
    },
  },

});

export default Movies;