import { Connectors, getSetting } from 'meteor/vulcan:core'; // import from vulcan:lib because vulcan:core isn't loaded yet
import Users from 'meteor/vulcan:users';
import Votes from './votes/collection.js';

const database = getSetting('database', 'mongo');

Users.addField([
  /**
    An array containing votes
  */
  {
    fieldName: 'votes',
    fieldSchema: {
      type: Array,
      optional: true,
      viewableBy: Users.owns,
      resolveAs: {
        type: '[Vote]',
        arguments: 'collectionName: String',
        resolver: async (user, args, context) => {
          const selector = {userId: user._id};
          if (args.collectionName) {
            selector.collectionName = args.collectionName;
          }
          const votes = await Connectors[database].find(Votes, selector);
          return votes;
        }
      },
    }
  },
  {
    fieldName: 'votes.$',
    fieldSchema: {
      type: Object,
      optional: true
    }
  },
]);


