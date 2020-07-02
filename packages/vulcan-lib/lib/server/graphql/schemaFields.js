
/*
/**
 * Generate graphQL for Vulcan schema fields
import { isIntlField } from '../../modules/intl.js';
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

        // unless addOriginalField option is disabled in one or more fields, also add original field to schema
        const addOriginalField = resolveAsArray.every(resolveAs => resolveAs.addOriginalField !== false);
        // note: do not add original field if resolved field has same name
        if (addOriginalField && fieldType && field.resolveAs.fieldName && field.resolveAs.fieldName !== fieldName) {
          fields.mainType.push({
            description: fieldDescription,
            name: fieldName,
            args: fieldArguments,
            type: fieldType,
            directive: fieldDirective,
          });
        }

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

*/
/**
 * Generate graphQL types for the fields of a Vulcan schema
 */
/* eslint-disable no-console */
import { isIntlField, isIntlDataField } from '../../modules/intl.js';
import { isBlackbox, isArrayChildField, unarrayfyFieldName, getFieldType, getFieldTypeName, getArrayChild, getNestedSchema } from '../../modules/simpleSchema_utils';
import { shouldAddOriginalField } from '../../modules/schema_utils';
import relations from './relations.js';
import { getGraphQLType } from '../../modules/graphql/utils';

const capitalize = word => {
  if (!word) return word;
  const [first, ...rest] = word;
  return [first.toUpperCase(), ...rest].join('');
};

// get GraphQL type for a nested object (<MainTypeName><FieldName> e.g PostAuthor, EventAdress, etc.)
export const getNestedGraphQLType = (typeName, fieldName, isInput) =>
  `${typeName}${capitalize(unarrayfyFieldName(fieldName))}${isInput ? 'Input' : ''}`;

// NOTE: now lives in modules/graphql/utils.js so that it can be shared with client
// TODO: clean up
// get GraphQL type for a given schema and field name
// export const getGraphQLType = ({ schema, fieldName, typeName, isInput = false, isParentBlackbox = false }) => {
//   const field = schema[fieldName];

//   if (field.typeName) return field.typeName; // respect typeName provided by user

//   const fieldType = getFieldType(field);
//   const fieldTypeName = getFieldTypeName(fieldType);

//   // NOTE: we DON't USE isInputField! we don't want to match "field.intl", only "field.intlData"
//   /**
//    * Expected GraphQL Schema:
//    * 
//    *   # The room name
//   * name(locale: String): String @intl
//   * # The room name
//   * name_intl(locale: String): [IntlValue] @intl
//   * 
//   * JS schema:
//   * 
//   * name: {
//   *   type: String,
//   *   optional: false,
//   *   canRead: ['guests'],
//   *   canCreate: ['admins'],
//   *   intl: true,
//   * },
//    */
//   if (field.isIntlData) {
//     return isInput ? '[IntlValueInput]' : '[IntlValue]';
//   }

//   switch (fieldTypeName) {
//     case 'String':
//       /*
//       Getting Enums from allowed values is counter productive because enums syntax is limited
//       @see https://github.com/VulcanJS/Vulcan/issues/2332
//       if (hasAllowedValues(field) && isValidEnum(getAllowedValues(field))) {
//         return getEnumType(typeName, fieldName);
//       }*/
//       return 'String';

//     case 'Boolean':
//       return 'Boolean';

//     case 'Number':
//       return 'Float';

//     case 'SimpleSchema.Integer':
//       return 'Int';

//     // for arrays, look for type of associated schema field or default to [String]
//     case 'Array':
//       const arrayItemFieldName = `${fieldName}.$`;
//       // note: make sure field has an associated array
//       if (schema[arrayItemFieldName]) {
//         // try to get array type from associated array
//         const arrayItemType = getGraphQLType({
//           schema,
//           fieldName: arrayItemFieldName,
//           typeName,
//           isInput,
//           isParentBlackbox: isParentBlackbox || isBlackbox(field) // blackbox field may not be nested items
//         });
//         return arrayItemType ? `[${arrayItemType}]` : null;
//       }
//       return null;

//     case 'Object':
//       // 4 cases: 
//       // - it's the child of a blackboxed array  => will be blackbox JSON
//       // - a nested Schema, 
//       // - a referenced schema, or an actual JSON
//       if (isParentBlackbox) return 'JSON';
//       if (!isBlackbox(field) && fieldType._schema) {
//         return getNestedGraphQLType(typeName, fieldName, isInput);
//       }

//       // referenced Schema
//       if (/*field.type.definitions[0].blackbox && */field.typeName && field.typeName !== 'JSON') {
//         return isInput ? field.typeName + 'Input' : field.typeName;
//       }
//       // blackbox JSON object
//       return 'JSON';
//     case 'Date':
//       return 'Date';

//     default:
//       return null;
//   }
// };

//const isObject = field => getFieldTypeName(getFieldType(field));
const hasTypeName = field => !!(field || {}).typeName;

const hasNestedSchema = field => !!getNestedSchema(field);

const hasArrayChild = (fieldName, schema) => !!getArrayChild(fieldName, schema);

const getArrayChildSchema = (fieldName, schema) => {
  return getNestedSchema(getArrayChild(fieldName, schema));
};
const hasArrayNestedChild = (fieldName, schema) =>
  hasArrayChild(fieldName, schema) && !!getArrayChildSchema(fieldName, schema);

//const getArrayChildTypeName = (fieldName, schema) =>
//  (getArrayChild(fieldName, schema) || {}).typeName;
//const hasArrayReferenceChild = (fieldName, schema) =>
//  hasArrayChild(fieldName, schema) && !!getArrayChildTypeName(fieldName, schema);

const hasPermissions = field => field.canRead || field.canCreate || field.canUpdate;
const hasLegacyPermissions = field => {
  const hasLegacyPermissions = field.viewableBy || field.insertableBy || field.editableBy;
  if (hasLegacyPermissions)
    console.warn(
      'Some field is using legacy permission fields viewableBy, insertableBy and editableBy. Please replace those fields with canRead, canCreate and canUpdate.'
    );
  return hasLegacyPermissions;
};

// Generate GraphQL fields and resolvers for a field with a specific resolveAs
// resolveAs allow to generate "virtual" fields that are queryable in GraphQL but does not exist in the database
export const getResolveAsFields = ({
  typeName,
  field,
  fieldName,
  fieldType,
  fieldDescription,
  fieldDirective,
  fieldArguments,
}) => {
  const fields = {
    mainType: [],
  };
  const resolvers = [];

  const resolveAsArray = Array.isArray(field.resolveAs) ? field.resolveAs : [field.resolveAs];

  // check if original (main schema) field should be added to GraphQL schema
  const addOriginalField = shouldAddOriginalField(fieldName, field);
  if (addOriginalField) {
    fields.mainType.push({
      description: fieldDescription,
      name: fieldName,
      args: fieldArguments,
      type: fieldType,
      directive: fieldDirective,
    });
  }

  resolveAsArray.forEach(resolveAs => {
    // get resolver name from resolveAs object, or else default to field name
    const resolverName = resolveAs.fieldName || fieldName;

    // use specified GraphQL type or else convert schema type
    const fieldGraphQLType = resolveAs.typeName || resolveAs.type || fieldType;

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
            } else if (relation) {
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
  });
  return { fields, resolvers };
};

// [Foo] => [CreateFoo]
const prefixType = (prefix, type) => {
  if (!(type && type.length)) return type;
  if (type[0] === '[') return `[${prefix}${type.slice(1, -1)}]`;
  return prefix + type;
};
// [Foo] => [FooDataDinput]
const suffixType = (type, suffix) => {
  if (!(type && type.length)) return type;
  if (type[0] === '[') return `[${type.slice(1, -1)}${suffix}]`;
  return type + suffix;
};
// handle querying/updating permissions
export const getPermissionFields = ({
  field,
  fieldName,
  fieldType,
  inputFieldType,
  hasNesting = false,
}) => {
  const fields = {
    create: [],
    update: [],
    selector: [],
    selectorUnique: [],
    sort: [],
    readable: [],
    filterable: [],
  };
  const {
    canRead,
    canCreate,
    canUpdate,
    viewableBy,
    insertableBy,
    editableBy,
    selectable,
    unique,
    apiOnly,
  } = field;
  const createInputFieldType = hasNesting
    ? suffixType(prefixType('Create', fieldType), 'DataInput')
    : inputFieldType;
  const updateInputFieldType = hasNesting
    ? suffixType(prefixType('Update', fieldType), 'DataInput')
    : inputFieldType;

  // if field is readable, make it filterable/orderable too
  if (canRead || viewableBy) {
    fields.readable.push({
      name: fieldName,
      type: fieldType,
    });
    // we can only filter based on fields that actually exist in the db
    if (!apiOnly) {
      fields.filterable.push({
        name: fieldName,
        type: fieldType,
      });
    }
  }

  // OpenCRUD backwards compatibility
  if (canCreate || insertableBy) {
    fields.create.push({
      name: fieldName,
      type: createInputFieldType,
      required: !field.optional,
    });
  }
  // OpenCRUD backwards compatibility
  if (canUpdate || editableBy) {
    fields.update.push({
      name: fieldName,
      type: updateInputFieldType,
    });
  }

  // if field is i18nized, add foo_intl field containing all languages
  // NOTE: not necessary anymore because intl fields are added by addIntlFields() in collections.js
  // TODO: delete if not needed
  // if (isIntlField(field)) {
  //   // fields.mainType.push({
  //   //   name: `${ fieldName } _intl`,
  //   //   type: '[IntlValue]',
  //   // });
  //   fields.create.push({
  //     name: `${ fieldName } _intl`,
  //     type: '[IntlValueInput]',
  //   });
  //   fields.update.push({
  //     name: `${ fieldName } _intl`,
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

  return fields;
};

// for a given schema, return main type fields, selector fields,
// unique selector fields, sort fields, creatable fields, and updatable fields
export const getSchemaFields = (schema, typeName) => {
  if (!schema) console.log('/////////////////////', typeName, '/////////////////////');
  const fields = {
    mainType: [],
    create: [],
    update: [],
    selector: [],
    selectorUnique: [],
    sort: [],
    enums: [],
    readable: [],
    filterable: [],
  };
  const nestedFieldsList = [];
  const resolvers = [];

  Object.keys(schema).forEach(fieldName => {
    const field = schema[fieldName];
    const fieldType = getGraphQLType({ schema, fieldName, typeName });
    const inputFieldType = getGraphQLType({ schema, fieldName, typeName, isInput: true });

    // find types that have a nested schema or have a reference to antoher type
    const isNestedObject = hasNestedSchema(field);
    // note: intl fields are an exception and are not considered as nested
    const isNestedArray =
      hasArrayNestedChild(fieldName, schema) && hasNestedSchema(getArrayChild(fieldName, schema)) && !isIntlField(field) && !isIntlDataField(field);
    const isReferencedObject = hasTypeName(field);
    const isReferencedArray = hasTypeName(getArrayChild(fieldName, schema));
    const hasNesting = !isBlackbox(field) && (isNestedArray || isNestedObject || isReferencedObject || isReferencedArray);

    // only include fields that are viewable/insertable/editable and don't contain "$" in their name
    // note: insertable/editable fields must be included in main schema in case they're returned by a mutation
    // OpenCRUD backwards compatibility
    if ((hasPermissions(field) || hasLegacyPermissions(field)) && !isArrayChildField(fieldName)) {
      const fieldDescription = field.description;
      const fieldDirective = isIntlField(field) ? '@intl' : '';
      const fieldArguments = isIntlField(field) ? [{ name: 'locale', type: 'String' }] : [];

      // if field has a resolveAs, push it to schema
      if (field.resolveAs) {
        const { fields: resolveAsFields, resolvers: resolveAsResolvers } = getResolveAsFields({
          typeName,
          field,
          fieldName,
          fieldType,
          fieldDescription,
          fieldDirective,
          fieldArguments,
        });
        resolvers.push(...resolveAsResolvers);
        fields.mainType.push(...resolveAsFields.mainType);
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

      // Support for enums from allowedValues has been removed (counter-productive)
      // if field has allowedValues, add enum type
      /*if (hasAllowedValues(field)) {
        const allowedValues = getAllowedValues(field);
        // TODO: we can't force value creation
        //if (!isValidEnum(allowedValues)) throw new Error(`Allowed values of field ${ fieldName } can not be used as enum.
        //One or more values are not respecting the Name regex`)
 
        // ignore arrays containing invalid values
        if (isValidEnum(allowedValues)) {
          fields.enums.push({//
            allowedValues,
            typeName: getEnumType(typeName, fieldName)
          });
        } else {
          console.warn(`Warning: Allowed values of field ${fieldName} can not be used as GraphQL Enum. One or more values are not respecting the Name regex.Consider normalizing allowedValues and using separate labels for displaying.`);
        }
      } 
      */

      const permissionsFields = getPermissionFields({
        field,
        fieldName,
        fieldType,
        inputFieldType,
        hasNesting,
      });
      fields.create.push(...permissionsFields.create);
      fields.update.push(...permissionsFields.update);
      fields.selector.push(...permissionsFields.selector);
      fields.selectorUnique.push(...permissionsFields.selectorUnique);
      fields.sort.push(...permissionsFields.sort);
      fields.readable.push(...permissionsFields.readable);
      fields.filterable.push(...permissionsFields.filterable);

      // check for nested fields if the field does not reference an existing type
      if (!field.typeName && isNestedObject) {
        // TODO: reuse addTypeAndResolver on the nested schema instead?
        //console.log('detected a nested field', fieldName);
        const nestedSchema = getNestedSchema(field);
        const nestedTypeName = getNestedGraphQLType(typeName, fieldName);
        //const nestedInputTypeName = `${ nestedTypeName }Input`;
        const nestedFields = getSchemaFields(nestedSchema, nestedTypeName);
        // add the generated typeName to the info
        nestedFields.typeName = nestedTypeName;
        //nestedFields.inputTypeName = nestedInputTypeName;
        nestedFieldsList.push(nestedFields);
      }
      // check if field is an array of objects if the field does not reference an existing type
      if (isNestedArray && !getArrayChild(fieldName, schema).typeName) {
        // TODO: reuse addTypeAndResolver on the nested schema instead?
        //console.log('detected a field with an array child', fieldName);
        const arrayNestedSchema = getArrayChildSchema(fieldName, schema);
        const arrayNestedTypeName = getNestedGraphQLType(typeName, fieldName);
        const arrayNestedFields = getSchemaFields(arrayNestedSchema, arrayNestedTypeName);
        // add the generated typeName to the info
        arrayNestedFields.typeName = arrayNestedTypeName;
        nestedFieldsList.push(arrayNestedFields);
      }
    }
  });
  return {
    fields,
    nestedFieldsList,
    resolvers,
  };
};

export default getSchemaFields;
