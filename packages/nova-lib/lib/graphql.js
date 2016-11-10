import Telescope from './config.js';
import deepmerge from 'deepmerge';

const jsTypeToGraphQLType = typeName => {
  switch (typeName) {
    case "Date":
      return "String";

    case "Number":
      return "Float";

    // assume all arrays contains strings for now
    case "Array":
      return "[String]";

    case "Object":
      return "???";

    default:
      return typeName;
  }
}

Telescope.graphQL = {

  // collections used to auto-generate schemas
  collections: [],
  addCollection(collection) {
    this.collections.push(collection);
  },
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
  resolvers: {},
  addResolvers(resolvers) {
    this.resolvers = deepmerge(this.resolvers, resolvers);
  },

  // add objects to context
  context: {},
  addToContext(object) {
    this.context = deepmerge(this.context, object);
  },
  
  generateSchema(collection) {

    const collectionName = collection._name;
    const mainTypeName = collection.typeName ? collection.typeName : Telescope.utils.camelToSpaces(_.initial(collectionName).join('')); // default to posts -> Post

    // backward-compatibility code: we do not want user.telescope fields in the graphql schema
    const schema = Telescope.utils.stripTelescopeNamespace(collection.simpleSchema()._schema);

    let mainSchema = [], inputSchema = [], unsetSchema = [];

    _.forEach(schema, (field, key) => {
      // console.log(field, key)
      const fieldType = jsTypeToGraphQLType(field.type.name);

      if (key.indexOf('$') === -1 && fieldType !== "???") { // skip fields with "$" and unknown fields
        
        // 1. main schema
        mainSchema.push(`${key}: ${fieldType}`);

        // if field has a resolver, also push it to schema
        if (field.resolveAs) {
          mainSchema.push(field.resolveAs);
        }

        if (field.insertableIf || field.editableIf) {

          const isRequired = field.optional ? '' : '!';

          // 2. input schema
          inputSchema.push(`${key}: ${fieldType}${isRequired}`);
          
          // 3. unset schema
          unsetSchema.push(`${key}: Boolean`);
        
        }
      }
    });

    const graphQLSchema = `
type ${mainTypeName} {
  ${mainSchema.join('\n  ')}
}

input ${collectionName}Input {
  ${inputSchema.join('\n  ')}
}

input ${collectionName}Unset {
  ${unsetSchema.join('\n  ')}
}
    `;
    
    // const graphQLSchema = _.compact(_.map(schema, (field, key) => {
    //   // console.log(field, key)
    //   if (key.indexOf('$') !== -1) {
    //     // skip fields with "$"
    //     return
    //   } else {
    //     // if field has a resolver, use it, else use a name: type pattern
    //     return !!field.resolveAs ? field.resolveAs : `${key}: ${jsTypeToGraphQLType(field.type.name)}`
    //   }
    // })).join('\n');

    return graphQLSchema;
  }
};