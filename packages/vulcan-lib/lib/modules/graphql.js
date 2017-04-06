/*

Utilities to generate the app's GraphQL schema

*/

import deepmerge from 'deepmerge';
import GraphQLJSON from 'graphql-type-json';
import GraphQLDate from 'graphql-date';
import Vulcan from './config.js'; // used for global export
import { Utils } from './utils.js';

// convert a JSON schema to a GraphQL schema
const jsTypeToGraphQLType = type => {
  const typeName = typeof type === 'function' ? type.name : type;
  switch (typeName) {

    case "String":
      return "String";

    case "Number":
      return "Float";

    case 'SimpleSchema.Integer':
      return 'Int';

    // assume all arrays contains strings for now
    case "Array":
      return "[String]";

    case "Object":
      return "JSON";

    case "Date":
      return "Date";

    default:
      return typeName;
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

    _.forEach(schema, (field, key) => {
      // console.log(field, key)
      const fieldType = jsTypeToGraphQLType(field.type.singleType);

      if (key.indexOf('$') === -1) { // skip fields with "$"

        // 1. main schema
        mainSchema.push(`${key}: ${fieldType}`);

        // if field has a resolver, also push it to schema
        if (field.resolveAs) {
          mainSchema.push(field.resolveAs);
        }

        if (field.insertableBy || field.editableBy) {

          // note: marking a field as required makes it required for updates, too,
          // which makes partial updates impossible
          // const isRequired = field.optional ? '' : '!';

          const isRequired = '';

          // 2. input schema
          inputSchema.push(`${key}: ${fieldType}${isRequired}`);

          // 3. unset schema
          unsetSchema.push(`${key}: Boolean`);

        }
      }
    });

    let graphQLSchema = `
      type ${mainTypeName} {
        ${mainSchema.join('\n  ')}
      }
    `

    if (inputSchema.length) {
      graphQLSchema += `
        input ${collectionName}Input {
          ${inputSchema.join('\n  ')}
        }
        input ${collectionName}Unset {
          ${unsetSchema.join('\n  ')}
        }
      `
    }

    return graphQLSchema;
  }
};

Vulcan.getGraphQLSchema = () => {
  const schema = GraphQLSchema.finalSchema[0];
  console.log(schema);
  return schema;
}

export const addGraphQLSchema = GraphQLSchema.addSchema.bind(GraphQLSchema);
export const addGraphQLQuery = GraphQLSchema.addQuery.bind(GraphQLSchema);
export const addGraphQLMutation = GraphQLSchema.addMutation.bind(GraphQLSchema);
export const addGraphQLResolvers = GraphQLSchema.addResolvers.bind(GraphQLSchema);
export const removeGraphQLResolver = GraphQLSchema.removeResolver.bind(GraphQLSchema);
export const addToGraphQLContext = GraphQLSchema.addToContext.bind(GraphQLSchema);