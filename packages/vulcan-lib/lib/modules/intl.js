import SimpleSchema from 'simpl-schema';

/*

Look for type name in a few different places
Note: look into simplifying this

*/
export const isIntlField = fieldSchema => {
  const typeProperty = fieldSchema.type;
  let type;
  if (Array.isArray(typeProperty)) {
    type = typeProperty[0].type;
  } else {
    type = typeProperty.singleType ? typeProperty.singleType : typeProperty.definitions[0].type;
  }
  return type.name === 'IntlString';
}

/*

Generate custom IntlString SimpleSchema type
TODO: WIP (languages hardcoded)

*/
const schema = {};

['en', 'ja'].forEach(locale => {
  schema[locale] = {
    type: String,
    optional: true,
  };
});

export const IntlString = new SimpleSchema(schema);
IntlString.name = 'IntlString';
