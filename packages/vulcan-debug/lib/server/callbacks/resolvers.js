import { CallbackHooks } from 'meteor/vulcan:lib';

const resolvers = {

  multi: {

    resolver(root, {terms = {}}, context, info) {
      return { results: CallbackHooks, totalCount: CallbackHooks.length };
    },

  },

};

export default resolvers;