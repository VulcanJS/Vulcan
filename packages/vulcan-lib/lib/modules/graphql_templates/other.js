import { capitalize } from '../utils';

/*

Field-specific data loading query template for an array of item IDs

(example: `categoriesIds` where $value is ['foo123', 'bar456'])

*/
export const fieldMultiQueryTemplate = ({ queryResolverName, labelPropertyName }) =>
  `query FormComponent${capitalize(queryResolverName)}Query($value: [String!]) {
    ${queryResolverName}(input: { 
      filter: {  _id: { _in: $value } },
      sort: { ${labelPropertyName}: asc }
    }){
      results{
        _id
        ${labelPropertyName}
      }
    }
  }
`;

/*

Field-specific data loading query template for a single item ID

(example: `userId` where $value is 'foo123')

Note: for consistency's sake we use the multi resolver for the single item query too

*/
export const fieldSingleQueryTemplate = ({ queryResolverName, labelPropertyName }) =>
  `query FormComponent${capitalize(queryResolverName)}Query($value: String) {
    ${queryResolverName}(input: { 
      filter: { _id: { _eq: $value } },
      sort: { ${labelPropertyName}: asc }
    }){
      results{
        _id
        ${labelPropertyName}
      }
    }
  }
`;

/*

Query template for loading a list of autocomplete suggestions

*/
export const autocompleteQueryTemplate = ({ queryResolverName, labelPropertyName }) => `
  query Autocomplete${capitalize(queryResolverName)}Query($queryString: String) {
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
