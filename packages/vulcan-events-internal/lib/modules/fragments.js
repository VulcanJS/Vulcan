import { registerFragment } from 'meteor/vulcan:core';

registerFragment(/* GraphQL */`
  fragment AnalyticsEventFragment on AnalyticsEvent {
    __typename
    name
    createdAt
  }  
`);