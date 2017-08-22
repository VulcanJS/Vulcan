import { registerFragment } from 'meteor/vulcan:core';

registerFragment(`
  fragment BookPageFragment on Book {
    _id
    createdAt
    title
    subtitle
    description
    sequenceIds
    sequences {
      ...SequencesPageFragment
    }
  }
`);
