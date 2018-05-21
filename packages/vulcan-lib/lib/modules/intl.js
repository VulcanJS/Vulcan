import SimpleSchema from 'simpl-schema';
import { Strings } from './strings';

export const Locales = [];

export const registerLocale = locale => {
  Locales.push(locale);
}

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

*/
export const getIntlString = () => {
  
  const schema = {};

  Object.keys(Strings).forEach(locale => {
    schema[locale] = {
      type: String,
      optional: true,
    };
  });

  const IntlString = new SimpleSchema(schema);
  IntlString.name = 'IntlString';
  return IntlString;
}
