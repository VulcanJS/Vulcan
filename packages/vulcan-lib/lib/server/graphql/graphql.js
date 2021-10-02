// TODO: this should not be loaded on the client?
/*

Utilities to generate the app's GraphQL schema
and register schema parts based on the application collections

*/

import deepmerge from 'deepmerge';
import GraphQLJSON from 'graphql-type-json';
import GraphQLDate from 'graphql-date';
//import Vulcan from '../config.js'; // used for global export
import { disableFragmentWarnings } from 'graphql-tag';

import collectionToGraphQL from './collection';
import { generateResolversFromSchema } from './resolvers';
import {
  mainTypeTemplate,
  createDataInputTemplate,
  updateDataInputTemplate,
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
  fieldFilterInputTemplate,
  fieldSortInputTemplate,
} from '../../modules/graphql_templates/index.js';
import getSchemaFields from './schemaFields';

disableFragmentWarnings();


import { getDefaultResolvers } from '../../server/default_resolvers.js';
import { getDefaultMutations } from '../../server/default_mutations.js';
import isEmpty from 'lodash/isEmpty';
import { Collections } from '../../modules/collections.js';


const defaultResolvers = {
  JSON: GraphQLJSON,
  Date: GraphQLDate,
};

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

export const GraphQLSchema = {
  // reinit the schema (testing purposes only)
  init() {
    this.collections = [];
    this.schemas = [];
    this.queries = [];
    this.mutations = [];
    this.resolvers = defaultResolvers;
    this.context = {};
    this.directiveTransformers = [];
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
    const collections = Collections.filter(c => c.options.generateGraphQLSchema !== false);

    const collectionsSchemas = collections
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

  directiveTransformers: [],
  addDirectiveTransformer(directiveTransformer) {
    this.directiveTransformers = [...this.directiveTransformers, directiveTransformer];
  },

  addTypeAndResolvers({ typeName, schema, description = '', interfaces = [] }) {
    if (!typeName) {
      throw Error('Error: trying to add type without typeName');
    }

    const { fields, resolvers: schemaResolvers = [] } = getSchemaFields(schema._schema, typeName);
    const mainType = fields.mainType;

    if (!mainType || mainType.length === 0) {
      // do not create GraphQL types
      return;
    }

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

  /*
  // generate a GraphQL schema corresponding to a given collection
  generateSchema(collection) {
    let graphQLSchema = '';

    const schemaFragments = [];

    const collectionName = collection.options.collectionName;
    let { interfaces = [], resolvers, mutations } = collection.options;

    const description = collection.options.description
      ? collection.options.description
      : `Type for ${collectionName}`;

    const { mainType, create, update, selector, selectorUnique, readable } = fields;

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

      if (readable.length) {
        schemaFragments.push(fieldFilterInputTemplate({ typeName, fields: readable }));
        schemaFragments.push(fieldSortInputTemplate({ typeName, fields: readable }));
      }

      schemaFragments.push(selectorUniqueInputTemplate({ typeName, fields: selectorUnique }));

      if (resolvers !== null) {
        // if resolvers are empty, use defaults
        resolvers = isEmpty(resolvers) ? getDefaultResolvers({ typeName }) : resolvers;

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

      if (mutations !== null) {
        // if mutations are undefined, use defaults
        mutations = isEmpty(mutations) ? getDefaultMutations({ typeName }) : mutations;

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
    }
    graphQLSchema = schemaFragments.join('\n\n') + '\n\n\n';
  }*/
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


// Vulcan.getGraphQLSchema = () => {
//   if (!GraphQLSchema.finalSchema) {
//     throw new Error(
//       'Warning: trying to access graphQL schema before it has been created by the server.'
//     );
//   }
//   const schema = GraphQLSchema.finalSchema[0];
//   // eslint-disable-next-line no-console
//   console.log(schema);
//   return schema;
// };

export const addGraphQLCollection = GraphQLSchema.addCollection.bind(GraphQLSchema);
export const addGraphQLSchema = GraphQLSchema.addSchema.bind(GraphQLSchema);
export const addGraphQLQuery = GraphQLSchema.addQuery.bind(GraphQLSchema);
export const addGraphQLMutation = GraphQLSchema.addMutation.bind(GraphQLSchema);
export const addGraphQLResolvers = GraphQLSchema.addResolvers.bind(GraphQLSchema);
export const removeGraphQLResolver = GraphQLSchema.removeResolver.bind(GraphQLSchema);
export const addToGraphQLContext = GraphQLSchema.addToContext.bind(GraphQLSchema);
export const addGraphQLDirectiveTransformer = GraphQLSchema.addDirectiveTransformer.bind(GraphQLSchema);
export const addStitchedSchema = GraphQLSchema.addStitchedSchema.bind(GraphQLSchema);
export const addTypeAndResolvers = GraphQLSchema.addTypeAndResolvers.bind(GraphQLSchema);
export const getType = GraphQLSchema.getType.bind(GraphQLSchema);
