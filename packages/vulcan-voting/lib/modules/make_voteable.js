export const VoteableCollections = [];

export const makeVoteable = collection => {

  VoteableCollections.push(collection);

  collection.addField([
    /**
      The current user's votes on the document, if they exists
    */
    {
      fieldName: 'currentUserVotes',
      fieldSchema: {
        type: Array,
        optional: true,
        viewableBy: ['guests'],
        resolveAs: {
          type: '[Vote]',
          resolver: async (document, args, { Users, Votes, currentUser }) => {
            if (!currentUser) return [];
            const votes = Votes.find({userId: currentUser._id, documentId: document._id}).fetch();
            if (!votes.length) return [];
            return votes;
            // return Users.restrictViewableFields(currentUser, Votes, votes);
          },

        }
      }
    },
    {
      fieldName: 'currentUserVotes.$',
      fieldSchema: {
        type: Object,
        optional: true,
      }
    },
    /**
      All votes on the document
    */
    {
      fieldName: 'allVotes',
      fieldSchema: {
        type: Array,
        optional: true,
        viewableBy: ['guests'],
        resolveAs: {
          type: 'Vote',
          resolver: async (document, args, { Users, Votes, currentUser }) => {
            const votes = Votes.find({itemId: document._id}).fetch();
            if (!votes.length) return null;
            return votes;
            // return Users.restrictViewableFields(currentUser, Votes, votes);
          },

        }
      }
    },
    {
      fieldName: 'allVotes.$',
      fieldSchema: {
        type: Object,
        optional: true,
      }
    },
    /**
      An array containing the `_id`s of the document's upvoters
    */
    {
      fieldName: 'voters',
      fieldSchema: {
        type: Array,
        optional: true,
        viewableBy: ['guests'],
        resolveAs: {
          type: '[User]',
          resolver: async (document, args, {currentUser, Users}) => {
            const votes = Votes.find({itemId: document._id}).fetch();
            const votersIds = _.pluck(votes, 'userId');
            const voters = Users.find({_id: {$in: votersIds}});
            return voters;
            // if (!document.upvoters) return [];
            // const upvoters = await Users.loader.loadMany(document.upvoters);
            // return Users.restrictViewableFields(currentUser, Users, upvoters);
          },
        },
      }
    },
    {
      fieldName: 'voters.$',
      fieldSchema: {
        type: String,
        optional: true
      }
    },
    /**
      The document's base score (not factoring in the document's age)
    */
    {
      fieldName: 'baseScore',
      fieldSchema: {
        type: Number,
        optional: true,
        defaultValue: 0,
        viewableBy: ['guests'],
      }
    },
    /**
      The document's current score (factoring in age)
    */
    {
      fieldName: 'score',
      fieldSchema: {
        type: Number,
        optional: true,
        defaultValue: 0,
        viewableBy: ['guests'],
      }
    },
    /**
      Whether the document is inactive. Inactive documents see their score recalculated less often
    */
    { 
      fieldName: 'inactive',
      fieldSchema: {
        type: Boolean,
        optional: true,
        onInsert: () => false
      }
    },

  ]);
}