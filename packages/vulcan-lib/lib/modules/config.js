import SimpleSchema from 'simpl-schema';

/**
 * @summary Kick off the namespace for Vulcan.
 * @namespace Vulcan
 */

// eslint-disable-next-line no-undef
Vulcan = {};

// eslint-disable-next-line no-undef
Vulcan.VERSION = '1.12.10';

// ------------------------------------- Schemas -------------------------------- //

SimpleSchema.extendOptions([
  'hidden',     // hidden: true means the field is never shown in a form no matter what
  'mustComplete', // mustComplete: true means the field is required to have a complete profile
  'form', // extra form properties
  'inputProperties', // extra form properties
  'input', // SmartForm control (String or React component)
  'control', // SmartForm control (String or React component) (legacy)
  'order', // position in the form
  'group', // form fieldset group
  
  'onCreate', // field insert callback
  'onInsert', // field insert callback (OpenCRUD backwards compatibility)

  'onUpdate', // field edit callback
  'onEdit', // field edit callback (OpenCRUD backwards compatibility)

  'onDelete', // field remove callback
  'onRemove', // field remove callback (OpenCRUD backwards compatibility)

  'canRead', // who can view the field
  'viewableBy', // who can view the field (OpenCRUD backwards compatibility)

  'canCreate', // who can insert the field
  'insertableBy', // who can insert the field (OpenCRUD backwards compatibility)

  'canUpdate', // who can edit the field
  'editableBy', // who can edit the field (OpenCRUD backwards compatibility)

  'resolveAs', // field-level resolver
  'searchable', // whether a field is searchable
  'description', // description/help
  'beforeComponent', // before form component
  'afterComponent', // after form component
  'placeholder', // form field placeholder value
  'options', // form options
  'query', // field-specific data loading query
  'selectable', // field can be used as part of a selector when querying for data
  'unique', // field can be used as part of a selectorUnique when querying for data
  'orderable', // field can be used to order results when querying for data

  'intl', // set to `true` to make a field international
  'isIntlData', // marker for the actual schema fields that hold intl strings
]);

// eslint-disable-next-line no-undef
export default Vulcan;
