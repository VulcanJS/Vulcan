import { registerFragment } from 'meteor/vulcan:lib';

registerFragment(`
  fragment CallbacksFragment on Callback {
    name
    arguments
    runs
    returns
    description
    hooks
  }
`);
