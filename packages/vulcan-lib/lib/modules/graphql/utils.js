import { Utils } from '../utils';
import { isBlackbox, unarrayfyFieldName, getFieldType, getFieldTypeName } from '../simpleSchema_utils';

export const getGraphQLType = ({ fieldSchema, schema, fieldName, typeName, isInput = false, isParentBlackbox = false }) => {
  const field = fieldSchema || schema[fieldName];

  if (field.typeName) return field.typeName; // respect typeName provided by user

  const fieldType = getFieldType(field);
  const fieldTypeName = getFieldTypeName(fieldType);

  // NOTE: we DON't USE isInputField! we don't want to match "field.intl", only "field.intlData"
  /**
   * Expected GraphQL Schema:
   * 
   *   # The room name
  * name(locale: String): String @intl
  * # The room name
  * name_intl(locale: String): [IntlValue] @intl
  * 
  * JS schema:
  * 
  * name: {
  *   type: String,
  *   optional: false,
  *   canRead: ['guests'],
  *   canCreate: ['admins'],
  *   intl: true,
  * },
   */
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
          isParentBlackbox: isParentBlackbox || isBlackbox(field) // blackbox field may not be nested items
        });
        return arrayItemType ? `[${arrayItemType}]` : null;
      }
      return null;

    case 'Object':
      // 4 cases: 
      // - it's the child of a blackboxed array  => will be blackbox JSON
      // - a nested Schema, 
      // - a referenced schema, or an actual JSON
      if (isParentBlackbox) return 'JSON';
      if (!isBlackbox(field) && fieldType._schema) {
        return getNestedGraphQLType(typeName, fieldName, isInput);
      }

      // referenced Schema
      if (/*field.type.definitions[0].blackbox && */field.typeName && field.typeName !== 'JSON') {
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


// get GraphQL type for a nested object (<MainTypeName><FieldName> e.g PostAuthor, EventAdress, etc.)
export const getNestedGraphQLType = (typeName, fieldName, isInput) =>
  `${typeName}${Utils.capitalize(unarrayfyFieldName(fieldName))}${isInput ? 'Input' : ''}`;
