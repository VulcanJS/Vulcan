// see https://github.com/apollographql/graphql-tools/blob/master/docs/source/schema-directives.md#marking-strings-for-internationalization

import { addGraphQLDirective, addGraphQLSchema } from '../modules/graphql';
import { SchemaDirectiveVisitor } from 'graphql-tools';
import { defaultFieldResolver } from 'graphql';
import { Collections } from '../modules/collections';
import { getSetting } from '../modules/settings';
import Vulcan from '../modules/config';
import { isIntlField, getLocaleString } from '../modules/intl';
import { Connectors } from './connectors';
import pickBy from 'lodash/pickBy';

const intlValueSchemas = 
`type IntlValue {
  locale: String
  value: String
}
input IntlValueInput{
  locale: String
  value: String
}`;
addGraphQLSchema(intlValueSchemas);

class IntlDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field, details) {
    const { resolve = defaultFieldResolver, name } = field; 
    field.resolve = async function (...args) {
      const [ doc, graphQLArguments, context ] = args;
      const fieldValue = await resolve.apply(this, args);
      const locale = graphQLArguments.locale || context.locale;
      const defaultLocale = getSetting('locale');
      const intlField = doc[`${name}_intl`];
      // Return string in requested or default language, or else field's original value
      return intlField && getLocaleString(intlField, locale, defaultLocale) || fieldValue;
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

      const intlFieldsWithLocale = intlFieldsNames.map(f => `${f}_intl`);

      // find all documents with one or more unmigrated intl fields
      const selector = { $or: intlFieldsWithLocale.map(f => ({[f]: { $exists: false }})) };
      const documentsToMigrate = await Connectors.find(collection, selector);

      if (documentsToMigrate.length) {

        console.log(`-> found ${documentsToMigrate.length} documents to migrate \n`); // eslint-disable-line no-console
        documentsToMigrate.forEach(doc => {

          console.log(`// Migrating document ${doc._id}`); // eslint-disable-line no-console
          const modifier = { $push: {}};

          intlFieldsNames.forEach(f => {
            if (doc[f] && !doc[`${f}_intl`]) {
              const translationObject = { locale: defaultLocale, string: doc[f] };
              console.log(`-> Adding field ${f}_intl: ${JSON.stringify(translationObject)} `); // eslint-disable-line no-console
              modifier.$push[`${f}_intl`] = translationObject;
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
