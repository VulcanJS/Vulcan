// see https://github.com/apollographql/graphql-tools/blob/master/docs/source/schema-directives.md#marking-strings-for-internationalization

import { addGraphQLDirective, addGraphQLSchema } from '../modules/graphql';
import { SchemaDirectiveVisitor } from 'graphql-tools';
import { defaultFieldResolver } from 'graphql';

class IntlDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field, details) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function (...args) {
      const fieldValue = await resolve.apply(this, args);
      const context = args[2];
      const graphQLArguments = args[1];
      const locale = graphQLArguments.locale || context.locale;
      if (typeof fieldValue === 'object') {
        // intl'd field, return all locales or else current locale
        return locale === 'all' ? fieldValue : fieldValue[locale];
      } else {
        return fieldValue;
      }
    };
  }
}

addGraphQLDirective({ intl: IntlDirective });

addGraphQLSchema(`directive @intl on FIELD_DEFINITION`);