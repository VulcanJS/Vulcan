import SimpleSchema from 'simpl-schema';
import { getSetting } from '../modules/settings';
import { debug, Utils } from 'meteor/vulcan:lib';

export const defaultLocale = getSetting('locale', 'en');

export const Strings = {};

export const Domains = {};

export const addStrings = (language, strings) => {
  if (typeof Strings[language] === 'undefined') {
    Strings[language] = {};
  }
  Strings[language] = {
    ...Strings[language],
    ...strings,
  };
};

export const getString = ({ id, values, defaultMessage, locale }) => {
  let message = '';

  if (Strings[locale] && Strings[locale][id]) {
    message = Strings[locale][id];
  } else if (Strings[defaultLocale] && Strings[defaultLocale][id]) {
    debug(`\x1b[32m>> INTL: No string found for id "${id}" in locale "${locale}", using defaultLocale "${defaultLocale}".\x1b[0m`);
    message = Strings[defaultLocale] && Strings[defaultLocale][id];
  } else if (defaultMessage) {
    debug(`\x1b[32m>> INTL: No string found for id "${id}" in locale "${locale}", using default message "${defaultMessage}".\x1b[0m`);
    message = defaultMessage;
  }

  if (values) {
    Object.keys(values).forEach(key => {
      // note: see replaceAll definition in vulcan:lib/utils
      message = message.replaceAll(`{${key}}`, values[key]);
    });
  }
  return message;
};

export const registerDomain = (locale, domain) => {
  Domains[domain] = locale;
};

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

Check if a schema has at least one intl field

*/
export const schemaHasIntlFields = schema => Object.keys(schema).some(fieldName => isIntlField(schema[fieldName]));

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

/**
 * formatLabel - Get a label for a field, for a given collection, in the current language. The evaluation is as follows : i18n(collectionName.fieldName) > i18n(global.fieldName) > i18n(fieldName) > schema.fieldName.label > fieldName
 *
 * @param  {object} params
 * @param  {object} params.intl               An intlShape object obtained from the react context for example
 * @param  {string} params.fieldName          The name of the field to evaluate (required)
 * @param  {string} params.collectionName     The name of the collection the field belongs to
 * @param  {object} params.schema             The schema of the collection
 * @param  {object} values                    The values to pass to format the i18n string
 * @return {string}                           The translated label
 */

export const formatLabel = ({ intl, fieldName, collectionName, schema }, values) => {
  if (!fieldName) {
    throw new Error('fieldName option passed to formatLabel cannot be empty or undefined');
  }
  const defaultMessage = '|*|*|';
  // Get the intl label
  let intlLabel = defaultMessage;
  // try collectionName.fieldName as intl id
  if (collectionName) {
    intlLabel = intl.formatMessage(
      { id: `${collectionName.toLowerCase()}.${fieldName}`, defaultMessage },
      values
    );
  }
  // try global.fieldName then just fieldName as intl id
  if (intlLabel === defaultMessage) {
    intlLabel = intl.formatMessage({ id: `global.${fieldName}`, defaultMessage }, values);
    if (intlLabel === defaultMessage) {
      intlLabel = intl.formatMessage({ id: fieldName }, values);
    }
  }
  if (intlLabel) {
    return intlLabel;
  }
  
  // define the schemaLabel. If the schema has been initialized with SimpleSchema, the label should be here even if it has not been declared https://github.com/aldeed/simple-schema-js#label
  let schemaLabel = schema && schema[fieldName] ? schema[fieldName].label : null;
  return schemaLabel || Utils.camelToSpaces(fieldName);
};

