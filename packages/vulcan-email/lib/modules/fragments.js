import { registerFragment } from 'meteor/vulcan:lib';

registerFragment(`
  fragment EmailFragment on EmailResponse {
    to
    from
    subject
    success
    error
  }
`);
