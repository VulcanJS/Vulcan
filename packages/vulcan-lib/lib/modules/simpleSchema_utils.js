/**
 * Helpers for Simple Schema
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


export const isBlackbox = (field) => field.type.definitions[0].blackbox;


export const getArrayChild = (fieldName, schema) => schema[`${fieldName}.$`];

export const getNestedSchema = field => field.type.singleType._schema;