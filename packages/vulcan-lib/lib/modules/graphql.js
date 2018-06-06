/*

Utilities to generate the app's GraphQL schema

*/

import deepmerge from 'deepmerge';
import GraphQLJSON from 'graphql-type-json';
import GraphQLDate from 'graphql-date';
import Vulcan from './config.js'; // used for global export
import { Utils } from './utils.js';
import { disableFragmentWarnings } from 'graphql-tag';
import { isIntlField } from './intl.js';
import { selectorInputTemplate, mainTypeTemplate, createInputTemplate, createDataInputTemplate, updateInputTemplate, updateDataInputTemplate, orderByInputTemplate, selectorUniqueInputTemplate, deleteInputTemplate, upsertInputTemplate, singleInputTemplate, multiInputTemplate, multiOutputTemplate, singleOutputTemplate, mutationOutputTemplate } from './graphql_templates.js';

disableFragmentWarnings();

// get GraphQL type for a given schema and field name
const getGraphQLType = (schema, fieldName) => {

  const field = schema[fieldName];
  const type = field.type.singleType;
  const typeName = typeof type === 'object' ? 'Object' : typeof type === 'function' ? type.name : type;

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
    }).join('');
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

  directives: {},
  addDirective(directive) {
    this.directives = deepmerge(this.directives, directive);
  },
  
  // for a given schema, return main type fields, selector fields, 
  // unique selector fields, orderBy fields, creatable fields, and updatable fields
  getFields(schema, typeName) {
    const fields = {
      mainType: [],
      create: [],
      update: [],
      selector: [],
      selectorUnique: [],
      orderBy: [],
    };

    Object.keys(schema).forEach(fieldName => {

      const field = schema[fieldName];
      const fieldType = getGraphQLType(schema, fieldName);

      // only include fields that are viewable/insertable/editable and don't contain "$" in their name
      // note: insertable/editable fields must be included in main schema in case they're returned by a mutation
      if ((field.viewableBy || field.insertableBy || field.editableBy) && fieldName.indexOf('$') === -1) {

        const fieldDescription = field.description;
        const fieldDirective = isIntlField(field) ? `@intl` : '';
        const fieldArguments = isIntlField(field) ? [{ name: 'locale', type: 'String' }] : [];

        // if field has a resolveAs, push it to schema
        if (field.resolveAs) {

            // get resolver name from resolveAs object, or else default to field name
            const resolverName = field.resolveAs.fieldName || fieldName;

            // use specified GraphQL type or else convert schema type
            const fieldGraphQLType = field.resolveAs.type || fieldType;

            // if resolveAs is an object, first push its type definition
            // include arguments if there are any
            // note: resolved fields are not internationalized
            fields.mainType.push({
              description: field.resolveAs.description,
              name: resolverName,
              args: field.resolveAs.arguments,
              type: fieldGraphQLType,
            });

            // then build actual resolver object and pass it to addGraphQLResolvers
            const resolver = {
              [typeName]: {
                [resolverName]: field.resolveAs.resolver
              }
            };
            addGraphQLResolvers(resolver);

          // if addOriginalField option is enabled, also add original field to schema
          if (field.resolveAs.addOriginalField && fieldType) {
            fields.mainType.push({
              description: fieldDescription,
              name: fieldName,
              args: fieldArguments,
              type: fieldType,
              directive: fieldDirective,
            });
          }

        } else {
          // try to guess GraphQL type
          if (fieldType) {
            fields.mainType.push({
              description: fieldDescription,
              name: fieldName,
              args: fieldArguments,
              type: fieldType,
              directive: fieldDirective,
            });
          }
        }

        if (field.insertableBy) {
          fields.create.push({
            name: fieldName,
            type: fieldType,
            required: !field.optional,
          });
        }
        if (field.editableBy) {
          fields.update.push({
            name: fieldName,
            type: fieldType,
          });
        }

        // if field is i18nized, add foo_intl field containing all languages
        if (isIntlField(field)) {
          fields.mainType.push({ name: `${fieldName}_intl`, type: `[IntlValue]` });
          fields.create.push({ name: `${fieldName}_intl`, type: `[IntlValueInput]` });
          fields.update.push({ name: `${fieldName}_intl`, type: `[IntlValueInput]` });
        }

        if (field.selectable) {
          // TODO
        }

        if (field.orderable) {
          fields.orderBy.push(fieldName);
        }
      }
    });
    return fields;
  },

  // generate a GraphQL schema corresponding to a given collection
  generateSchema(collection) {

    const schemaFragments = [];

    const collectionName = collection.options.collectionName;

    const typeName = collection.typeName ? collection.typeName : Utils.camelToSpaces(_.initial(collectionName).join('')); // default to posts -> Post

    const schema = collection.simpleSchema()._schema;

    const fields = this.getFields(schema, typeName);

    const { interfaces = [] } = collection.options;

    const description = collection.options.description ? collection.options.description : `Type for ${collectionName}`

    const { mainType, create, update, selector, selectorUnique, orderBy } = fields;

    schemaFragments.push(mainTypeTemplate({ typeName, description, interfaces, fields: mainType }));
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

    const graphQLSchema = schemaFragments.join('\n\n') + `\n\n\n`;

    // console.log(graphQLSchema)

    return graphQLSchema;
  }
};

Vulcan.getGraphQLSchema = () => {
  const schema = GraphQLSchema.finalSchema[0];
  // eslint-disable-next-line no-console
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
export const addGraphQLDirective = GraphQLSchema.addDirective.bind(GraphQLSchema);
