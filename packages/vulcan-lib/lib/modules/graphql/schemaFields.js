/**
 * Generate graphQL types for the fields of a Vulcan schema
 */
import { isIntlField } from '../intl.js';

const capitalize = (word) => {
  if (!word) return word;
  const [first, ...rest] = word;
  return [first.toUpperCase(), ...rest].join('');
};
// remove ".$" at the end of array child fieldName
const unarrayfy = (fieldName) => {
  return fieldName ? fieldName.split('.')[0] : fieldName;
};

// allowed values of a field if present
export const getAllowedValues = (field) => field.type.definitions[0].allowedValues;
export const hasAllowedValues = field => {
  const allowedValues = getAllowedValues(field);
  if (allowedValues && !allowedValues.length) {
    console.warn(`Field ${field} as empty allowed values`);
    return false;
  }
  return !!allowedValues;
};


// get GraphQL type for a nested object (<MainTypeName><FieldName> e.g PostAuthor, EventAdress, etc.)
export const getNestedGraphQLType = (typeName, fieldName) => `${typeName}${capitalize(unarrayfy(fieldName))}`;

export const getEnumType = (typeName, fieldName) => `${typeName}${capitalize(unarrayfy(fieldName))}Enum`;


// get GraphQL type for a given schema and field name
export const getGraphQLType = ({
  schema,
  fieldName,
  typeName,
  isInput = false
}) => {
  const field = schema[fieldName];

  const fieldType = field.type.singleType;
  const fieldTypeName =
    typeof fieldType === 'object' ? 'Object' : typeof fieldType === 'function' ? fieldType.name : fieldType;
  console.log('type', '\n', field.type.definitions[0].type, '\n');

  if (field.isIntlData) {
    return isInput ? '[IntlValueInput]' : '[IntlValue]';
  }

  switch (fieldTypeName) {
    case 'String':
      if (hasAllowedValues(field)) {
        return getEnumType(typeName, fieldName);
      }
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
        const arrayItemType = getGraphQLType({
          schema,
          fieldName: arrayItemFieldName,
          typeName
        });
        return arrayItemType ? `[${arrayItemType}]` : null;
      }
      return null;

    case 'Object':
      // 2 cases: it's an actual JSON or a nested schema
      if (!field.blackbox && fieldType._schema) {
        return getNestedGraphQLType(typeName, fieldName);
      }
      // blackbox JSON object
      return 'JSON';
    case 'Date':
      return 'Date';

    default:
      return null;
  }
};

const isNestedObjectField = (field) => !!getNestedSchema(field);
const getNestedSchema = field => field.type.singleType._schema;

const isArrayChildField = (fieldName) => fieldName.indexOf('$') !== -1;
const getArrayChild = (fieldName, schema) => schema[`${fieldName}.$`];
const hasArrayChild = (fieldName, schema) => !!getArrayChild(fieldName, schema);

const getArrayChildSchema = (fieldName, schema) => {
  return getNestedSchema(getArrayChild(fieldName, schema));
};
const hasArrayNestedChild = (fieldName, schema) => hasArrayChild(fieldName, schema) && !!getArrayChildSchema(fieldName, schema);

const hasPermissions = field => (
  field.canRead || field.canCreate || field.canUpdate
);
const hasLegacyPermissions = field => {
  const hasLegacyPermissions = field.viewableBy || field.insertableBy || field.editableBy;
  if (hasLegacyPermissions) console.warn('Some field is using legacy permission fields viewableBy, insertableBy and editableBy. Please replace those fields with canRead, canCreate and canUpdate.');
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
      [resolverName]: (document, args, context, info) => {
        const { Users, currentUser } = context;
        // check that current user has permission to access the original non-resolved field
        const canReadField = Users.canReadField(currentUser, field, document);
        return canReadField
          ? field.resolveAs.resolver(document, args, context, info)
          : null;
      },
    },
  };
  resolvers.push(resolver);

  // if addOriginalField option is enabled, also add original field to schema
  if (fieldType && field.resolveAs.addOriginalField) {
    fields.mainType.push({
      description: fieldDescription,
      name: fieldName,
      args: fieldArguments,
      type: fieldType,
      directive: fieldDirective,
    });
  }
  return fields;
};

// handle querying/updating permissions
export const getPermissionFields = ({
  field,
  fieldName,
  inputFieldType,
}) => {
  const fields = {
    create: [],
    update: [],
    selector: [],
    selectorUnique: [],
    orderBy: [],
  };
  // OpenCRUD backwards compatibility
  if (field.canCreate || field.insertableBy) {
    fields.create.push({
      name: fieldName,
      type: inputFieldType,
      required: !field.optional,
    });
  }
  // OpenCRUD backwards compatibility
  if (field.canUpdate || field.editableBy) {
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

  if (field.selectable) {
    fields.selector.push({
      name: fieldName,
      type: inputFieldType,
    });
  }

  if (field.selectable && field.unique) {
    fields.selectorUnique.push({
      name: fieldName,
      type: inputFieldType,
    });
  }

  if (field.orderable) {
    fields.orderBy.push(fieldName);
  }
  return fields;
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
  };
  const nestedFieldsList = [];
  const enumFieldsList = [];
  const resolvers = [];

  Object.keys(schema).forEach(fieldName => {
    const field = schema[fieldName];
    const fieldType = getGraphQLType({ schema, fieldName, typeName });
    const inputFieldType = getGraphQLType({ schema, fieldName, typeName, isInput: true });

    // only include fields that are viewable/insertable/editable and don't contain "$" in their name
    // note: insertable/editable fields must be included in main schema in case they're returned by a mutation
    // OpenCRUD backwards compatibility
    if (
      (hasPermissions(field) || hasLegacyPermissions(field)) && !isArrayChildField(fieldName)
    ) {
      const fieldDescription = field.description;
      const fieldDirective = isIntlField(field) ? '@intl' : '';
      const fieldArguments = isIntlField(field) ? [{ name: 'locale', type: 'String' }] : [];

      // if field has a resolveAs, push it to schema
      if (field.resolveAs) {
        const resolveAsFields = getResolveAsFields({
          typeName, field, fieldName, fieldType, fieldDescription, fieldDirective, fieldArguments
        });
        resolvers.concat(resolveAsFields.resolvers);
        fields.mainType.concat(resolveAsFields.mainType);
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

      // if field has allowedValues, add enum type
      if (hasAllowedValues(field)) {
        console.log('field', fieldName, 'has  allowed values', getAllowedValues(field));
        enumFieldsList.push({
          allowedValues: getAllowedValues(field),
          typeName: getEnumType(typeName, fieldName)
        });
      }

      const permissionsFields = getPermissionFields({ field, fieldName, inputFieldType });
      fields.create.concat(permissionsFields.create);
      fields.update.concat(permissionsFields.update);
      fields.selector.concat(permissionsFields.selector);
      fields.selectorUnique.concat(permissionsFields.selectorUnique);
      fields.orderBy.concat(permissionsFields.orderBy);

      // check for nested fields
      if (isNestedObjectField(field)) {
        //console.log('detected a nested field', fieldName);
        const nestedSchema = getNestedSchema(field);
        const nestedTypeName = getNestedGraphQLType(typeName, fieldName);
        const nestedFields = getSchemaFields(nestedSchema, nestedTypeName);
        // add the generated typeName to the info
        nestedFields.typeName = nestedTypeName;
        nestedFieldsList.push(nestedFields);
      }
      // check if field is an array of objects
      if (hasArrayNestedChild(fieldName, schema)) {
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
    enumFieldsList,
    resolvers
  };
};

export default getSchemaFields;