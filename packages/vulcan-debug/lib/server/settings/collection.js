import { extendCollection } from 'meteor/vulcan:lib';
import Settings from '../../modules/settings/collection';
import resolvers from './resolvers';

extendCollection(Settings, {
  
  resolvers,

  mutations: null,

});