import { CallbackHooks } from 'meteor/vulcan:lib';

const resolvers = {

  list: {

    name: 'CallbacksList',

    resolver(root, {terms = {}}, context, info) {
      return CallbackHooks;
    },

  },

  total: {
    
    name: 'CallbacksTotal',
    
    resolver(root, {terms = {}}, context) {
      return CallbackHooks.length;
    },
  
  }
};

export default resolvers;