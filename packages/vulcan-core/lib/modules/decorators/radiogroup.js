import get from 'lodash/get';

export const makeRadiogroup = (field = {}) => {
  const hasOther = !!get(field, 'itemProperties.showOther');

  if (!field.options) {
    throw new Error(`Radiogroup fields need an 'options' property`);
  }

  const rgField = {
    ...field,
    type: Array,
    input: 'radiogroup',
  };

  // if field doesn't allow "other" responses, limit it to whitelist of allowed values
  if (!hasOther) {
    rgField.arrayItem = {...rgField.arrayItem, allowedValues: field.options.map(({value}) => value)};
  }

  return rgField;
};
