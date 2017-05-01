import SimpleSchema from 'simpl-schema';

/**
 * @summary Kick off the namespace for Vulcan.
 * @namespace Vulcan
 */

Vulcan = {};

Vulcan.VERSION = '1.3.2';

// ------------------------------------- Schemas -------------------------------- //

SimpleSchema.extendOptions([
  'private',
  'editable',  // editable: true means the field can be edited by the document's owner
  'hidden',     // hidden: true means the field is never shown in a form no matter what
  'mustComplete', // mustComplete: true means the field is required to have a complete profile
  'profile', // profile: true means the field is shown on user profiles
  'template', // legacy template used to display the field; backward compatibility (not used anymore)
  'form', // form placeholder
  'autoform', // legacy form placeholder; backward compatibility (not used anymore)
  'control', // SmartForm control (String or React component)
  'order', // position in the form
  'group', // form fieldset group
  'onInsert', // field insert callback
  'onEdit', // field edit callback
  'onRemove', // field remove callback
]);

export default Vulcan;
