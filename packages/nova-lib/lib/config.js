import { SimpleSchema } from 'meteor/aldeed:simple-schema';

/**
 * @summary Kick off the global namespace for Telescope.
 * @namespace Telescope
 */

const Telescope = {};

Telescope.VERSION = '0.3.0-nova';

// ------------------------------------- Schemas -------------------------------- //

SimpleSchema.extendOptions({
  private: Match.Optional(Boolean),
  editable: Match.Optional(Boolean),  // editable: true means the field can be edited by the document's owner
  hidden: Match.Optional(Boolean),     // hidden: true means the field is never shown in a form no matter what
  required: Match.Optional(Boolean), // required: true means the field is required to have a complete profile
  profile: Match.Optional(Boolean), // profile: true means the field is shown on user profiles
  template: Match.Optional(String), // legacy template used to display the field; backward compatibility (not used anymore)
  form: Match.Optional(Object), // form placeholder
  autoform: Match.Optional(Object), // legacy form placeholder; backward compatibility (not used anymore)
  control: Match.Optional(Match.Any), // SmartForm control (String or React component)
  order: Match.Optional(Number), // position in the form
  group: Match.Optional(Object), // form fieldset group
  preload: Match.Optional(Boolean),
});

// ------------------------------------- Statuses -------------------------------- //

Telescope.statuses = [
  {
    value: 1,
    label: 'pending'
  },
  {
    value: 2,
    label: 'approved'
  },
  {
    value: 3,
    label: 'rejected'
  },
  {
    value: 4,
    label: 'spam'
  },
  {
    value: 5,
    label: 'deleted'
  }
];


export default Telescope;
