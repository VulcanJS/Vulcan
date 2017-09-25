/*

Utilities to generate the app's GraphQL schema

*/

import deepmerge from 'deepmerge';
import GraphQLJSON from 'graphql-type-json';
import GraphQLDate from 'graphql-date';
import Vulcan from './config.js'; // used for global export
import { Utils } from './utils.js';
import { disableFragmentWarnings } from 'graphql-tag';

disableFragmentWarnings();

// get GraphQL type for a given schema and field name
const getGraphQLType = (schema, fieldName) => {

  const field = schema[fieldName];
  const type = field.type.singleType;
  const typeName = typeof type === 'function' ? type.name : type;

  switch (typeName) {

    case 'String':
      return 'String';

    case 'Boolean':
      return 'Boolean';

    case 'Number':
      return 'Float';

    case 'SimpleSchema.Integer':
      return 'Int';

    // for arrays, look for type of associated schema field or default to [String]
    case 'Array':
      const arrayItemFieldName = `${fieldName}.$`;
      // note: make sure field has an associated array
      if (schema[arrayItemFieldName]) {
        // try to get array type from associated array
        const arrayItemType = getGraphQLType(schema, arrayItemFieldName);
        return arrayItemType ? `[${arrayItemType}]` : null;
      }
      return null;

    case 'Object':
      return 'JSON';

    case 'Date':
      return 'Date';

    default:
      return null;
  }
}

export const GraphQLSchema = {

  // collections used to auto-generate schemas
  collections: [],
  addCollection(collection) {
    this.collections.push(collection);
  },
  // generate GraphQL schemas for all registered collections
  getCollectionsSchemas() {
    const collectionsSchemas = this.collections.map(collection => {
      return this.generateSchema(collection);
    }).join('\n');
    return collectionsSchemas;
  },

  // additional schemas
  schemas: [],
  addSchema(schema) {
    this.schemas.push(schema);
  },
  // get extra schemas defined manually
  getAdditionalSchemas() {
    const additionalSchemas = this.schemas.join('\n');
    return additionalSchemas;
  },

  // queries
  queries: [],
  addQuery(query) {
    this.queries.push(query);
  },

  // mutations
  mutations: [],
  addMutation(mutation) {
    this.mutations.push(mutation);
  },

  // add resolvers
  resolvers: {
    JSON: GraphQLJSON,
    Date: GraphQLDate,
  },
  addResolvers(resolvers) {
    this.resolvers = deepmerge(this.resolvers, resolvers);
  },
  removeResolver(typeName, resolverName) {
    delete this.resolvers[typeName][resolverName];
  },

  // add objects to context
  context: {},
  addToContext(object) {
    this.context = deepmerge(this.context, object);
  },

  // generate a GraphQL schema corresponding to a given collection
  generateSchema(collection) {

    const collectionName = collection.options.collectionName;

    const mainTypeName = collection.typeName ? collection.typeName : Utils.camelToSpaces(_.initial(collectionName).join('')); // default to posts -> Post

    // backward-compatibility code: we do not want user.telescope fields in the graphql schema
    const schema = Utils.stripTelescopeNamespace(collection.simpleSchema()._schema);

    let mainSchema = [], inputSchema = [], unsetSchema = [];

    _.forEach(schema, (field, fieldName) => {
      // console.log(field, fieldName)

      const fieldType = getGraphQLType(schema, fieldName);

      if (fieldName.indexOf('$') === -1) { // skip fields containing "$" in their name

        // if field has a resolveAs, push it to schema
        if (field.resolveAs) {

          if (typeof field.resolveAs === 'string') {
            // if resolveAs is a string, push it and done
            mainSchema.push(field.resolveAs);
          } else {

            // get resolver name from resolveAs object, or else default to field name
            const resolverName = field.resolveAs.fieldName || fieldName;

            // if resolveAs is an object, first push its type definition
            // include arguments if there are any
            mainSchema.push(`${resolverName}${field.resolveAs.arguments ? `(${field.resolveAs.arguments})` : ''}: ${field.resolveAs.type}`);

            // then build actual resolver object and pass it to addGraphQLResolvers
            const resolver = {
              [mainTypeName]: {
                [resolverName]: field.resolveAs.resolver
              }
            };
            addGraphQLResolvers(resolver);
          }

          // if addOriginalField option is enabled, also add original field to schema
          if (field.resolveAs.addOriginalField && fieldType) {
            mainSchema.push(`${fieldName}: ${fieldType}`);
          }

        } else {
          // try to guess GraphQL type
          if (fieldType) {
            mainSchema.push(`${fieldName}: ${fieldType}`);
          }
        }

        if (field.insertableBy || field.editableBy) {

          // note: marking a field as required makes it required for updates, too,
          // which makes partial updates impossible
          // const isRequired = field.optional ? '' : '!';

          const isRequired = '';

          // 2. input schema
          inputSchema.push(`${fieldName}: ${fieldType}${isRequired}`);

          // 3. unset schema
          unsetSchema.push(`${fieldName}: Boolean`);

        }
      }
    });

    const { interfaces = [] } = collection.options;
    const graphQLInterfaces = interfaces.length ? `implements ${interfaces.join(`, `)} ` : '';

    let graphQLSchema = `
      type ${mainTypeName} ${graphQLInterfaces}{
        ${mainSchema.join('\n  ')}
      }
    `

    // TODO: do not generate input types if they're not needed?
    graphQLSchema += `
      input ${collectionName}Input {
        ${inputSchema.length ? inputSchema.join('\n  ') : '_blank: Boolean'}
      }
      input ${collectionName}Unset {
        ${inputSchema.length ? unsetSchema.join('\n  ') : '_blank: Boolean'}
      }
    `
    return graphQLSchema;
  }
};

Vulcan.getGraphQLSchema = () => {
  const schema = GraphQLSchema.finalSchema[0];
  console.log(schema);
  return schema;
}

export const addGraphQLCollection = GraphQLSchema.addCollection.bind(GraphQLSchema);
export const addGraphQLSchema = GraphQLSchema.addSchema.bind(GraphQLSchema);
export const addGraphQLQuery = GraphQLSchema.addQuery.bind(GraphQLSchema);
export const addGraphQLMutation = GraphQLSchema.addMutation.bind(GraphQLSchema);
export const addGraphQLResolvers = GraphQLSchema.addResolvers.bind(GraphQLSchema);
export const removeGraphQLResolver = GraphQLSchema.removeResolver.bind(GraphQLSchema);
export const addToGraphQLContext = GraphQLSchema.addToContext.bind(GraphQLSchema);