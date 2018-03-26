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

      // check for existence of nested schema on corresponding array field
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

/*

Given an array field, get its nested schema

*/
export const getNestedSchema = (fieldName, schema) => {
  const arrayItemSchema = schema._schema[`${fieldName}.$`];
  const nestedSchema = arrayItemSchema && arrayItemSchema.type.definitions[0].type;
  return nestedSchema;
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
  'private',
  'editable', // editable: true means the field can be edited by the document's owner
  'hidden', // hidden: true means the field is never shown in a form no matter what
  'mustComplete', // mustComplete: true means the field is required to have a complete profile
  'profile', // profile: true means the field is shown on user profiles
  'template', // legacy template used to display the field; backward compatibility (not used anymore)
  'form', // form placeholder
  'autoform', // legacy form placeholder; backward compatibility (not used anymore)
  'control', // SmartForm control (String or React component)
  'order', // position in the form
  'group', // form fieldset group
  'onInsert', // field insert callback
  'onEdit', // field edit callback
  'onRemove', // field remove callback
  'viewableBy',
  'insertableBy',
  'editableBy',
  'resolveAs',
  'limit',
  'searchable',
  'default',
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
  'control', // SmartForm control (String or React component)
  'order', // position in the form
  'group', // form fieldset group
  'limit',
  'default',
  'description',
  'beforeComponent',
  'afterComponent',
  'placeholder',
  'options',
  'query',
  'fieldProperties',
];
