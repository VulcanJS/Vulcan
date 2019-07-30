import _uniq from 'lodash/uniq';
import _intersection from 'lodash/intersection';
import gql from 'graphql-tag';
import {
    getReadableFields,
    getCreateableFields,
    getUpdateableFields
} from '../modules/schema_utils';
import {
    Utils,
} from 'meteor/vulcan:core';
const intlSuffix = '_intl';

// NewFoobarFormFragment || EditFoobarFormFragment
const getFragmentName = (formType, collectionName) => {
    const prefix = `${collectionName}${Utils.capitalize(
        formType
    )}`;
    const fragmentName = `${prefix}FormFragment`;
    return fragmentName;
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
    const fragmentName = getFragmentName(formType, collectionName);
    const readableFields = getReadableFields(schema);

    // get the values we need for edition
    let queryFields = formType === 'new'
        ? getCreateableFields(schema)
        : getUpdateableFields(schema);
    // for the mutations's return value, also get non-editable but viewable fields (such as createdAt, userId, etc.)
    let mutationFields = _uniq(queryFields.concat(readableFields));

    // if "fields" prop is specified, restrict list of fields to it
    if (typeof fields !== 'undefined' && fields.length > 0) {
        // add "_intl" suffix to all fields in case some of them are intl fields
        const fieldsWithIntlSuffix = fields.map(field => `${field}${intlSuffix}`);
        const allFields = [...fields, ...fieldsWithIntlSuffix];
        queryFields = _intersection(queryFields, allFields);
        mutationFields = _intersection(mutationFields, allFields);
    }

    // add "addFields" prop contents to list of fields
    if (addFields && addFields.length) {
        queryFields = queryFields.concat(addFields);
        mutationFields = mutationFields.concat(addFields);
    }


    const convertFields = field => {
        return field.slice(-5) === intlSuffix ? `${field}{ locale value }` : field;
    };

    // generate query fragment based on the fields that can be edited. Note: always add _id.
    // TODO: support nesting
    const generatedQueryFragment = gql`
      fragment ${fragmentName} on ${typeName} {
        _id
        ${queryFields.map(convertFields).join('\n')}
      }
    `;

    // generate mutation fragment based on the fields that can be edited and/or viewed. Note: always add _id.
    // TODO: support nesting
    const generatedMutationFragment = gql`
      fragment ${fragmentName} on ${typeName} {
        _id
        ${mutationFields.map(convertFields).join('\n')}
      }
    `;

    // get query & mutation fragments from props or else default to same as generatedFragment
    return {
        queryFragment: generatedQueryFragment,
        mutationFragment: generatedMutationFragment,
    };
};

export default getFormFragments;