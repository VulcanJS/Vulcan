/**
 * Generates the GraphQL schema and
 * the resolvers and mutations for a Vulcan collectio
 */
import { getDefaultResolvers } from '../default_resolvers';
import { getDefaultMutations } from '../default_mutations';
import { getSchemaFields } from './schemaFields';
import {
  selectorInputTemplate,
  mainTypeTemplate,
  createInputTemplate,
  createDataInputTemplate,
  updateInputTemplate,
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
  enumTypeTemplate,
  fieldFilterInputTemplate,
  fieldSortInputTemplate,
  customFilterTemplate,
  // customSortTemplate, // not currently used
  //nestedInputTemplate,
} from '../../modules/graphql_templates';

import { Utils } from '../utils.js';

import _isEmpty from 'lodash/isEmpty';
import _initial from 'lodash/initial';

/**
 * Extract relevant collection information and set default values
 * @param {*} collection
 */
const getCollectionInfos = collection => {
  const collectionName = collection.options.collectionName;
  const typeName = collection.typeName ? collection.typeName : Utils.camelToSpaces(_initial(collectionName).join('')); // default to posts -> Post
  const schema = collection.simpleSchema()._schema;
  const description = collection.options.description ? collection.options.description : `Type for ${collectionName}`;
  return {
    ...collection.options,
    collectionName,
    typeName,
    schema,
    description,
  };
};

const createResolvers = ({ resolvers: providedResolvers, typeName }) => {
  const queryResolvers = {};
  const queriesToAdd = [];
  const resolversToAdd = [];
  if (providedResolvers === null) {
    // user explicitely disabled default resolvers
    return { queriesToAdd, resolversToAdd };
  }
  // if resolvers are empty, use defaults
  const resolvers = _isEmpty(providedResolvers) ? getDefaultResolvers({ typeName }) : providedResolvers;
  // single
  if (resolvers.single) {
    queriesToAdd.push([singleQueryTemplate({ typeName }), resolvers.single.description]);
    //addGraphQLQuery(singleQueryTemplate({ typeName }), resolvers.single.description);
    queryResolvers[Utils.camelCaseify(typeName)] = resolvers.single.resolver.bind(resolvers.single);
  }
  // multi
  if (resolvers.multi) {
    queriesToAdd.push([multiQueryTemplate({ typeName }), resolvers.multi.description]);
    //addGraphQLQuery(multiQueryTemplate({ typeName }), resolvers.multi.description);
    queryResolvers[Utils.camelCaseify(Utils.pluralize(typeName))] = resolvers.multi.resolver.bind(resolvers.multi);
  }
  //addGraphQLResolvers({ Query: { ...queryResolvers } });
  resolversToAdd.push({ Query: { ...queryResolvers } });
  return {
    queriesToAdd,
    resolversToAdd,
  };
};
const createMutations = ({ mutations: providedMutations = {}, typeName, collectionName, fields }) => {
  const mutationResolvers = {};
  const mutationsToAdd = [];
  const mutationsResolversToAdd = [];
  if (providedMutations === null) {
    // user explicitely disabled mutations
    return { mutationsResolversToAdd, mutationsToAdd };
  }
  // extend defaults with provided mutations
  const mutations = { ...getDefaultMutations({ typeName }), ...providedMutations };

  const { create, update } = fields;

  // create
  if (mutations.create) {
    // e.g. "createMovie(input: CreateMovieInput) : Movie"
    if (create.length === 0) {
      // eslint-disable-next-line no-console
      console.log(
        `// Warning: you defined a "create" mutation for collection ${collectionName}, but it doesn't have any mutable fields, so no corresponding mutation types can be generated. Remove the "create" mutation or define a "canCreate" property on a field to disable this warning`
      );
    } else {
      //addGraphQLMutation(createMutationTemplate({ typeName }), mutations.create.description);
      mutationsToAdd.push([createMutationTemplate({ typeName }), mutations.create.description]);
      mutationResolvers[`create${typeName}`] = mutations.create.mutation.bind(mutations.create);
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
      mutationsToAdd.push([updateMutationTemplate({ typeName }), mutations.update.description]);
      //addGraphQLMutation(updateMutationTemplate({ typeName }), mutations.update.description);
      mutationResolvers[`update${typeName}`] = mutations.update.mutation.bind(mutations.update);
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
      mutationsToAdd.push([upsertMutationTemplate({ typeName }), mutations.upsert.description]);
      //addGraphQLMutation(upsertMutationTemplate({ typeName }), mutations.upsert.description);
      mutationResolvers[`upsert${typeName}`] = mutations.upsert.mutation.bind(mutations.upsert);
    }
  }
  // delete
  if (mutations.delete) {
    // e.g. "deleteMovie(input: DeleteMovieInput) : Movie"
    //addGraphQLMutation(deleteMutationTemplate({ typeName }), mutations.delete.description);
    mutationsToAdd.push([deleteMutationTemplate({ typeName }), mutations.delete.description]);
    mutationResolvers[`delete${typeName}`] = mutations.delete.mutation.bind(mutations.delete);
  }
  //addGraphQLResolvers({ Mutation: { ...mutationResolvers } });
  mutationsResolversToAdd.push({ Mutation: { ...mutationResolvers } });
  return { mutationsResolversToAdd, mutationsToAdd };
};

// generate types, input and enums
const generateSchemaFragments = ({ collection, typeName, description, interfaces = [], fields, isNested = false }) => {
  const schemaFragments = [];
  const {
    mainType,
    create,
    update,
    selector,
    selectorUnique,
    //orderBy,
    readable,
    filterable,
    enums,
  } = fields;

  if (!mainType || mainType.length === 0) {
    throw new Error(`GraphQL type ${typeName} has no fields. Please add readable fields or remove the type.`);
  }

  schemaFragments.push(mainTypeTemplate({ typeName, description, interfaces, fields: mainType }));

  if (enums) {
    for (const { allowedValues, typeName: enumTypeName } of enums) {
      schemaFragments.push(enumTypeTemplate({ typeName: enumTypeName, allowedValues }));
    }
  }
  if (isNested) {
    // TODO: this is wrong because the mainType includes resolveAs fields
    // + this input type does not seem to be actually used?
    // schemaFragments.push(nestedInputTemplate({ typeName, fields: mainType }));

    //schemaFragments.push(deleteInputTemplate({ typeName }));
    //schemaFragments.push(singleInputTemplate({ typeName }));
    //schemaFragments.push(multiInputTemplate({ typeName }));
    //schemaFragments.push(singleOutputTemplate({ typeName }));
    //schemaFragments.push(multiOutputTemplate({ typeName }));
    //schemaFragments.push(mutationOutputTemplate({ typeName }));

    if (create.length) {
      schemaFragments.push(createInputTemplate({ typeName }));
      schemaFragments.push(createDataInputTemplate({ typeName, fields: create }));
    }

    if (update.length) {
      schemaFragments.push(updateInputTemplate({ typeName }));
      schemaFragments.push(upsertInputTemplate({ typeName }));
      schemaFragments.push(updateDataInputTemplate({ typeName, fields: update }));
    }
    if (filterable.length) {
      schemaFragments.push(fieldFilterInputTemplate({ typeName, fields: filterable }));
      schemaFragments.push(fieldSortInputTemplate({ typeName, fields: filterable }));
    }

    //   schemaFragments.push(selectorInputTemplate({ typeName, fields: selector }));

    //    schemaFragments.push(selectorUniqueInputTemplate({ typeName, fields: selectorUnique }));

    //    schemaFragments.push(orderByInputTemplate({ typeName, fields: orderBy }));
    return schemaFragments; // return now
  }

  if (readable.length) {
    schemaFragments.push(singleInputTemplate({ typeName }));
    schemaFragments.push(multiInputTemplate({ typeName }));
    schemaFragments.push(singleOutputTemplate({ typeName }));
    schemaFragments.push(multiOutputTemplate({ typeName }));
  }

  if (create.length || update.length) {
    schemaFragments.push(mutationOutputTemplate({ typeName }));
  }
  if (create.length) {
    schemaFragments.push(createInputTemplate({ typeName }));
    schemaFragments.push(createDataInputTemplate({ typeName, fields: create }));
  }

  if (update.length) {
    schemaFragments.push(updateInputTemplate({ typeName }));
    schemaFragments.push(upsertInputTemplate({ typeName }));
    schemaFragments.push(updateDataInputTemplate({ typeName, fields: update }));
    schemaFragments.push(deleteInputTemplate({ typeName }));
  }

  if (filterable.length) {
    const customFilters = collection.options.customFilters;
    schemaFragments.push(fieldFilterInputTemplate({ typeName, fields: filterable, customFilters }));
    if (customFilters) {
      customFilters.forEach(filter => {
        // if filter has no argument we don't need to create a custom type for it
        if (filter.arguments) {
          schemaFragments.push(customFilterTemplate({ typeName, filter }));
        }
      });
    }
    const customSorts = collection.options.customSorts;
    schemaFragments.push(fieldSortInputTemplate({ typeName, fields: filterable, customSorts }));
    // TODO: not currently working
    // if (customSorts) {
    //   customSorts.forEach(sort => {
    //     schemaFragments.push(customSortTemplate({ typeName, sort }));
    //   });
    // }
  }

  schemaFragments.push(selectorInputTemplate({ typeName, fields: selector }));

  schemaFragments.push(selectorUniqueInputTemplate({ typeName, fields: selectorUnique }));

  return schemaFragments;
};
const collectionToGraphQL = collection => {
  let graphQLSchema = '';
  const schemaFragments = [];

  const { collectionName, typeName, schema, description, interfaces = [], resolvers, mutations } = getCollectionInfos(collection);

  const { nestedFieldsList, fields, resolvers: schemaResolvers } = getSchemaFields(schema, typeName);

  const { mainType } = fields;

  if (mainType.length) {
    schemaFragments.push(
      ...generateSchemaFragments({
        collection,
        typeName,
        description,
        interfaces,
        fields,
        isNested: false,
      })
    );
    /* NESTED */
    // TODO: factorize to use the same function as for non nested fields
    // the schema may produce a list of additional graphQL types for nested arrays/objects
    if (nestedFieldsList) {
      for (const nestedFields of nestedFieldsList) {
        schemaFragments.push(
          ...generateSchemaFragments({
            typeName: nestedFields.typeName,
            fields: nestedFields.fields,
            isNested: true,
          })
        );
      }
    }

    const { queriesToAdd, resolversToAdd } = createResolvers({ resolvers, typeName });
    const { mutationsToAdd, mutationsResolversToAdd } = createMutations({
      mutations,
      typeName,
      collectionName,
      fields,
    });

    graphQLSchema = schemaFragments.join('\n\n') + '\n\n\n';

    return {
      graphQLSchema,
      queriesToAdd,
      schemaResolvers,
      resolversToAdd,
      mutationsToAdd,
      mutationsResolversToAdd,
    };
  } else {
    // eslint-disable-next-line no-console
    console.log(
      `// Warning: collection ${collectionName} doesn't have any GraphQL-enabled fields, so no corresponding type can be generated. Pass generateGraphQLSchema = false to createCollection() to disable this warning`
    );
  }

  return { graphQLSchema };
};

export default collectionToGraphQL;
