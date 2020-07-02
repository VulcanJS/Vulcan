/**
 * Generate mutation and query fragments for a form based on the schema
 * TODO: refactor to mutualize more code with vulcan-core defaultFragment functions
 * TODO: move to lib when refactored
 */
import _uniq from 'lodash/uniq';
import _intersection from 'lodash/intersection';
import gql from 'graphql-tag';
import {
    getCreateableFields,
    getUpdateableFields,
    getFragmentFieldNames,
    //isBlackbox,
    getFieldFragment
} from 'meteor/vulcan:lib';
import {
    Utils,
} from 'meteor/vulcan:core';
const intlSuffix = '_intl';

// PostsEditFormQueryFragment/PostsNewFormMutationFragment/etc.
const getFragmentName = (formType, collectionName, fragmentType) => 
  [collectionName, formType, 'form', fragmentType, 'fragment'].map(Utils.capitalize).join('');

// get modifiable fields in the query either for update or create operations
const getQueryFieldNames = ({
    schema,
    options
}) => {
    const queryFields = options.formType === 'new'
        ? getCreateableFields(schema)
        : getUpdateableFields(schema);
    return queryFields;
};
// add readable fields to mutation fields
const getMutationFieldNames = ({
    readableFieldNames,
    queryFieldNames
}) => {
    return _uniq(queryFieldNames.concat(readableFieldNames));
};

/*
const getFieldFragment = ({ schema, fieldName, options }) => {
    let fieldFragment = fieldName;
    const field = schema[fieldName];
    if (!(field && field.type)) return fieldName;
    const fieldType = field.type.singleType;
    const fieldTypeName =
        typeof fieldType === 'object'
            ? 'Object'
            : typeof fieldType === 'function'
                ? fieldType.name
                : fieldType;

    if (fieldName.slice(-5) === intlSuffix) {
        fieldFragment = `${fieldName}{ locale value }`;
    } else {
        switch (fieldTypeName) {
            // recursive call for nested arrays and objects
            case 'Object':
                if (!isBlackbox(field) && fieldType._schema) {
                    fieldFragment =
                        getSchemaFragment({
                            fragmentName: fieldName,
                            schema: fieldType._schema,
                            options,
                        }) || null;
                }
                break;
            case 'Array':
                const arrayItemFieldName = `${fieldName}.$`;
                const arrayItemField = schema[arrayItemFieldName];
                // note: make sure field has an associated array item field
                if (arrayItemField) {
                    // child will either be native value or a an object (first case)
                    const arrayItemFieldType = arrayItemField.type.singleType;
                    if (!arrayItemField.blackbox && arrayItemFieldType._schema) {
                        fieldFragment =
                            getSchemaFragment({
                                fragmentName: fieldName,
                                schema: arrayItemFieldType._schema,
                                options,
                            }) || null;
                    }
                }
                break;
            default:
                // handle intl or return fieldName
                fieldFragment = fieldName;
                break;
        }
    }
    return fieldFragment;
};
*/

// get fragment for a whole schema (root schema or nested schema of an object or an array)
const getSchemaFragment = ({
    schema,
    fragmentName,
    options,
    fieldNames: providedFieldNames
}) => {
    // differentiate mutation/query and create/update cases
    // respect provided fieldNames if any (needed for the root schema)
    const fieldNames = providedFieldNames || (
        options.isMutation
            ? getMutationFieldNames({
                queryFieldNames: getQueryFieldNames({ schema, options }),
                readableFieldNames: getFragmentFieldNames({ schema, options: { onlyViewable: true } })
            })
            : getQueryFieldNames({ schema, options })
    );

    const childFragments = fieldNames.length && fieldNames.map(fieldName => getFieldFragment({
        schema,
        fieldName,
        options,
        getObjectFragment: getSchemaFragment // allow to reuse the code from defaultFragment with another behaviour
    }))
        // remove empty values
        .filter(f => !!f);
    if (childFragments.length) {
        return `${fragmentName} { ${childFragments.join('\n')} }`;
    }
    return null;
};

/**
 * Generate query and mutation fragments for forms
*/
const getFormFragments = ({
    formType = 'new', // new || edit
    collectionName,
    typeName,
    schema,
    fields, // restrict on certain fields
    addFields, // add additional fields (eg to display static fields)
}) => {

    // get the root schema fieldNames
    let queryFieldNames = getQueryFieldNames({ schema, options: { formType } });
    let mutationFieldNames = getMutationFieldNames({
        queryFieldNames,
        readableFieldNames: getFragmentFieldNames({ schema, options: { onlyViewable: true } })
    });

    // if "fields" prop is specified, restrict list of fields to it
    if (typeof fields !== 'undefined' && fields.length > 0) {
        // add "_intl" suffix to all fields in case some of them are intl fields
        const fieldsWithIntlSuffix = fields.map(field => `${field}${intlSuffix}`);
        const allFields = [...fields, ...fieldsWithIntlSuffix];
        queryFieldNames = _intersection(queryFieldNames, allFields);
        mutationFieldNames = _intersection(mutationFieldNames, allFields);
    }

    // add "addFields" prop contents to list of fields
    if (addFields && addFields.length) {
        queryFieldNames = queryFieldNames.concat(addFields);
        mutationFieldNames = mutationFieldNames.concat(addFields);
    }

    // userId is used to check for permissions, so add it to fragments if possible
    if (schema.userId) {
        queryFieldNames.unshift('userId');
        mutationFieldNames.unshift('userId');
    }

    if (schema._id) {
        queryFieldNames.unshift('_id');
        mutationFieldNames.unshift('_id');
    }

    // check unicity (_id can be added twice)
    queryFieldNames = _uniq(queryFieldNames);
    mutationFieldNames = _uniq(mutationFieldNames);


    // generate query fragment based on the fields that can be edited. Note: always add _id, and userId if possible.
    // TODO: support nesting
    const queryFragmentText = getSchemaFragment({
        schema,
        fragmentName: `fragment ${getFragmentName(formType, collectionName, 'query')} on ${typeName}`,
        options: { formType, isMutation: false },
        fieldNames: queryFieldNames
    });
    const generatedQueryFragment = gql(queryFragmentText);

    const mutationFragmentText = getSchemaFragment({
        schema,
        fragmentName: `fragment ${getFragmentName(formType, collectionName, 'mutation')} on ${typeName}`,
        options: { formType, isMutation: true },
        fieldNames: mutationFieldNames
    });
    // generate mutation fragment based on the fields that can be edited and/or viewed. Note: always add _id, and userId if possible.
    // TODO: support nesting
    const generatedMutationFragment = gql(mutationFragmentText);

    // if any field specifies extra queries, add them
    const extraQueries = _.compact(
        getQueryFieldNames({ schema, options: { formType } }).map(fieldName => {
            const field = schema[fieldName];
            return field.query;
        })
    );
    // get query & mutation fragments from props or else default to same as generatedFragment
    return {
        queryFragment: generatedQueryFragment,
        mutationFragment: generatedMutationFragment,
        extraQueries
    };
};

export default getFormFragments;
