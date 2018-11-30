import SimpleSchema from 'simpl-schema';

export const Strings = {};

export const Domains = {};

export const addStrings = (language, strings) => {
  if (typeof Strings[language] === 'undefined') {
    Strings[language] = {};
  }
  Strings[language] = {
    ...Strings[language],
    ...strings
  };
};

export const getString = ({id, values, defaultMessage, locale}) => {
  const messages = Strings[locale] || {};
  let message = messages[id] || defaultMessage;
  if (message && values) {
    Object.keys(values).forEach(key => {
      // note: see replaceAll definition in vulcan:lib/utils
      message = message.replaceAll(`{${key}}`, values[key]);
    });
  }
  return message;
}

export const registerDomain = (locale, domain) => {
  Domains[domain] = locale;
}

export const Locales = [];

export const registerLocale = locale => {
  Locales.push(locale);
};

/*

Look for type name in a few different places
Note: look into simplifying this

*/
export const isIntlField = fieldSchema => {
  return fieldSchema.intl;
};

/*

Generate custom IntlString SimpleSchema type

*/
export const getIntlString = () => {
  const schema = {
    locale: {
      type: String,
      optional: true
    },
    value: {
      type: String,
      optional: true
    }
  };

  const IntlString = new SimpleSchema(schema);
  IntlString.name = 'IntlString';
  return IntlString;
};

/*

Custom validation function to check for required locales

See https://github.com/aldeed/simple-schema-js#custom-field-validation

*/
export const validateIntlField = function() {
  let errors = [];

  // go through locales to check which one are required
  const requiredLocales = Locales.filter(locale => locale.required);

  requiredLocales.forEach((locale, index) => {
    const strings = this.value;
    const hasString = strings && Array.isArray(strings) && strings.some(s => s && s.locale === locale.id && s.value);
    if (!hasString) {
      const originalFieldName = this.key.replace('_intl', '');
      errors.push({
        id: 'errors.required',
        path: `${this.key}.${index}`,
        properties: { name: originalFieldName, locale: locale.id }
      });
    }
  });

  if (errors.length > 0) {
    // hack to work around the fact that custom validation function can only return a single string
    return `intlError|${JSON.stringify(errors)}`;
  }
};
