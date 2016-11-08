import Telescope from 'meteor/nova:lib';

/**
 * @summary Vote schema
 * @type {SimpleSchema}
 */
Telescope.schemas.votes = new SimpleSchema({
  itemId: {
    type: String
  },
  power: {
    type: Number,
    optional: true
  },
  votedAt: {
    type: Date, 
    optional: true
  }
});

const voteSchema = `
  type Vote {
    itemId: String
    power: Float
    votedAt: String
  }
`;

Telescope.graphQL.addSchema(voteSchema);