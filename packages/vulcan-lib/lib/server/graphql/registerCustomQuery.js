import { createSchema } from '../../modules/schema_utils.js';
import { getSetting } from '../../modules/settings.js';
import { debug, debugGroup, debugGroupEnd } from '../../modules/debug.js';
import { addGraphQLQuery, addGraphQLResolvers, GraphQLSchema } from './graphql.js';
import { getSchemaFields } from './schemaFields';
import {
  multiInputType,
  multiOutputType,
  multiQueryType,
  mainTypeTemplate,
  multiInputTemplate,
  multiOutputTemplate,
  fieldFilterInputTemplate,
  fieldSortInputTemplate,
} from '../../modules/graphql_templates/index.js';


/**
 * Registers a custom Q
 * @param typeName
 * @param description
 * @param resolver
 * @param filterable
 * @param defaultCanRead
 * @param schema
 * @param graphQLType
 * @return {{totalCount, results}}
 */
export const registerCustomQuery = function ({ typeName,
                                                  description,
                                                  resolver,
                                                  filterable,
                                                  defaultCanRead,
                                                  schema,
                                                  graphQLType = null }) {
  if (!schema && !graphQLType) {
    throw new Error(`When registering ${typeName}, ` +
      `you must pass either schema or graphQLType to registerCustomQuery()`);
  }

  const aggregate = {

    name: typeName,

    description,

    async resolver(root, args, context, info) {
      const { input = {} } = args;
      const { enableCache = false } = input;
      const { cacheControl } = info;

      debug('');
      debugGroup(`------------- start \x1b[35m${typeName}\x1b[0m resolver -------------`);
      debug(`Input: ${JSON.stringify(input)}`);

      if (cacheControl && enableCache) {
        const maxAge = getSetting('graphQL.cacheMaxAge');
        cacheControl.setCacheHint({ maxAge });
      }

      const { results, totalCount } = await resolver(root, args, context, info);

      debug(`\x1b[33m=> ${results.length} of ${totalCount} documents returned\x1b[0m`);
      debugGroupEnd();
      debug(`------------- end \x1b[35m${typeName}\x1b[0m resolver -------------`);
      debug('');

      // return results
      return { results, totalCount };
    },

  };

  if (schema) {
    const simpleSchema = createSchema(schema, undefined, undefined, defaultCanRead);
    schema = simpleSchema._schema;
    const schemaFields = getSchemaFields(schema, typeName);
    graphQLType = graphQLType || mainTypeTemplate({
      typeName,
      fields: schemaFields.fields.readable,
      description,
    });
  }

  const graphQLSchemas = [];
  graphQLSchemas.push(graphQLType);
  graphQLSchemas.push(fieldFilterInputTemplate({ typeName, fields: filterable }));
  graphQLSchemas.push(fieldSortInputTemplate({ typeName, fields: filterable }));
  graphQLSchemas.push(multiInputTemplate({ typeName }));
  graphQLSchemas.push(multiOutputTemplate({ typeName }));

  const graphQLSchema = graphQLSchemas.join('\n');
  GraphQLSchema.addSchema(graphQLSchema);

  addGraphQLQuery(`${multiQueryType(typeName)}(input: ${multiInputType(typeName)}): ${multiOutputType(typeName)}`);
  addGraphQLResolvers({
    Query: {
      [multiQueryType(typeName)]: aggregate.resolver.bind(aggregate),
    },
  });

};
