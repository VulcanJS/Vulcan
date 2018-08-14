import SimpleSchema from 'simpl-schema';

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
  
  const schema = {
    locale: {
      type: String,
      optional: true,
    },
    value: {
      type: String,
      optional: true,
    }
  };

  const IntlString = new SimpleSchema(schema);
  IntlString.name = 'IntlString';
  return IntlString;
}

/*

Custom validation function to check for required locales

See https://github.com/aldeed/simple-schema-js#custom-field-validation

*/
export const validateIntlField = function () {
  let errors = [];

  // if field is required, go through locales to check which one are required
  if (!this.definition.optional) {
    const requiredLocales = Locales.filter(locale => locale.required);

    requiredLocales.forEach((locale, index) => {
      const strings = this.value;
      const hasString = strings.some(s => s.locale === locale.id && s.value);
      const originalFieldName = this.key.replace('_intl', '');
      if (!hasString) {
        errors.push({ id: 'errors.required', path: `${this.key}.${index}`, properties: { name: originalFieldName, locale: locale.id }});
      }
    });

  }
  // hack to work around the fact that custom validation function can only return a single string
  return `intlError|${JSON.stringify(errors)}`;
}