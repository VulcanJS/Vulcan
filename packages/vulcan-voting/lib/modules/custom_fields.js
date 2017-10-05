import Users from 'meteor/vulcan:users';
import Votes from './votes/collection.js';

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
          const votes = Votes.find(selector).fetch();
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


