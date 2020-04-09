import get from 'lodash/get';

export const makeCheckboxgroup = (field = {}) => {
  const hasOther = !!get(field, 'itemProperties.showOther');

  if (!field.options) {
    throw new Error(`Checkboxgroup fields need an 'options' property`);
  }

  // add additional field object properties
  const cbgField = {
    ...field,
    type: Array,
    input: 'checkboxgroup',
  };

  // if field doesn't allow "other" responses, limit it to whitelist of allowed values
  if (!hasOther) {
    cbgField.arrayItem = { ...cbgField.arrayItem, allowedValues: field.options.map(({ value }) => value) };
  }

  return cbgField;
};
