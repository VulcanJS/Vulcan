import SimpleSchema from 'simpl-schema';

/**
 * @summary Kick off the namespace for Vulcan.
 * @namespace Vulcan
 */

// eslint-disable-next-line no-undef
Vulcan = {};

// eslint-disable-next-line no-undef
Vulcan.VERSION = '1.8.11';

// ------------------------------------- Schemas -------------------------------- //

SimpleSchema.extendOptions([
  'hidden',     // hidden: true means the field is never shown in a form no matter what
  'mustComplete', // mustComplete: true means the field is required to have a complete profile
  'form', // extra form properties
  'control', // SmartForm control (String or React component)
  'order', // position in the form
  'group', // form fieldset group
  'onInsert', // field insert callback
  'onEdit', // field edit callback
  'onRemove', // field remove callback
  'viewableBy', // who can view the field
  'insertableBy', // who can insert the field
  'editableBy', // who can edit the field
  'resolveAs', // field-level resolver
  'searchable', // whether a field is searchable
  'description', // description/help
  'beforeComponent', // before form component
  'afterComponent', // after form component
  'placeholder', // form field placeholder value
  'options', // form options
  'query', // field-specific data loading query
]);

// eslint-disable-next-line no-undef
export default Vulcan;
