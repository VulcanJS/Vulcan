import { Utils, isEmptyOrUndefined } from 'meteor/vulcan:core';

// note: the following decorator function is called both for autocomplete and autocompletemultiple
export const makeAutocomplete = (field = {}, options = {}) => {
  /*

  - queryResolverName: the name of the query resolver used to fetch the list of autocomplete suggestions
  - labelPropertyName: the name of the property used as the label for each item

  */
  const { queryResolverName, labelPropertyName, isMultiple = false } = options;

  // define query to load extra data for input values
  // note: we don't want to run queries with empty filters, so if there is no value
  // defined the query function will return `undefined` and not run at all
  const query = ({ value }) =>
    !isEmptyOrUndefined(value) &&
    `
    query FormComponent${Utils.capitalize(queryResolverName)}Query($value: ${isMultiple ? '[String!]' : 'String'}) {
      ${queryResolverName}(
        input: {
          filter: {
            ${isMultiple ? '_id: { _in: $value }' : '_id: { _eq: $value }'}
          }
        }
      ){
        results{
          _id
          ${labelPropertyName}
        }
      }
    }
  `;

  // query to load autocomplete suggestions
  const autocompleteQuery = `
    query Autocomplete${Utils.capitalize(queryResolverName)}Query($queryString: String) {
      ${queryResolverName}(
        input: {
          filter: {
            ${labelPropertyName}: { _like: $queryString }
          },
          limit: 20
        }
      ){
        results{
          _id
          ${labelPropertyName}
        }
      }
    }
  `;

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
    input: 'autocomplete',
  };

  return acField;
};

export const makeAutocompleteMultiple = (field = {}, options = {}) => ({
  ...makeAutocomplete(field, { ...options, isMultiple: true }),
  input: 'autocompletemultiple',
});
