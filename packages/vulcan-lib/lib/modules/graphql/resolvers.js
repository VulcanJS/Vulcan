import SimpleSchema from 'simpl-schema';

export /**
 * Generate resolvers for the type defined in the SimpleSchema.
 *
 * @param {SimpleSchema} schema
 * @returns an object mapping the field names to a GraphQL resolver function
 */
const generateResolversFromSchema = schema => {
  if (!(schema instanceof SimpleSchema)) {
    throw Error('must pass a SimpleSchema to generate Resolvers');
  }
  const { _schema, _firstLevelSchemaKeys } = schema;
  const resolvers = {};

  _firstLevelSchemaKeys.forEach(key => {
    const resolver = (root, args, context) => {
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
