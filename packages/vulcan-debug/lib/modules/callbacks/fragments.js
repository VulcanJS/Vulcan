import { registerFragment } from 'meteor/vulcan:lib';

registerFragment(`
  fragment CallbacksFragment on Callback {
    name
    iterator
    properties
    runs
    returns
    description
    hooks
  }
`);
