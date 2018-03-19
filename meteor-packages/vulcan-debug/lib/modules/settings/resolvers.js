import { getAllSettings } from 'meteor/vulcan:lib';

const resolvers = {

  list: {

    name: 'SettingsList',

    resolver(root, {terms = {}}, context, info) {
      return getAllSettings();
    },

  },

  total: {
    
    name: 'SettingsTotal',
    
    resolver(root, {terms = {}}, context) {
      return getAllSettings().length;
    },
  
  }
};

export default resolvers;