/**
 * Generate graphQL for Vulcan schema fields
 */
import { isIntlField } from '../intl.js';
import relations from './relations.js';

// get GraphQL type for a given schema and field name
const getGraphQLType = (schema, fieldName, isInput = false) => {
  const field = schema[fieldName];
  const type = field.type.singleType;
  const typeName =
    typeof type === 'object' ? 'Object' : typeof type === 'function' ? type.name : type;

  if (field.isIntlData) {
    return isInput ? '[IntlValueInput]' : '[IntlValue]';
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
};

// for a given schema, return main type fields, selector fields,
// unique selector fields, orderBy fields, creatable fields, and updatable fields
export const getSchemaFields = (schema, typeName) => {
  const fields = {
    mainType: [],
    create: [],
    update: [],
    selector: [],
    selectorUnique: [],
    orderBy: [],
    readable: [],
  };
  const resolvers = [];

  Object.keys(schema).forEach(fieldName => {
    const field = schema[fieldName];
    const fieldType = getGraphQLType(schema, fieldName);
    const inputFieldType = getGraphQLType(schema, fieldName, true);

    const {
      canRead,
      canCreate,
      canUpdate,
      viewableBy,
      insertableBy,
      editableBy,
      description,
      selectable,
      unique,
    } = field;
    // only include fields that are viewable/insertable/editable and don't contain "$" in their name
    // note: insertable/editable fields must be included in main schema in case they're returned by a mutation
    // OpenCRUD backwards compatibility
    if (
      (canRead || canCreate || canUpdate || viewableBy || insertableBy || editableBy) &&
      fieldName.indexOf('$') === -1
    ) {
      const fieldDescription = description;
      const fieldDirective = isIntlField(field) ? '@intl' : '';
      const fieldArguments = isIntlField(field) ? [{ name: 'locale', type: 'String' }] : [];

      // if field is readable, make it filterable/orderable too
      if (canRead || viewableBy) {
        fields.readable.push({
          name: fieldName,
          type: fieldType,
        });
      }

      // if field has a resolveAs, push it to schema
      // note: resolveAs can be an array containing multiple resolver definitions
      if (field.resolveAs) {

        const resolveAsArray = Array.isArray(field.resolveAs) ? field.resolveAs : [field.resolveAs];

        resolveAsArray.forEach(resolveAs => {
          // get resolver name from resolveAs object, or else default to field name
          const resolverName = resolveAs.fieldName || fieldName;

          // use specified GraphQL type or else convert schema type
          const fieldGraphQLType = resolveAs.type || fieldType;

          // if resolveAs is an object, first push its type definition
          // include arguments if there are any
          // note: resolved fields are not internationalized
          fields.mainType.push({
            description: resolveAs.description,
            name: resolverName,
            args: resolveAs.arguments,
            type: fieldGraphQLType,
          });

          // then build actual resolver object and pass it to addGraphQLResolvers
          const resolver = {
            [typeName]: {
              [resolverName]: (document, args, context, info) => {
                const { Users, currentUser } = context;
                // check that current user has permission to access the original non-resolved field
                const canReadField = Users.canReadField(currentUser, field, document);
                const { resolver, relation } = resolveAs;
                if (canReadField) {
                  if (resolver) {
                    return resolver(document, args, context, info);
                  } else {
                    return relations[relation]({
                      document,
                      args,
                      context,
                      info,
                      fieldName,
                      typeName: fieldGraphQLType,
                    });
                  }
                } else {
                  return null;
                }
              },
            },
          };
          resolvers.push(resolver);

          // if addOriginalField option is enabled, also add original field to schema
          if (resolveAs.addOriginalField && fieldType) {
            fields.mainType.push({
              description: fieldDescription,
              name: fieldName,
              args: fieldArguments,
              type: fieldType,
              directive: fieldDirective,
            });
          }
        });
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

      // OpenCRUD backwards compatibility
      if (canCreate || insertableBy) {
        fields.create.push({
          name: fieldName,
          type: inputFieldType,
          required: !field.optional,
        });
      }
      // OpenCRUD backwards compatibility
      if (canUpdate || editableBy) {
        fields.update.push({
          name: fieldName,
          type: inputFieldType,
        });
      }

      // if field is i18nized, add foo_intl field containing all languages
      // NOTE: not necessary anymore because intl fields are added by addIntlFields() in collections.js
      // TODO: delete if not needed
      // if (isIntlField(field)) {
      //   // fields.mainType.push({
      //   //   name: `${fieldName}_intl`,
      //   //   type: '[IntlValue]',
      //   // });
      //   fields.create.push({
      //     name: `${fieldName}_intl`,
      //     type: '[IntlValueInput]',
      //   });
      //   fields.update.push({
      //     name: `${fieldName}_intl`,
      //     type: '[IntlValueInput]',
      //   });
      // }

      if (selectable) {
        fields.selector.push({
          name: fieldName,
          type: inputFieldType,
        });
      }

      if (selectable && unique) {
        fields.selectorUnique.push({
          name: fieldName,
          type: inputFieldType,
        });
      }
    }
  });

  return {
    fields,
    resolvers,
  };
};
