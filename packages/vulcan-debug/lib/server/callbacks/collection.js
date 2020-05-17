import { extendCollection } from 'meteor/vulcan:lib';
import Callbacks from '../../modules/callbacks/collection';
import resolvers from './resolvers';

extendCollection(Callbacks, {
  
  resolvers,

  mutations: null,

});