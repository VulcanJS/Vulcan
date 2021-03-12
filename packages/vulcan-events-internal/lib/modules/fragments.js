import { registerFragment } from 'meteor/vulcan:core';

registerFragment(/* GraphQL */`
  fragment AnalyticsEventFragment on AnalyticsEvent {
    __typename
    name
    createdAt
    userId
    description
    unique
    important
    properties
    user {
      _id
      displayName
      pagePath
      pageUrl
    }
  }  
`);