import SimpleSchema from 'simpl-schema';

/**
 * @summary Kick off the namespace for Telescope.
 * @namespace Telescope
 */

const Telescope = {};

Telescope.VERSION = '1.1.0';

// ------------------------------------- Schemas -------------------------------- //

SimpleSchema.extendOptions([
  'private',
  'editable',  // editable: true means the field can be edited by the document's owner
  'hidden',     // hidden: true means the field is never shown in a form no matter what
  'required', // required: true means the field is required to have a complete profile
  'profile', // profile: true means the field is shown on user profiles
  'template', // legacy template used to display the field; backward compatibility (not used anymore)
  'form', // form placeholder
  'autoform', // legacy form placeholder; backward compatibility (not used anymore)
  'control', // SmartForm control (String or React component)
  'order', // position in the form
  'group' // form fieldset group
]);

export default Telescope;
