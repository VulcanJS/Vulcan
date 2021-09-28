import { capitalize } from '../utils';

/*

Field-specific data loading query template for a dynamic array of item IDs

(example: `categoriesIds` where $value is ['foo123', 'bar456'])

*/
export const fieldDynamicQueryTemplate = ({ queryResolverName, autocompletePropertyName, valuePropertyName = '_id', fragmentName }) =>
  `query FormComponentDynamic${capitalize(queryResolverName)}Query($value: [String!]) {
    ${queryResolverName}(input: { 
      filter: {  ${valuePropertyName}: { _in: $value } },
      sort: { ${autocompletePropertyName}: asc }
    }){
      results{
        ${valuePropertyName}
        ${autocompletePropertyName}
        ${fragmentName && `...${fragmentName}` || ''}
      }
    }
  }
`;

/*

Field-specific data loading query template for *all* items in a collection

*/
export const fieldStaticQueryTemplate = ({ queryResolverName, autocompletePropertyName, valuePropertyName = '_id', fragmentName }) =>
  `query FormComponentStatic${capitalize(queryResolverName)}Query {
  ${queryResolverName}(input: { 
    sort: { ${autocompletePropertyName}: asc }
  }){
    results{
      ${valuePropertyName}
      ${autocompletePropertyName}
      ${fragmentName && `...${fragmentName}` || ''}
    }
  }
}
`;


/*

Query template for loading a list of autocomplete suggestions

*/
export const autocompleteQueryTemplate = ({ queryResolverName, autocompletePropertyName, valuePropertyName = '_id', fragmentName }) => `
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
        ${valuePropertyName}
        ${autocompletePropertyName}
        ${fragmentName && `...${fragmentName}` || ''}
      }
    }
  }
`;
