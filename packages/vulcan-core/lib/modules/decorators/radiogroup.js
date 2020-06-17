export const makeRadiogroup = (field = {}) => {
  if (!field.options) {
    throw new Error(`Radiogroup fields need an 'options' property`);
  }

  const rgField = {
    ...field,
    type: Array,
    input: 'radiogroup',
  };

  rgField.arrayItem = { ...rgField.arrayItem, allowedValues: field.options.map(({ value }) => value) };

  return rgField;
};
