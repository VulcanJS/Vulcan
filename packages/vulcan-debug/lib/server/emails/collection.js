import { extendCollection } from 'meteor/vulcan:lib';
import Emails from '../../modules/emails/collection';
import resolvers from './resolvers';

extendCollection(Emails, {
  
  resolvers,

  mutations: null,

});
