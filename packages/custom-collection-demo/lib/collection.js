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
    list: fragments.list,
    single: fragments.single,
  },

  resolvers: {
    list: resolvers.list,
    single: resolvers.single,
    total: resolvers.total,
  },

  mutations: {
    new: mutations.new,
    edit: mutations.edit,
    remove: mutations.remove,
  },

});

export default Movies;