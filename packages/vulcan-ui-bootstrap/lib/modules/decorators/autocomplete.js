import {
  isEmptyOrUndefined,
  fieldMultiQueryTemplate,
  fieldSingleQueryTemplate,
  autocompleteQueryTemplate,
} from 'meteor/vulcan:core';

// note: the following decorator function is called both for autocomplete and autocompletemultiple
export const makeAutocomplete = (field = {}, options = {}) => {
  /*

  - queryResolverName: the name of the query resolver used to fetch the list of autocomplete suggestions
  - labelPropertyName: the name of the property used as the label for each item

  */
  const { queryResolverName, labelPropertyName, multi } = options;

  // if field stores an array, use multi autocomplete
  const isMultiple = multi || field.type === Array;

  // define query to load extra data for input values
  // note: we don't want to run queries with empty filters, so if there is no value
  // defined the query function will return `undefined` and not run at all
  const query = ({ value }) =>
    isMultiple
      ? !isEmptyOrUndefined(value) && fieldMultiQueryTemplate({ queryResolverName, labelPropertyName })
      : !isEmptyOrUndefined(value) && fieldSingleQueryTemplate({ queryResolverName, labelPropertyName });

  // query to load autocomplete suggestions
  const autocompleteQuery = autocompleteQueryTemplate({ queryResolverName, labelPropertyName });

  // define a function that takes the options returned by the queries
  // and transforms them into { value, label } pairs.
  const optionsFunction = props => {
    return (
      props.data &&
      props.data[queryResolverName].results.map(document => ({
        value: document._id,
        label: document[labelPropertyName],
      }))
    );
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
