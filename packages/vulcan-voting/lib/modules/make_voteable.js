export const VoteableCollections = [];

export const makeVoteable = collection => {

  VoteableCollections.push(collection);

  collection.addField([
    /**
      How many upvotes the document has received
    */
    {
      fieldName: 'upvotes',
      fieldSchema: {
        type: Number,
        optional: true,
        defaultValue: 0,
        viewableBy: ['guests'],
      }
    },
    /**
      An array containing the `_id`s of the document's upvoters
    */
    {
      fieldName: 'upvoters',
      fieldSchema: {
        type: Array,
        optional: true,
        viewableBy: ['guests'],
        resolveAs: {
          fieldName: 'upvoters',
          type: '[User]',
          resolver: async (document, args, {currentUser, Users}) => {
            if (!document.upvoters) return [];
            const upvoters = await Users.loader.loadMany(document.upvoters);
            return Users.restrictViewableFields(currentUser, Users, upvoters);
          },
        },
      }
    },
    {
      fieldName: 'upvoters.$',
      fieldSchema: {
        type: String,
        optional: true
      }
    },
    /**
      How many downvotes the document has received
    */
    {
      fieldName: 'downvotes',
      fieldSchema: {
        type: Number,
        optional: true,
        defaultValue: 0,
        viewableBy: ['guests'],
      }
    },
    /**
      An array containing the `_id`s of the document's downvoters
    */
    {
      fieldName: 'downvoters',
      fieldSchema: {
        type: Array,
        optional: true,
        viewableBy: ['guests'],
        resolveAs: {
          fieldName: 'downvoters',
          type: '[User]',
          resolver: async (document, args, {currentUser, Users}) => {
            if (!document.downvoters) return [];
            const downvoters = await Users.loader.loadMany(document.downvoters);
            return Users.restrictViewableFields(currentUser, Users, downvoters);
          },
        },
      }
    },
    {
      fieldName: 'downvoters.$',
      fieldSchema: {
        type: String,
        optional: true,
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