// see https://github.com/apollographql/graphql-tools/blob/master/docs/source/schema-directives.md#marking-strings-for-internationalization

import { addGraphQLDirective, addGraphQLSchema } from '../modules/graphql';
import { SchemaDirectiveVisitor } from 'graphql-tools';
import { defaultFieldResolver } from 'graphql';
import { Collections } from '../modules/collections';
import { getSetting } from '../modules/settings';
import Vulcan from '../modules/config';
import { isIntlField } from '../modules/intl';
import { Connectors } from './connectors';
import pickBy from 'lodash/pickBy';

class IntlDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field, details) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function (...args) {
      const fieldValue = await resolve.apply(this, args);
      const context = args[2];
      const graphQLArguments = args[1];
      const locale = graphQLArguments.locale || context.locale;
      const defaultLocale = getSetting('locale');
      if (typeof fieldValue === 'object') {
        // intl'd field, return current locale or default locale
        return fieldValue[locale] ? fieldValue[locale] : fieldValue[defaultLocale];
      } else {
        // not an object, return field itself
        return fieldValue;
      }
    };
  }
}

addGraphQLDirective({ intl: IntlDirective });

addGraphQLSchema(`directive @intl on FIELD_DEFINITION`);

const migrateIntlFields = async (defaultLocale) => {

  if (!defaultLocale) {
    throw new Error(`Please pass the id of the locale to which to migrate your current content (e.g. migrateIntlFields('en'))`);
  }
  
  Collections.forEach(async collection => {

    const schema = collection.simpleSchema()._schema;
    const intlFields = pickBy(schema, isIntlField);
    const intlFieldsNames = Object.keys(intlFields);
    if (intlFieldsNames.length) {
      console.log(`### Found ${intlFieldsNames.length} field to migrate for collection ${collection.options.collectionName}: ${intlFieldsNames.join(', ')} ###\n`); // eslint-disable-line no-console

      const intlFieldsWithLocale = intlFieldsNames.map(f => `${f}.${defaultLocale}`);

      // find all documents with one or more unmigrated intl fields
      const selector = { $or: intlFieldsWithLocale.map(f => ({[f]: { $exists: false }})) };
      const documentsToMigrate = await Connectors.find(collection, selector);

      if (documentsToMigrate.length) {

        console.log(`-> found ${documentsToMigrate.length} documents to migrate \n`); // eslint-disable-line no-console
        documentsToMigrate.forEach(doc => {

          console.log(`// Migrating document ${doc._id}`); // eslint-disable-line no-console
          const modifier = { $set: {}};

          intlFieldsNames.forEach(f => {
            if (doc[f] && !doc[f][defaultLocale]) {
              console.log(`-> migrating field ${f}: ${doc[f]}`); // eslint-disable-line no-console
              modifier.$set[f] = { [defaultLocale]: doc[f]}
            }
          });

          // update document
          Connectors.update(collection, {_id: doc._id}, modifier);
          console.log('\n'); // eslint-disable-line no-console

        });
      }

    }
  });
}

Vulcan.migrateIntlFields = migrateIntlFields;