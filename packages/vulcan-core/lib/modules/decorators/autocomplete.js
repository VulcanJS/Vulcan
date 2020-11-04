import { getCollectionByTypeName, isEmptyOrUndefined, fieldDynamicQueryTemplate, fieldStaticQueryTemplate, autocompleteQueryTemplate } from 'meteor/vulcan:core';
import get from 'lodash/get';

const getQueryResolverName = field => {
  const isRelation = field.relation || get(field, 'resolveAs.relation');
  if (isRelation) {
    const typeName = get(field, 'relation.typeName') || get(field, 'resolveAs.typeName');
    const collection = getCollectionByTypeName(typeName);
    return get(collection, 'options.multiResolverName');
  } else {
    throw new Error('Could not guess query resolver name, please specify a queryResolverName option for the makeAutocomplete decorator.')
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

  const queryResolverName = options.queryResolverName || getQueryResolverName(field);
  const queryProps = { queryResolverName, autocompletePropertyName, valuePropertyName, fragmentName };

  // define query to load extra data for input values
  const query = () => {
    return fieldDynamicQueryTemplate(queryProps);
  };

  // query to load autocomplete suggestions
  const autocompleteQuery = () => {
    return autocompleteQueryTemplate(queryProps);
  };

  // define a function that takes the options returned by the queries
  // and transforms them into { value, label } pairs.
  const optionsFunction = props => {
    const queryResolverName = options.queryResolverName || getQueryResolverName(field);

    return get(props, `data.${queryResolverName}.results`, []).map(document => ({
      value: document[valuePropertyName],
      label: document[autocompletePropertyName],
    }));
  };

  const acField = {
    ...field,
    query,
    autocompleteQuery,
    queryWaitsForValue: true,
    options: optionsFunction,
    input: isMultiple ? 'multiautocomplete' : 'autocomplete',
  };

  return acField;
};
