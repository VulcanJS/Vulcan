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
  addCollection(collection, typeName) {
    this.collections.push({ collection, typeName });
  },
  getCollectionSchemas() {
    const collectionSchemas = this.collections.map(collection => {
      return this.generateSchema(collection.collection, collection.typeName);
    }).join('\n');
    console.log(collectionSchemas)
    return collectionSchemas;
  },

  // additional schemas
  schemas: [],
  addSchema(schema) {
    this.schemas.push(schema);
  },
  getAdditionalSchemas() {
    const additionalSchemas = this.schemas.join('\n');
    console.log(additionalSchemas);
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
  
  generateSchema(collection, typeName) {

    const schema = collection.simpleSchema()._schema;
    const collectionName = collection._name;
    const mainTypeName = typeName ? typeName : Telescope.utils.camelToSpaces(_.initial(collectionName).join('')); // default to posts -> Post

    let mainSchema = [], inputSchema = [], unsetSchema = [];

    _.forEach(schema, (field, key) => {
      // console.log(field, key)
      const fieldType = jsTypeToGraphQLType(field.type.name);

      if (key.indexOf('$') === -1 && fieldType !== "???") { // skip fields with "$" and unknown fields
        
        // 1. main schema
        // if field has a resolver, use it, else use a name: type pattern
        mainSchema.push(!!field.resolveAs ? field.resolveAs : `${key}: ${fieldType}`);
      
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
`
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