import Users from 'meteor/vulcan:users';

const schema = {

  _id: {
    type: String,
    viewableBy: ['guests'],
  },

  /**
    The id of the document that was voted on
  */
  documentId: {
    type: String,
    viewableBy: ['guests'],
  },

  /**
    The name of the collection the document belongs to
  */
  collectionName: {
    type: String,
    viewableBy: ['guests'],
  },

  /**
    The id of the user that voted
  */
  userId: {
    type: String,
    viewableBy: Users.owns,
  },

  /**
    An optional vote type (for Facebook-style reactions)
  */
  voteType: {
    type: String,
    optional: true,
    viewableBy: ['guests'],
  },

  /**
    The vote power (e.g. 1 = upvote, -1 = downvote, or any other value)
  */
  power: {
    type: Number,
    optional: true,
    viewableBy: Users.owns,
  },

  /**
    The vote timestamp
  */
  votedAt: {
    type: Date,
    optional: true,
    viewableBy: Users.owns,
  }

};

export default schema;
