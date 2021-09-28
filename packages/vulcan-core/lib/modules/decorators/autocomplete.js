import {
  getCollectionByTypeName,
  fieldDynamicQueryTemplate,
  fieldStaticQueryTemplate,
  autocompleteQueryTemplate,
} from 'meteor/vulcan:core';
import get from 'lodash/get';

const getQueryResolverName = field => {
  const isRelation = field.relation || get(field, 'resolveAs.relation');
  if (isRelation) {
    const typeName = get(field, 'relation.typeName') || get(field, 'resolveAs.typeName');
    const collection = getCollectionByTypeName(typeName);
    return get(collection, 'options.multiResolverName');
  } else {
    throw new Error('Could not guess query resolver name, please specify a queryResolverName option for the makeAutocomplete decorator.');
  }
};

// note: the following decorator function is called both for autocomplete and autocompletemultiple
export const makeAutocomplete = (field = {}, options = {}) => {
  /*

  - queryResolverName: the name of the query resolver used to fetch the list of autocomplete suggestions
  - autocompletePropertyName: the name of the property used as the label for each item
  - fragmentName: the name of the fragment to use to fetch additional data besides autocompletePropertyName
  - valuePropertyName: the name of the property to return (defaults to `_id`)

  */
  const { autocompletePropertyName, fragmentName, valuePropertyName = '_id', multi } = options;

  if (!autocompletePropertyName) {
    throw new Error('makeAutocomplete decorator is missing an autocompletePropertyName option.');
  }

  // if field stores an array, use multi autocomplete
  const isMultiple = multi || field.type === Array;

  // define this as a function to run later as some variables may not yet be available
  // at init time
  const getQueryProps = () => {
    const queryResolverName = options.queryResolverName || getQueryResolverName(field);
    return { queryResolverName, autocompletePropertyName, valuePropertyName, fragmentName };
  };

  // define query to load extra data for input values

  // to load only some items based on a key
  const dynamicQuery = () => {
    return fieldDynamicQueryTemplate(getQueryProps());
  };

  // to load all possible items
  const staticQuery = () => {
    return fieldStaticQueryTemplate(getQueryProps());
  };

  // query to load autocomplete suggestions
  const autocompleteQuery = () => {
    return autocompleteQueryTemplate(getQueryProps());
  };

  // define a function that takes the options returned by the queries
  // and transforms them into { value, label } pairs.
  const optionsFunction = props => {
    const queryResolverName = options.queryResolverName || getQueryResolverName(field);

    return get(props, `data.${queryResolverName}.results`, []).map(document => ({
      ...document,
      value: document[valuePropertyName],
      label: document[autocompletePropertyName],
    }));
  };

  const acField = {
    dynamicQuery,
    staticQuery, // not currently used?
    query: dynamicQuery, // backwards-compatibility
    autocompleteQuery,
    queryWaitsForValue: true,
    options: optionsFunction,
    input: isMultiple ? 'multiautocomplete' : 'autocomplete',
    ...field, // add field last to allow manual override of properties in field definition
  };

  return acField;
};
