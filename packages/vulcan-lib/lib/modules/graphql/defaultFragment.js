/**
 * Generates the default fragment for a collection
 * = a fragment containing all fields
 */
import { getFragmentFieldNames } from '../schema_utils';

// get fragment for a whole object (root schema or nested schema of an object or an array)
const getObjectFragment = ({
    schema,
    fragmentName,
    options
}) => {
    const fieldNames = getFragmentFieldNames({ schema, options });
    const childFragments = fieldNames.length && fieldNames.map(fieldName => getFieldFragment({
        schema,
        fieldName,
        options
    }))
        // remove empty values
        .filter(f => !!f);
    if (childFragments.length) {
        return `${fragmentName} { ${childFragments.join('\n')} }`;
    }
    return null;
};

// get fragment for a specific field (eith the field name or a nested fragment)
const getFieldFragment = ({
    schema,
    fieldName,
    options
}) => {
    const field = schema[fieldName];

    const fieldType = field.type.singleType;
    const fieldTypeName =
        typeof fieldType === 'object' ? 'Object' : typeof fieldType === 'function' ? fieldType.name : fieldType;

    switch (fieldTypeName) {
        case 'Object':
            if (!field.blackbox && fieldType._schema) {
                return getObjectFragment({
                    fragmentName: fieldName,
                    schema: fieldType._schema,
                    options
                }) || null;
            }
            return fieldName;
        case 'Array':
            const arrayItemFieldName = `${fieldName}.$`;
            const arrayItemField = schema[arrayItemFieldName];
            // note: make sure field has an associated array item field
            if (arrayItemField) {
                // child will either be native value or a an object (first case)
                const arrayItemFieldType = arrayItemField.type.singleType;
                if (!arrayItemField.blackbox && arrayItemFieldType._schema) {
                    return getObjectFragment({
                        fragmentName: fieldName,
                        schema: arrayItemFieldType._schema,
                        options
                    }) || null;
                }
            }
            return fieldName;
        default:
            return fieldName; // fragment = fieldName
    }
};

/*

Create default "dumb" gql fragment object for a given collection

*/
export const getDefaultFragmentText = (collection, options = { onlyViewable: true }) => {
    const schema = collection.simpleSchema()._schema;
    return getObjectFragment({
        schema,
        fragmentName: `fragment ${collection.options.collectionName}DefaultFragment on ${collection.typeName}`,
        options
    }) || null;
};

export default getDefaultFragmentText;