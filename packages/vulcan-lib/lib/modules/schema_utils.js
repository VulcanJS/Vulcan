import _reject from 'lodash/reject';
import _keys from 'lodash/keys';

/* getters */
// filter out fields with "." or "$"
export const getValidFields = schema => {
    return Object.keys(schema).filter(fieldName => !fieldName.includes('$') && !fieldName.includes('.'));
};

// NOTE: this include fields that should'n't go into the default fragment (pure virtual fields and resolved fields)
// use getFragmentFieldNames for fragments
export const getReadableFields = schema => {
    // OpenCRUD backwards compatibility
    return getValidFields(schema).filter(fieldName => schema[fieldName].canRead || schema[fieldName].viewableBy);
};

export const getCreateableFields = schema => {
    // OpenCRUD backwards compatibility
    return getValidFields(schema).filter(fieldName => schema[fieldName].canCreate || schema[fieldName].insertableBy);
};


export const getUpdateableFields = schema => {
    // OpenCRUD backwards compatibility
    return getValidFields(schema).filter(fieldName => schema[fieldName].canUpdate || schema[fieldName].editableBy);
};

// list fields that can be included in the default fragment for a schema
export const getFragmentFieldNames = ({ schema, options }) => _reject(_keys(schema), fieldName => {
    /*
   
    Exclude a field from the default fragment if
    1. it has a resolver and addOriginalField is false
    2. it has $ in its name
    3. it's not viewable (if onlyViewable option is true)
    4. it is not a reference type (typeName is undefined)
    */
    const field = schema[fieldName];
    // OpenCRUD backwards compatibility
    return (field.resolveAs && !field.resolveAs.addOriginalField) || field.typeName || fieldName.includes('$') || fieldName.includes('.') || options.onlyViewable && !(field.canRead || field.viewableBy);
});
