const schema = {

  _id: {
    type: String,
    viewableBy: ['guests'],
  },

  /**
    The id of the document that was voted on
  */
  documentId: {
    type: String
  },

  /**
    The name of the collection the document belongs to
  */
  collectionName: {
    type: String
  },

  /**
    The id of the user that voted
  */
  userId: {
    type: String
  },

  /**
    An optional vote type (for Facebook-style reactions)
  */
  voteType: {
    type: String,
    optional: true
  },

  /**
    The vote power (e.g. 1 = upvote, -1 = downvote, or any other value)
  */
  power: {
    type: Number,
    optional: true
  },
  
  /**
    The vote timestamp
  */
  votedAt: {
    type: Date,
    optional: true
  }

};

export default schema;