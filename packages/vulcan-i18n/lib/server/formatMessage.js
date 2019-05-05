import IntlMessageFormat from 'intl-messageformat';
import { getSetting, Strings } from 'meteor/vulcan:lib';


/**
 * Get a localized i18n string on the server side
 *
 * @param   {string} id       The i18n string id
 * @param   {Object} values   The values to pass to format the i18n string 
 * @param   {string} [locale] The locale to translate to - defaults to the 'locale' in settings
 * @returns {string}          The localized string
 */
export const formatMessage = function (id, values, locale) {
  id = typeof id === 'object' ? id.id : id;
  locale = locale || getSetting('locale', 'en');
  const messages = Strings[locale] || {};
  
  const formatter = new IntlMessageFormat(messages[id], locale);
  return formatter.format(values);
};
