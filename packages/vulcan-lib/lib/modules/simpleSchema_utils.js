/**
 * Helpers specific to Simple Schema
 * See "schema_utils" for more generic methods
*/

// remove ".$" at the end of array child fieldName
export const unarrayfyFieldName = (fieldName) => {
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


export const isArrayChildField = fieldName => fieldName.indexOf('$') !== -1;
export const isBlackbox = (field) => !!field.type.definitions[0].blackbox;
//export const isBlackbox = (fieldName, schema) => {
//    const field = schema[fieldName];
//    // for array field, check parent recursively to find a blackbox
//    if (isArrayChildField(fieldName)) {
//        const parentField = schema[fieldName.slice(0, -2)];
//        return isBlackbox(parentField);
//    }
//    return field.type.definitions[0].blackbox;
//};

export const getFieldType = field => field.type.singleType || field.type[0].type;
export const getFieldTypeName = fieldType =>
    typeof fieldType === 'object'
        ? 'Object'
        : typeof fieldType === 'function'
            ? fieldType.name
            : fieldType;

export const getArrayChild = (fieldName, schema) => schema[`${fieldName}.$`];

export const getNestedSchema = field => field.type.singleType._schema;

