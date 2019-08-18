import SimpleSchema from 'simpl-schema';


export /**
 * Generate resolvers for the type defined in the SimpleSchema.
 *
 * @param {SimpleSchema} schema
 * @returns an object mapping the field names to a GraphQL resolver function
 */
const generateResolversFromSchema = schema => {
  // console.log(schema);
  if (!(schema instanceof SimpleSchema)) {
    throw Error('must pass a SimpleSchema to generate Resolvers');
  }
  const { _schema, _schemaKeys, _firstLevelSchemaKeys, _objectKeys, _blackboxKeys } = schema;
  const resolvers = {};
  console.log('schemakeys: ', _schemaKeys)
  console.log('firstLevelSchemaKeys: ', _firstLevelSchemaKeys)
  console.log('objectKeys: ', _objectKeys)
  console.log('blackboxKeys: ', _blackboxKeys)

  _firstLevelSchemaKeys.forEach(key => {
    // console.log(_schema[key]);
    const resolver = (root, args, context) => {
      // console.log('in resolver!!!')
      // console.log(root)
      const result = root[key];
      if (!result) return null;
      const { currentUser, Users } = context;
      if (Users.canReadField(currentUser, _schema[key], root)) {
        return result;
      } else {
        return null;
      }
    };
    resolvers[key] = resolver;
  });
  return resolvers;
};
