// TODO: this should not be loaded on the client?
/*

Utilities to generate the app's GraphQL schema
and register schema parts based on the application collections

*/

import deepmerge from 'deepmerge';
import GraphQLJSON from 'graphql-type-json';
import GraphQLDate from 'graphql-date';
import Vulcan from '../config.js'; // used for global export
import { Utils } from '../utils.js';
import { disableFragmentWarnings } from 'graphql-tag';
import {
  selectorInputTemplate,
  mainTypeTemplate,
  createInputTemplate,
  createDataInputTemplate,
  updateInputTemplate,
  updateDataInputTemplate,
  orderByInputTemplate,
  selectorUniqueInputTemplate,
  deleteInputTemplate,
  upsertInputTemplate,
  singleInputTemplate,
  multiInputTemplate,
  multiOutputTemplate,
  singleOutputTemplate,
  mutationOutputTemplate,
  singleQueryTemplate,
  multiQueryTemplate,
  createMutationTemplate,
  updateMutationTemplate,
  upsertMutationTemplate,
  deleteMutationTemplate,
} from '../graphql_templates.js';

import { 
  getSchemaFields
} from './schemaFields';

disableFragmentWarnings();


const defaultResolvers = {
  JSON: GraphQLJSON,
  Date: GraphQLDate,
};

export const GraphQLSchema = {
  // reinit the schema (testing purposes only)
  init(){
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


  // generate a GraphQL schema corresponding to a given collection
  generateSchema(collection) {
    let graphQLSchema = '';

    const schemaFragments = [];

    const collectionName = collection.options.collectionName;

    const typeName = collection.typeName
      ? collection.typeName
      : Utils.camelToSpaces(_.initial(collectionName).join('')); // default to posts -> Post

    const schema = collection.simpleSchema()._schema;

    const { fields, resolvers: schemaResolvers } = getSchemaFields(schema, typeName);
    // register the generated resolvers
    schemaResolvers.forEach(addGraphQLResolvers);

    const { interfaces = [], resolvers, mutations } = collection.options;

    const description = collection.options.description
      ? collection.options.description
      : `Type for ${collectionName}`;

    const { mainType, create, update, selector, selectorUnique, orderBy } = fields;

    if (mainType.length) {
      schemaFragments.push(
        mainTypeTemplate({ typeName, description, interfaces, fields: mainType })
      );
      schemaFragments.push(deleteInputTemplate({ typeName }));
      schemaFragments.push(singleInputTemplate({ typeName }));
      schemaFragments.push(multiInputTemplate({ typeName }));
      schemaFragments.push(singleOutputTemplate({ typeName }));
      schemaFragments.push(multiOutputTemplate({ typeName }));
      schemaFragments.push(mutationOutputTemplate({ typeName }));

      if (create.length) {
        schemaFragments.push(createInputTemplate({ typeName }));
        schemaFragments.push(createDataInputTemplate({ typeName, fields: create }));
      }

      if (update.length) {
        schemaFragments.push(updateInputTemplate({ typeName }));
        schemaFragments.push(upsertInputTemplate({ typeName }));
        schemaFragments.push(updateDataInputTemplate({ typeName, fields: update }));
      }

      schemaFragments.push(selectorInputTemplate({ typeName, fields: selector }));

      schemaFragments.push(selectorUniqueInputTemplate({ typeName, fields: selectorUnique }));

      schemaFragments.push(orderByInputTemplate({ typeName, fields: orderBy }));

      if (!_.isEmpty(resolvers)) {
        const queryResolvers = {};

        // single
        if (resolvers.single) {
          addGraphQLQuery(singleQueryTemplate({ typeName }), resolvers.single.description);
          queryResolvers[Utils.camelCaseify(typeName)] = resolvers.single.resolver.bind(
            resolvers.single
          );
        }

        // multi
        if (resolvers.multi) {
          addGraphQLQuery(multiQueryTemplate({ typeName }), resolvers.multi.description);
          queryResolvers[
            Utils.camelCaseify(Utils.pluralize(typeName))
          ] = resolvers.multi.resolver.bind(resolvers.multi);
        }
        addGraphQLResolvers({ Query: { ...queryResolvers } });
      }

      if (!_.isEmpty(mutations)) {
        const mutationResolvers = {};
        // create
        if (mutations.create) {
          // e.g. "createMovie(input: CreateMovieInput) : Movie"
          if (create.length === 0) {
            // eslint-disable-next-line no-console
            console.log(
              `// Warning: you defined a "create" mutation for collection ${collectionName}, but it doesn't have any mutable fields, so no corresponding mutation types can be generated. Remove the "create" mutation or define a "canCreate" property on a field to disable this warning`
            );
          } else {
            addGraphQLMutation(createMutationTemplate({ typeName }), mutations.create.description);
            mutationResolvers[`create${typeName}`] = mutations.create.mutation.bind(
              mutations.create
            );
          }
        }
        // update
        if (mutations.update) {
          // e.g. "updateMovie(input: UpdateMovieInput) : Movie"
          if (update.length === 0) {
            // eslint-disable-next-line no-console
            console.log(
              `// Warning: you defined an "update" mutation for collection ${collectionName}, but it doesn't have any mutable fields, so no corresponding mutation types can be generated. Remove the "update" mutation or define a "canUpdate" property on a field to disable this warning`
            );
          } else {
            addGraphQLMutation(updateMutationTemplate({ typeName }), mutations.update.description);
            mutationResolvers[`update${typeName}`] = mutations.update.mutation.bind(
              mutations.update
            );
          }
        }
        // upsert
        if (mutations.upsert) {
          // e.g. "upsertMovie(input: UpsertMovieInput) : Movie"
          if (update.length === 0) {
            // eslint-disable-next-line no-console
            console.log(
              `// Warning: you defined an "upsert" mutation for collection ${collectionName}, but it doesn't have any mutable fields, so no corresponding mutation types can be generated. Remove the "upsert" mutation or define a "canUpdate" property on a field to disable this warning`
            );
          } else {
            addGraphQLMutation(upsertMutationTemplate({ typeName }), mutations.upsert.description);
            mutationResolvers[`upsert${typeName}`] = mutations.upsert.mutation.bind(
              mutations.upsert
            );
          }
        }
        // delete
        if (mutations.delete) {
          // e.g. "deleteMovie(input: DeleteMovieInput) : Movie"
          addGraphQLMutation(deleteMutationTemplate({ typeName }), mutations.delete.description);
          mutationResolvers[`delete${typeName}`] = mutations.delete.mutation.bind(mutations.delete);
        }
        addGraphQLResolvers({ Mutation: { ...mutationResolvers } });
      }
      graphQLSchema = schemaFragments.join('\n\n') + '\n\n\n';
    } else {
      // eslint-disable-next-line no-console
      console.log(
        `// Warning: collection ${collectionName} doesn't have any GraphQL-enabled fields, so no corresponding type can be generated. Pass generateGraphQLSchema = false to createCollection() to disable this warning`
      );
    }

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

