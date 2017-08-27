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
    firstPageLink
    gridImageId
    books {
      ...BookPageFragment
    }
  }
`);
