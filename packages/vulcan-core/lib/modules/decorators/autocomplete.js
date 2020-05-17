import { getCollectionByTypeName, isEmptyOrUndefined, fieldDynamicQueryTemplate, fieldStaticQueryTemplate, autocompleteQueryTemplate } from 'meteor/vulcan:core';
import get from 'lodash/get';

const getQueryResolverName = field => {
  const isRelation = field.relation || get(field, 'resolveAs.relation');
  if (isRelation) {
    const typeName = get(field, 'relation.typeName') || get(field, 'resolveAs.typeName');
    const collection = getCollectionByTypeName(typeName);
    return get(collection, 'options.multiResolverName');
  }
};

// note: the following decorator function is called both for autocomplete and autocompletemultiple
export const makeAutocomplete = (field = {}, options = {}) => {
  /*

  - queryResolverName: the name of the query resolver used to fetch the list of autocomplete suggestions
  - autocompletePropertyName: the name of the property used as the label for each item

  */
  const { autocompletePropertyName, multi } = options;

  if (!autocompletePropertyName) {
    throw new Error('makeAutocomplete decorator is missing an autocompletePropertyName option.');
  }
  
  // if field stores an array, use multi autocomplete
  const isMultiple = multi || field.type === Array;

  // define query to load extra data for input values
  // note: we don't want to run dynamic queries with empty filters, so if there is no value
  // defined the query function will return `undefined` and not run at all
  const query = ({ value, mode = 'dynamic' }) => {
    const queryResolverName = options.queryResolverName || getQueryResolverName(field);
    return mode === 'dynamic'
      ? !isEmptyOrUndefined(value) && fieldDynamicQueryTemplate({ queryResolverName, autocompletePropertyName })
      : fieldStaticQueryTemplate({ queryResolverName, autocompletePropertyName });
  };

  // query to load autocomplete suggestions
  const autocompleteQuery = () => {
    const queryResolverName = options.queryResolverName || getQueryResolverName(field);
    return autocompleteQueryTemplate({ queryResolverName, autocompletePropertyName });
  };

  // define a function that takes the options returned by the queries
  // and transforms them into { value, label } pairs.
  const optionsFunction = props => {
    const queryResolverName = options.queryResolverName || getQueryResolverName(field);

    return get(props, `data.${queryResolverName}.results`, []).map(document => ({
      value: document._id,
      label: document[autocompletePropertyName],
    }));
  };

  const acField = {
    ...field,
    query,
    autocompleteQuery,
    options: optionsFunction,
    input: isMultiple ? 'multiautocomplete' : 'autocomplete',
  };

  return acField;
};
