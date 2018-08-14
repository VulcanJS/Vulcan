/*

Convert a nested SimpleSchema schema into a JSON object
If flatten = true, will create a flat object instead of nested tree

*/
export const convertSchema = (schema, flatten = false) => {
  if (schema._schema) {
    let jsonSchema = {};

    Object.keys(schema._schema).forEach(fieldName => {
      // exclude array fields
      if (fieldName.includes('$')) {
        return;
      }

      // extract schema
      jsonSchema[fieldName] = getFieldSchema(fieldName, schema);

      // check for existence of nested schema
      const subSchema = getNestedSchema(fieldName, schema);
      // if nested schema exists, call convertSchema recursively
      if (subSchema) {
        const convertedSubSchema = convertSchema(subSchema);
        if (flatten) {
          jsonSchema = { ...jsonSchema, ...convertedSubSchema };
        } else {
          jsonSchema[fieldName].schema = convertedSubSchema;
        }
      }
    });
    return jsonSchema;
  } else {
    return null;
  }
};

/*

Get a JSON object representing a field's schema

*/
export const getFieldSchema = (fieldName, schema) => {
  let fieldSchema = {};
  schemaProperties.forEach(property => {
    const propertyValue = schema.get(fieldName, property);
    if (propertyValue) {
      fieldSchema[property] = propertyValue;
    }
  });
  return fieldSchema;
};


// type is an array due to the possibility of using SimpleSchema.oneOf
// right now we support only fields with one type
export const getSchemaType = schema => schema.type.definitions[0].type
const getArrayNestedSchema = (fieldName, schema) => {
  const arrayItemSchema = schema._schema[`${fieldName}.$`];
  const nestedSchema = arrayItemSchema && getSchemaType(arrayItemSchema)
  return nestedSchema
}
// nested object fields type is of the form "type: new SimpleSchema({...})"
// so they should possess a "_schema" prop
const isNestedSchemaField = (fieldSchema) => {
  const fieldType = getSchemaType(fieldSchema)
  //console.log('fieldType', typeof fieldType, fieldType._schema)
  return fieldType && !!fieldType._schema
}
const getObjectNestedSchema = (fieldName, schema) => {
  const fieldSchema = schema._schema[fieldName]
  if (!isNestedSchemaField(fieldSchema)) return null
  const nestedSchema = fieldSchema && getSchemaType(fieldSchema)
  return nestedSchema
}
/*

Given an array field, get its nested schema

*/
export const getNestedSchema = (fieldName, schema) => {
  const arrayItemSchema = getArrayNestedSchema(fieldName, schema)
  if (!arrayItemSchema) {
    // look for an object schema
    const objectItemSchema = getObjectNestedSchema(fieldName, schema)
    // no schema was found
    if (!objectItemSchema) return null
    return objectItemSchema
  }
  return arrayItemSchema
};

export const schemaProperties = [
  'type',
  'label',
  'optional',
  'required',
  'min',
  'max',
  'exclusiveMin',
  'exclusiveMax',
  'minCount',
  'maxCount',
  'allowedValues',
  'regEx',
  'blackbox',
  'trim',
  'custom',
  'defaultValue',
  'autoValue',
  'hidden', // hidden: true means the field is never shown in a form no matter what
  'mustComplete', // mustComplete: true means the field is required to have a complete profile
  'profile', // profile: true means the field is shown on user profiles
  'form', // form placeholder
  'inputProperties', // form placeholder
  'control', // SmartForm control (String or React component)
  'input', // SmartForm control (String or React component)
  'autoform', // legacy form placeholder; backward compatibility (not used anymore)
  'order', // position in the form
  'group', // form fieldset group
  'onInsert', // field insert callback
  'onEdit', // field edit callback
  'onRemove', // field remove callback
  'canRead',
  'canCreate',
  'canUpdate',
  'viewableBy', // OpenCRUD backwards compatibility
  'insertableBy', // OpenCRUD backwards compatibility
  'editableBy', // OpenCRUD backwards compatibility
  'resolveAs',
  'searchable',
  'description',
  'beforeComponent',
  'afterComponent',
  'placeholder',
  'options',
  'query',
  'fieldProperties',
];

export const formProperties = [
  'optional',
  'required',
  'min',
  'max',
  'exclusiveMin',
  'exclusiveMax',
  'minCount',
  'maxCount',
  'allowedValues',
  'regEx',
  'blackbox',
  'trim',
  'custom',
  'defaultValue',
  'autoValue',
  'mustComplete', // mustComplete: true means the field is required to have a complete profile
  'form', // form placeholder
  'inputProperties', // form placeholder
  'control', // SmartForm control (String or React component)
  'input', // SmartForm control (String or React component)
  'order', // position in the form
  'group', // form fieldset group
  'description',
  'beforeComponent',
  'afterComponent',
  'placeholder',
  'options',
  'query',
  'fieldProperties',
];
