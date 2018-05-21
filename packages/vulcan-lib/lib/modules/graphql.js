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

disableFragmentWarnings();

// get GraphQL type for a given schema and field name
const getGraphQLType = (schema, fieldName, isInputType) => {

  const field = schema[fieldName];
  const type = field.type.singleType;
  const typeName = typeof type === 'object' ? 'Object' : typeof type === 'function' ? type.name : type;

  // intl fields should be treated as strings (or JSON if in the context of an input type)
  if (isIntlField(field)) {
    return isInputType ? 'JSON': 'String';
  }
  
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
  
  // generate a GraphQL schema corresponding to a given collection
  generateSchema(collection) {

    const collectionName = collection.options.collectionName;

    const mainTypeName = collection.typeName ? collection.typeName : Utils.camelToSpaces(_.initial(collectionName).join('')); // default to posts -> Post

    // backward-compatibility code: we do not want user.telescope fields in the graphql schema
    const schema = Utils.stripTelescopeNamespace(collection.simpleSchema()._schema);

    let mainSchema = [], inputSchema = [], unsetSchema = [], graphQLSchema = '';

    _.forEach(schema, (field, fieldName) => {
      // console.log(field, fieldName)

      const fieldType = getGraphQLType(schema, fieldName);
      // note: intl field have a String "normal" type but a JSON input type
      const fieldInputType = getGraphQLType(schema, fieldName, true);

      // only include fields that are viewable/insertable/editable and don't contain "$" in their name
      // note: insertable/editable fields must be included in main schema in case they're returned by a mutation
      if ((field.viewableBy || field.insertableBy || field.editableBy) && fieldName.indexOf('$') === -1) {

        const fieldDescription = field.description ? `# ${field.description}
  ` : '';

        const fieldDirective = isIntlField(field) ? ` @intl` : '';

        // if field has a resolveAs, push it to schema
        if (field.resolveAs) {

          if (typeof field.resolveAs === 'string') {
            // if resolveAs is a string, push it and done
            mainSchema.push(field.resolveAs);
          } else {

            // get resolver name from resolveAs object, or else default to field name
            const resolverName = field.resolveAs.fieldName || fieldName;

            // use specified GraphQL type or else convert schema type
            const fieldGraphQLType = field.resolveAs.type || fieldType;

            // if resolveAs is an object, first push its type definition
            // include arguments if there are any
            mainSchema.push(`${resolverName}${field.resolveAs.arguments ? `(${field.resolveAs.arguments})` : ''}: ${fieldGraphQLType}${fieldDirective}`);

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
            mainSchema.push(
`${fieldDescription}${fieldName}: ${fieldType}${fieldDirective}`);
          }

        } else {
          // try to guess GraphQL type
          if (fieldType) {
            mainSchema.push(
`${fieldDescription}${fieldName}(locale: String): ${fieldType}${fieldDirective}`);
          }
        }

        if (field.insertableBy || field.editableBy) {

          // note: marking a field as required makes it required for updates, too,
          // which makes partial updates impossible
          // const isRequired = field.optional ? '' : '!';

          const isRequired = '';

          // 2. input schema
          inputSchema.push(`${fieldName}: ${fieldInputType}${isRequired}`);

          // 3. unset schema
          unsetSchema.push(`${fieldName}: Boolean`);

        }

        // if field is i18nized, add special field containing all languages
        if (isIntlField(field)) {
          const intlFieldName = `${fieldName}Intl`;
          mainSchema.push(
`${intlFieldName}: JSON`);

          // add resolver that returns the actual db field without the effetcs of the @intl directive
          const intlResolver = {
            [mainTypeName]: {
              [intlFieldName]: doc => doc[fieldName]
            }
          };
          addGraphQLResolvers(intlResolver);
        }
      }
    });

    const { interfaces = [] } = collection.options;
    const graphQLInterfaces = interfaces.length ? `implements ${interfaces.join(`, `)} ` : '';

    const description = collection.options.description ? collection.options.description : `Type for ${collectionName}`

    if (mainSchema.length) {

      graphQLSchema += 
`# ${description}
type ${mainTypeName} ${graphQLInterfaces}{
  ${mainSchema.join('\n  ')}
}

`
    }

    if (inputSchema.length) {
      graphQLSchema += 
`# ${description} (input type)
input ${collectionName}Input {
  ${inputSchema.join('\n  ')}
}

`
    }

    if (unsetSchema.length) {
      graphQLSchema += 
`# ${description} (unset input type)
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
