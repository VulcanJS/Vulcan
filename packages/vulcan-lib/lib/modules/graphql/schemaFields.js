/**
 * Generate graphQL types for the fields of a Vulcan schema
 */
/* eslint-disable no-console */
import { isIntlField } from '../intl.js';
import { /*hasAllowedValues, getAllowedValues,*/ unarrayfyFieldName } from '../simpleSchema_utils';

const capitalize = word => {
  if (!word) return word;
  const [first, ...rest] = word;
  return [first.toUpperCase(), ...rest].join('');
};

// get GraphQL type for a nested object (<MainTypeName><FieldName> e.g PostAuthor, EventAdress, etc.)
export const getNestedGraphQLType = (typeName, fieldName, isInput) =>
  `${typeName}${capitalize(unarrayfyFieldName(fieldName))}${isInput ? 'Input' : ''}`;

// @see https://graphql.github.io/graphql-spec/June2018/#sec-Enums
// @see https://graphql.github.io/graphql-spec/June2018/#sec-Names
/*
const isValidName = name => {
  if (typeof name !== 'string') {
    throw new Error(
      `Allowed value of field of type String is not a string (value: ${name}, type:${typeof name})`
    );
  }
  return name.match(/^[_A-Za-z][_0-9A-Za-z]*$/);
};
*/
// const isValidEnum = values => !values.find(val => !isValidName(val));

// export const getEnumType = (typeName, fieldName) => `${typeName}${capitalize(unarrayfyFieldName(fieldName))}Enum`;

const getFieldType = field => field.type.singleType;
const getFieldTypeName = fieldType =>
  typeof fieldType === 'object'
    ? 'Object'
    : typeof fieldType === 'function'
    ? fieldType.name
    : fieldType;

// get GraphQL type for a given schema and field name
export const getGraphQLType = ({ schema, fieldName, typeName, isInput = false }) => {
  const field = schema[fieldName];
  if (field.typeName) return field.typeName; // respect typeName provided by user

  const fieldType = getFieldType(field);
  const fieldTypeName = getFieldTypeName(fieldType);

  if (field.isIntlData) {
    return isInput ? '[IntlValueInput]' : '[IntlValue]';
  }

  switch (fieldTypeName) {
    case 'String':
      /*
      Getting Enums from allowed values is counter productive because enums syntax is limited
      @see https://github.com/VulcanJS/Vulcan/issues/2332
      if (hasAllowedValues(field) && isValidEnum(getAllowedValues(field))) {
        return getEnumType(typeName, fieldName);
      }*/
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
          typeName,
          isInput,
        });
        return arrayItemType ? `[${arrayItemType}]` : null;
      }
      return null;

    case 'Object':
      // 3 cases: it's a nested Schema, a referenced schema, or an actual JSON
      if (!field.blackbox && fieldType._schema) {
        return getNestedGraphQLType(typeName, fieldName, isInput);
      }
      // referenced Schema
      if (field.type.definitions[0].blackbox && field.typeName) {
        return isInput ? field.typeName + 'Input' : field.typeName;
      }
      // blackbox JSON object
      return 'JSON';
    case 'Date':
      return 'Date';

    default:
      return null;
  }
};

//const isObject = field => getFieldTypeName(getFieldType(field));
const hasTypeName = field => !!(field || {}).typeName;

const hasNestedSchema = field => !!getNestedSchema(field);
const getNestedSchema = field => field.type.singleType._schema;

const isArrayChildField = fieldName => fieldName.indexOf('$') !== -1;
const getArrayChild = (fieldName, schema) => schema[`${fieldName}.$`];
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
        return canReadField ? field.resolveAs.resolver(document, args, context, info) : null;
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
    orderBy: [],
  };
  const createInputFieldType = hasNesting
    ? suffixType(prefixType('Create', fieldType), 'DataInput')
    : inputFieldType;
  const updateInputFieldType = hasNesting
    ? suffixType(prefixType('Update', fieldType), 'DataInput')
    : inputFieldType;

  // OpenCRUD backwards compatibility
  if (field.canCreate || field.insertableBy) {
    fields.create.push({
      name: fieldName,
      type: createInputFieldType,
      required: !field.optional,
    });
  }
  // OpenCRUD backwards compatibility
  if (field.canUpdate || field.editableBy) {
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
  if (!schema) console.log('/////////////////////', typeName, '/////////////////////');
  const fields = {
    mainType: [],
    create: [],
    update: [],
    selector: [],
    selectorUnique: [],
    orderBy: [],
    enums: [],
  };
  const nestedFieldsList = [];
  const resolvers = [];

  Object.keys(schema).forEach(fieldName => {
    const field = schema[fieldName];
    const fieldType = getGraphQLType({ schema, fieldName, typeName });
    const inputFieldType = getGraphQLType({ schema, fieldName, typeName, isInput: true });

    // ignore fields that already have a typeName
    const isNestedObject = hasNestedSchema(field);
    const isNestedArray =
      hasArrayNestedChild(fieldName, schema) && hasNestedSchema(getArrayChild(fieldName, schema));
    const isReferencedObject = hasTypeName(field);
    const isReferencedArray = hasTypeName(getArrayChild(fieldName, schema));
    const hasNesting = isNestedArray || isNestedObject || isReferencedObject || isReferencedArray;

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
      fields.orderBy.push(...permissionsFields.orderBy);

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
