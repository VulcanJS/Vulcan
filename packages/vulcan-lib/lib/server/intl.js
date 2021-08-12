// see https://github.com/apollographql/graphql-tools/blob/master/docs/source/schema-directives.md#marking-strings-for-internationalization

import { addGraphQLDirectiveTransformer, addGraphQLSchema } from './graphql/index.js';
import { mapSchema, MapperKind } from '@graphql-tools/utils';

import { defaultFieldResolver } from 'graphql';
import { Collections } from '../modules/collections';
import { getSetting } from '../modules/settings';
import { debug } from '../modules/debug';
import Vulcan from '../modules/config';
import { isIntlField } from '../modules/intl';
import { Connectors } from './connectors';
import pickBy from 'lodash/pickBy';

/*

Create GraphQL types

*/
const intlValueSchemas = `type IntlValue {
  locale: String
  value: String
}
input IntlValueInput{
  locale: String
  value: String
}`;
addGraphQLSchema(intlValueSchemas);

/*

Take an array of translations, a locale, and a default locale, and return a matching string

*/
const getLocaleString = (translations, locale, defaultLocale) => {
  const localeObject = translations.find(translation => translation.locale === locale);
  const defaultLocaleObject = translations.find(translation => translation.locale === defaultLocale);
  return (localeObject && localeObject.value) || (defaultLocaleObject && defaultLocaleObject.value);
};

/*

GraphQL @intl directive resolver

*/

const intlDirectiveTransformer = schema =>
  mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: fieldConfig => {
      const { resolve = defaultFieldResolver } = fieldConfig;
      const name = fieldConfig?.astNode?.name?.value;
      fieldConfig.resolve = async function(source = {}, args = {}, context, info) {
        const doc = source;
        const fieldValue = await resolve(source, args, context, info);
        const locale = args.locale || context.locale;
        const defaultLocale = getSetting('locale');
        const intlField = doc[`${name}_intl`];
        // Return string in requested or default language, or else field's original value
        return (intlField && getLocaleString(intlField, locale, defaultLocale)) || fieldValue;
      };
    },
  });

addGraphQLDirectiveTransformer(intlDirectiveTransformer);

addGraphQLSchema('directive @intl on FIELD_DEFINITION');

/*

Migration function

*/
const migrateIntlFields = async defaultLocale => {
  if (!defaultLocale) {
    throw new Error("Please pass the id of the locale to which to migrate your current content (e.g. migrateIntlFields('en'))");
  }

  Collections.forEach(async collection => {
    const schema = collection.simpleSchema()._schema;
    const intlFields = pickBy(schema, isIntlField);
    const intlFieldsNames = Object.keys(intlFields);

    if (intlFieldsNames.length) {
      // eslint-disable-next-line no-console
      console.log(
        `### Found ${intlFieldsNames.length} field to migrate for collection ${collection.options.collectionName}: ${intlFieldsNames.join(
          ', '
        )} ###\n`
      );

      // const intlFieldsWithLocale = intlFieldsNames.map(f => `${f}_intl`);

      // find all documents with one or more unmigrated intl fields
      const selector = {
        $or: intlFieldsNames.map(f => {
          return {
            $and: [{ [`${f}`]: { $exists: true } }, { [`${f}_intl`]: { $exists: false } }],
          };
        }),
      };
      const documentsToMigrate = await Connectors.find(collection, selector);

      if (documentsToMigrate.length) {
        console.log(`-> found ${documentsToMigrate.length} documents to migrate \n`); // eslint-disable-line no-console
        for (const doc of documentsToMigrate) {
          console.log(`// Migrating document ${doc._id}`); // eslint-disable-line no-console
          const modifier = { $push: {} };

          intlFieldsNames.forEach(f => {
            if (doc[f] && !doc[`${f}_intl`]) {
              const translationObject = { locale: defaultLocale, value: doc[f] };
              console.log(`-> Adding field ${f}_intl: ${JSON.stringify(translationObject)} `); // eslint-disable-line no-console
              modifier.$push[`${f}_intl`] = translationObject;
            }
          });

          if (!_.isEmpty(modifier.$push)) {
            // update document
            // eslint-disable-next-line no-await-in-loop
            const n = await Connectors.update(collection, { _id: doc._id }, modifier);
            console.log(`-> migrated ${n} documents \n`); // eslint-disable-line no-console
          }
          console.log('\n'); // eslint-disable-line no-console
        }
      } else {
        console.log('-> found no documents to migrate.'); // eslint-disable-line no-console
      }
    }
  });
};

Vulcan.migrateIntlFields = migrateIntlFields;

/*

Take a header object, and figure out the locale

Also accepts userLocale to indicate the current user's preferred locale

*/
export const getHeaderLocale = (headers, userLocale) => {
  let cookieLocale, acceptedLocale, locale, localeMethod;

  // get locale from cookies
  if (headers?.['cookie']) {
    const cookies = {};
    headers['cookie'].split('; ').forEach(c => {
      const cookieArray = c.split('=');
      cookies[cookieArray[0]] = cookieArray[1];
    });
    cookieLocale = cookies.locale;
  }

  // get locale from accepted-language header
  if (headers?.['accept-language']) {
    const acceptedLanguages = headers['accept-language'].split(',').map(l => l.split(';')[0]);
    acceptedLocale = acceptedLanguages[0]; // for now only use the highest-priority accepted language
  }

  if (headers?.locale) {
    locale = headers.locale;
    localeMethod = 'header';
  } else if (cookieLocale) {
    locale = cookieLocale;
    localeMethod = 'cookie';
  } else if (userLocale) {
    locale = userLocale;
    localeMethod = 'user';
  } else if (acceptedLocale) {
    locale = acceptedLocale;
    localeMethod = 'browser';
  } else {
    locale = getSetting('locale', 'en-US');
    localeMethod = 'setting';
  }

  debug(`// locale: ${locale} (via ${localeMethod})`);

  return locale;
};
