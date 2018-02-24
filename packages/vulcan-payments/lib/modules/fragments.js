import { registerFragment } from 'meteor/vulcan:core';

registerFragment(`
  fragment ChargeFragment on Charge {
    _id
    createdAt
    createdAtFormatted
    user{
      _id
      slug
      username
      displayName
      pageUrl
      emailHash
      avatarUrl
    }
    type
    source
    productKey
    test
    associatedCollection
    associatedId

    # doesn't work with unions, maybe try interface?
    # associatedDocument{
    #   _id
    #  pageUrl
    # }
    
    properties
    stripeChargeUrl
  }
`);