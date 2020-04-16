import { capitalize } from '../utils';

/*

Field-specific data loading query template for a dynamic array of item IDs

(example: `categoriesIds` where $value is ['foo123', 'bar456'])

*/
export const fieldDynamicQueryTemplate = ({ queryResolverName, autocompletePropertyName }) =>
  `query FormComponent${capitalize(queryResolverName)}Query($value: [String!]) {
    ${queryResolverName}(input: { 
      filter: {  _id: { _in: $value } },
      sort: { ${autocompletePropertyName}: asc }
    }){
      results{
        _id
        ${autocompletePropertyName}
      }
    }
  }
`;

/*

Field-specific data loading query template for *all* items in a collection

*/
export const fieldStaticQueryTemplate = ({ queryResolverName, autocompletePropertyName }) =>
  `query FormComponent${capitalize(queryResolverName)}Query {
  ${queryResolverName}(input: { 
    
    sort: { ${autocompletePropertyName}: asc }
  }){
    results{
      _id
      ${autocompletePropertyName}
    }
  }
}
`;


/*

Query template for loading a list of autocomplete suggestions

*/
export const autocompleteQueryTemplate = ({ queryResolverName, autocompletePropertyName }) => `
  query Autocomplete${capitalize(queryResolverName)}Query($queryString: String) {
    ${queryResolverName}(
      input: {
        filter: {
          ${autocompletePropertyName}: { _like: $queryString }
        },
        limit: 20
      }
    ){
      results{
        _id
        ${autocompletePropertyName}
      }
    }
  }
`;
