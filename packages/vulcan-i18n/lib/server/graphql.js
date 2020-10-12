import { addGraphQLQuery, addGraphQLResolvers, addGraphQLSchema, Locales, getLocale, getStrings } from 'meteor/vulcan:lib';

// const localEnum = `enum LocaleID {
//   ${Locales.map(locale => locale.id).join('/n')}
// }`;

// console.log(Locales)
// console.log(localEnum)
// addGraphQLSchema(localEnum);

const localeType = `type Locale {
  id: String,
  label: String
  dynamic: Boolean
  strings: JSON
}`;

addGraphQLSchema(localeType);

const locale = async (root, { localeId }, context) => {
  const locale = getLocale(localeId);
  const strings = getStrings(localeId);
  const localeObject = { ...locale, strings };
  return localeObject;
};

addGraphQLQuery('locale(localeId: String): Locale');
addGraphQLResolvers({ Query: { locale } });
