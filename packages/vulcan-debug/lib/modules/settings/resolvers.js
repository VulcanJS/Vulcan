import { getAllSettings } from 'meteor/vulcan:lib';

const resolvers = {

  multi: {

    resolver(root, {terms = {}}, context, info) {
      const settings = getAllSettings();
      return { results: settings, totalCount: settings.length };
    },

  },

};

export default resolvers;