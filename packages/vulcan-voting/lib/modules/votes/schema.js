const schema = {

  _id: {
    type: String,
    canRead: ['guests'],
  },

  /**
    The id of the document that was voted on
  */
  documentId: {
    type: String,
    canRead: ['guests'],
  },

  /**
    The name of the collection the document belongs to
  */
  collectionName: {
    type: String,
    canRead: ['guests'],
  },

  /**
    The id of the user that voted
  */
  userId: {
    type: String,
    canRead: ['guests'],
  },

  /**
    An optional vote type (for Facebook-style reactions)
  */
  voteType: {
    type: String,
    optional: true,
    canRead: ['guests'],
  },

  /**
    The vote power (e.g. 1 = upvote, -1 = downvote, or any other value)
  */
  power: {
    type: Number,
    optional: true,
    canRead: ['guests'],
  },
  
  /**
    The vote timestamp
  */
  votedAt: {
    type: Date,
    optional: true,
    canRead: ['guests'],
  }

};

export default schema;