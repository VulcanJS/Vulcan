import SimpleSchema from 'simpl-schema';

export const makeLikert = (field = {}) => {
  // get typeName from fieldName unless it's already specified in field object
  const { canRead, canCreate, canUpdate } = field;
  const fieldOptions = field.options;

  if (!fieldOptions) {
    throw new Error(`Likert fields need an 'options' property`);
  }

  // build SimpleSchema type object for validation
  const typeObject = {};
  fieldOptions.forEach(({ value }) => {
    typeObject[value] = {
      type: SimpleSchema.Integer,
      canRead,
      canCreate,
      canUpdate,
    };
  });

  // add additional field object properties
  const likertField = {
    ...field,
    type: new SimpleSchema(typeObject),
    input: 'likert',
  };

  return likertField;
};
