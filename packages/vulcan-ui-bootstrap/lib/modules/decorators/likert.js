import { addGraphQLSchema } from 'meteor/vulcan:core';
import SimpleSchema from 'simpl-schema';

export const makeLikert = (field = {}, options = {}) => {
  // get typeName from fieldName unless it's already specified in field object
  const { fieldName } = options;
  const { typeName = `${fieldName}Type` } = field;
  const fieldOptions = field.options;
  if (!fieldOptions) {
    throw new Error(`Likert fields need an 'options' property`);
  }

  // build SimpleSchema type object for validation
  const typeObject = {};
  fieldOptions.forEach(({ value }) => {
    typeObject[value] = {
      type: SimpleSchema.Integer,
    };
  });

  // create GraphQL types for main type, create input type, and update input type
  addGraphQLSchema(`type ${typeName} {
  ${fieldOptions.map(({ value }) => `${value}: Int`).join('\n  ')}
}

input Create${typeName}DataInput {
  ${fieldOptions.map(({ value }) => `${value}: Int`).join('\n  ')}
}

input Update${typeName}DataInput {
  ${fieldOptions.map(({ value }) => `${value}: Int`).join('\n  ')}
}
  `);

  // add additional field object properties
  const likertField = {
    ...field,
    type: new SimpleSchema(typeObject),
    input: 'likert',
    typeName,
  };

  return likertField;
};
