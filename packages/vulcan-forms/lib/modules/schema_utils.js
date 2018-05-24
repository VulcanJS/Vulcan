import SimpleSchema from 'simpl-schema';


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
      const arraySubSchema = getArraySubSchema(fieldName, schema);
      // if nested schema exists, call convertSchema recursively
      if (arraySubSchema) {
        const convertedArraySubSchema = convertSchema(arraySubSchema);
        if (flatten) {
          jsonSchema = { ...jsonSchema, ...convertedArraySubSchema };
        } else {
          jsonSchema[fieldName].schema = convertedArraySubSchema;
        }
      }

      // check if the type of this field is a nested schema
      const objectSubSchema = getObjectSubSchema(fieldName, schema);
      if (objectSubSchema) {
        let convertedObjectSubSchema = convertSchema(objectSubSchema);
        const mergedSubSchema = mergeSubSchemaWithParent(convertedObjectSubSchema, jsonSchema, fieldName);
        jsonSchema = { ...jsonSchema, ...mergedSubSchema };
        delete jsonSchema[fieldName];
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
export const getArraySubSchema = (fieldName, schema) => {
  const arrayItemSchema = schema._schema[`${fieldName}.$`];
  return arrayItemSchema && arrayItemSchema.type.definitions[0].type;
};

/*

Given an object field, get its sub schema

*/
export const getObjectSubSchema = (fieldName, schema) => {
  const objectItemSchema = schema._schema[fieldName].type.definitions[0].type;
  if (SimpleSchema.isSimpleSchema(objectItemSchema)) {
    return objectItemSchema;
  }
};

/*

Given a subschema, prefixes the field names with the parent's, and merges the parent's values
into each child (this way field properties like 'editableBy' and 'group' can be set on the parent
for all children, and can still be overridden by children.

*/
export const mergeSubSchemaWithParent = (schema, jsonSchema, parentName) => {
  const merged = {};
  for (const key in schema) {
    merged[`${parentName}.${key}`] = Object.assign({}, jsonSchema[parentName], schema[key]);
  }
  return merged;
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
  'viewableBy',
  'insertableBy',
  'editableBy',
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
