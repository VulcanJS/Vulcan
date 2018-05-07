// see https://github.com/apollographql/graphql-tools/blob/master/docs/source/schema-directives.md#marking-strings-for-internationalization

import { addGraphQLDirective, addGraphQLSchema, addGraphQLResolvers, addCallback } from 'meteor/vulcan:lib';
import { SchemaDirectiveVisitor } from 'graphql-tools';
import { defaultFieldResolver } from 'graphql';
import { GraphQLScalarType } from 'graphql';

class IntlDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field, details) {
    console.log('// visitFieldDefinition')
    console.log(field)
    console.log(details)
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function (...args) {
      const fieldValue = await resolve.apply(this, args);
      const context = args[2];
      const graphQLArguments = args[1];
      console.log('// field.resolve')
      console.log(fieldValue)
      console.log(graphQLArguments)
      const locale = graphQLArguments.locale || context.locale;
      console.log(locale)
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

// note: doesn't work because of https://github.com/facebook/graphql/issues/215
 
// function CreateVoteableUnionType() {
//   addGraphQLSchema(`union IntlString = String | JSON`);
//   return {}
// }
// addCallback('graphql.init.before', CreateVoteableUnionType);

// const resolverMap = {
//   IntlString: {
//     __resolveType(obj, context, info){
//       return obj.__typename;
//     },
//   },
// };

// addGraphQLResolvers(resolverMap);

function CreateIntlStringScalar() {
  addGraphQLSchema(`scalar IntlString`);
  return {}
}
addCallback('graphql.init.before', CreateIntlStringScalar);

const IntlStringType = new GraphQLScalarType({
  name: 'IntlString',
  description: 'Return a string or an intl object containing multiple locals',
  serialize(value) {
    return value;
  },
  parseValue(value) {
    return value;
  },
  parseLiteral(ast) {
    return ast.value;
  }
});

addGraphQLResolvers({ IntlString: IntlStringType });