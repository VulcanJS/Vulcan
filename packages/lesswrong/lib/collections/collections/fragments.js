import { registerFragment } from 'meteor/vulcan:core';

registerFragment(`
  fragment CollectionsPageFragment on Collection {
    _id
    createdAt
    user {
      ...UsersMinimumInfo
    }
    title
    description
    imageUrl
    bookIds
    books {
      ...BookPageFragment
    }
  }
`);
