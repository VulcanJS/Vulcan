import SimpleSchema from 'simpl-schema';

export /**
 * Generate field resolvers for the type defined in the SimpleSchema.
 *
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
      const field = _schema[key];
      // only add resolvers for the fields that can be read
      if (field && (field.canRead || field.viewableBy)) {
        const resolver = (root, args, context) => {
          const result = root[key];
          if (typeof result === 'undefined') return null;
          const { currentUser, Users } = context;
          if (Users.canReadField(currentUser, field, root)) {
            return result;
          } else {
            return null;
          }
        };
        resolvers[key] = resolver;
      }
    });
    return resolvers;
  };
