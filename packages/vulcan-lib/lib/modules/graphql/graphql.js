// TODO: this should not be loaded on the client?
/*

Utilities to generate the app's GraphQL schema
and register schema parts based on the application collections

*/

import deepmerge from 'deepmerge';
import GraphQLJSON from 'graphql-type-json';
import GraphQLDate from 'graphql-date';
import Vulcan from '../config.js'; // used for global export
import { disableFragmentWarnings } from 'graphql-tag';

import collectionToGraphQL from './collection';
import { generateResolversFromSchema } from './resolvers';
import {
  mainTypeTemplate,
  createDataInputTemplate,
  updateDataInputTemplate,
} from '../graphql_templates';
import getSchemaFields from './schemaFields';

disableFragmentWarnings();

/**
 * Extract relevant collection information and set default values
 * @param {*} collection
 */
const getCollectionInfos = collection => {
  const collectionName = collection.options.collectionName;
  const typeName = collection.typeName;
  const schema = collection.simpleSchema();
  const description = collection.options.description
    ? collection.options.description
    : `Type for ${collectionName}`;
  return {
    ...collection.options,
    collectionName,
    typeName,
    schema,
    description,
  };
};

const defaultResolvers = {
  JSON: GraphQLJSON,
  Date: GraphQLDate,
};

export const GraphQLSchema = {
  // reinit the schema (testing purposes only)
  init() {
    this.collections = [];
    this.schemas = [];
    this.queries = [];
    this.mutations = [];
    this.resolvers = defaultResolvers;
    this.context = {};
    this.directives = {};
  },

  // used for schema stitching
  stitchedSchemas: [],
  addStitchedSchema(schema) {
    this.stitchedSchemas.push(schema);
  },

  // collections used to auto-generate schemas
  collections: [],
  addCollection(collection) {
    this.collections.push(collection);
  },
  // generate GraphQL schemas for all registered collections
  getCollectionsSchemas() {
    const collectionsSchemas = this.collections
      .map(collection => {
        return this.generateSchema(collection);
      })
      .join('');
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
  addQuery(query, description) {
    this.queries.push({ query, description });
  },

  // mutations
  mutations: [],
  addMutation(mutation, description) {
    this.mutations.push({ mutation, description });
  },

  // add resolvers
  resolvers: defaultResolvers,
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

  directives: {},
  addDirective(directive) {
    this.directives = deepmerge(this.directives, directive);
  },

  addTypeAndResolvers({ typeName, schema, description = '', interfaces = [] }) {
    if (!typeName) {
      throw Error('Error: trying to add type without typeName');
    }

    const { fields, resolvers: schemaResolvers = [] } = getSchemaFields(schema._schema, typeName);
    const mainType = fields.mainType;

    // generate a graphql type def from the simpleSchema
    const mainGraphQLSchema = mainTypeTemplate({
      typeName,
      fields: mainType,
      description,
      interfaces,
    });

    // add the type and its resolver
    this.addSchema(mainGraphQLSchema);

    // createTypeDataInput
    if ((fields.create || []).length) {
      this.addSchema(createDataInputTemplate({ typeName, fields: fields.create }));
    }
    // updateTypeDataInput
    if ((fields.update || []).length) {
      this.addSchema(updateDataInputTemplate({ typeName, fields: fields.update }));
    }
    const resolvers = generateResolversFromSchema(schema);
    // only add resolvers if there is at least one
    if (typeof resolvers === 'object' && Object.keys(resolvers).length >= 1) {
      this.addResolvers({ [typeName]: resolvers });
    }
    schemaResolvers.forEach(addGraphQLResolvers);
  },

  /**
   * getType - pass this into the schema to make a nested object type,
   * referencing another type. This type sould be declared through
   * createCollection or addTypeAndResolvers
   *
   * @param {*} typeName
   * @returns
   */
  getType(typeName) {
    return {
      type: Object,
      blackbox: true,
      typeName: typeName,
    };
  },

  // generate a GraphQL schema corresponding to a given collection
  generateSchema(collection) {
    const {
      collectionName,
      typeName,
      schema,
      description,
      interfaces = [],
      resolvers,
      mutations,
    } = getCollectionInfos(collection);

    // const { nestedFieldsList, fields, resolvers: schemaResolvers = [] } = getSchemaFields(schema._schema, typeName);

    addTypeAndResolvers({ typeName, schema, description, interfaces });

    const {
      graphQLSchema,
      resolversToAdd = [],
      queriesToAdd = [],
      mutationsToAdd = [],
      mutationsResolversToAdd = [],
    } = collectionToGraphQL(collection);
    // register the generated resolvers
    // schemaResolvers.forEach(addGraphQLResolvers);
    queriesToAdd.forEach(([query, description]) => {
      addGraphQLQuery(query, description);
    });
    resolversToAdd.forEach(addGraphQLResolvers);
    mutationsToAdd.forEach(([mutation, description]) => {
      addGraphQLMutation(mutation, description);
    });
    mutationsResolversToAdd.forEach(addGraphQLResolvers);
    return graphQLSchema;
  },
  // getters
  getSchema() {
    if (!(this.finalSchema && this.finalSchema.length)) {
      throw new Error('Warning: trying to access schema before it has been created by the server.');
    }
    return this.finalSchema[0];
  },
  getExecutableSchema() {
    if (!this.executableSchema) {
      throw new Error(
        'Warning: trying to access executable schema before it has been created by the server.'
      );
    }
    return this.executableSchema;
  },
};

Vulcan.getGraphQLSchema = () => {
  if (!GraphQLSchema.finalSchema) {
    throw new Error(
      'Warning: trying to access graphQL schema before it has been created by the server.'
    );
  }
  const schema = GraphQLSchema.finalSchema[0];
  // eslint-disable-next-line no-console
  console.log(schema);
  return schema;
};

export const addGraphQLCollection = GraphQLSchema.addCollection.bind(GraphQLSchema);
export const addGraphQLSchema = GraphQLSchema.addSchema.bind(GraphQLSchema);
export const addGraphQLQuery = GraphQLSchema.addQuery.bind(GraphQLSchema);
export const addGraphQLMutation = GraphQLSchema.addMutation.bind(GraphQLSchema);
export const addGraphQLResolvers = GraphQLSchema.addResolvers.bind(GraphQLSchema);
export const removeGraphQLResolver = GraphQLSchema.removeResolver.bind(GraphQLSchema);
export const addToGraphQLContext = GraphQLSchema.addToContext.bind(GraphQLSchema);
export const addGraphQLDirective = GraphQLSchema.addDirective.bind(GraphQLSchema);
export const addStitchedSchema = GraphQLSchema.addStitchedSchema.bind(GraphQLSchema);
export const addTypeAndResolvers = GraphQLSchema.addTypeAndResolvers.bind(GraphQLSchema);
export const getType = GraphQLSchema.getType.bind(GraphQLSchema);
