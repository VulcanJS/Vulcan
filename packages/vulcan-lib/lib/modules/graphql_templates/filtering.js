import { convertToGraphQL } from './types.js';
import { Utils } from '../utils.js';

// field types that support filtering
const supportedFieldTypes = ['String', 'Int', 'Float', 'Boolean', 'Date'];

/* ------------------------------------- Selector Types ------------------------------------- */

/*

The selector type is used to query for one or more documents

type MovieSelectorInput {
  AND: [MovieSelectorInput]
  OR: [MovieSelectorInput]
  ...
}

// TODO: not currently used

*/
export const selectorInputTemplate = ({ typeName, fields }) =>
  `input ${typeName}SelectorInput {
  _and: [${typeName}SelectorInput]
  _or: [${typeName}SelectorInput]
${convertToGraphQL(fields, '  ')}
}`;

/*

The unique selector type is used to query for exactly one document

type MovieSelectorUniqueInput {
  _id: String
  slug: String
}

*/
export const selectorUniqueInputTemplate = ({ typeName, fields }) =>
  `input ${typeName}SelectorUniqueInput {
  _id: String
  documentId: String # OpenCRUD backwards compatibility
  slug: String
${convertToGraphQL(fields, '  ')}
}`;

const formatFilterName = s => Utils.capitalize(s.replace('_', ''));

/*

See https://docs.hasura.io/1.0/graphql/manual/queries/query-filters.html#
 
*/
export const fieldFilterInputTemplate = ({ typeName, fields, customFilters = [], customSorts = []}) =>
  `input ${typeName}FilterInput {
  _and: [${typeName}FilterInput]
  _not: ${typeName}FilterInput
  _or: [${typeName}FilterInput]
${customFilters.map(({ name }) => `  ${name}: ${typeName}${formatFilterName(name)}FilterInput`)}
${customSorts.map(({ name }) => `  ${name}: ${typeName}${formatFilterName(name)}SortInput`)}
${fields
    .map(field => {
      const { name, type } = field;
      if (supportedFieldTypes.includes(type)) {
        const isArrayField = name[0] === '[';
        return `  ${name}: ${type}_${isArrayField ? 'Array_' : ''}Selector`;
      } else {
        return '';
      }
    })
    .join('\n')}
}`;

export const fieldSortInputTemplate = ({ typeName, fields }) =>
  `input ${typeName}SortInput {
${fields.map(({ name }) => `  ${name}: SortOptions`).join('\n')}
}`;


export const customFilterTemplate = ({ typeName, filter }) => 
  `input ${typeName}${formatFilterName(filter.name)}FilterInput{
  ${filter.arguments}
}`;

// TODO: not currently used
export const customSortTemplate = ({ typeName, sort }) => 
  `input ${typeName}${formatFilterName(sort.name)}SortInput{
  ${sort.arguments}
}`;

// export const customFilterTemplate = ({ typeName, customFilters }) => 
//   `enum ${typeName}CustomFilter{
// ${Object.keys(customFilters).map(name => `  ${name}`).join('\n')}
// }`;

// export const customSortTemplate = ({ typeName, customFilters }) => 
//   `enum ${typeName}CustomSort{
// ${Object.keys(customFilters).map(name => `  ${name}`).join('\n')}
// }`;

/*
export const orderByInputTemplate = ({ typeName, fields }) =>
  `enum ${typeName}SortInput {
  ${Array.isArray(fields) && fields.length ? fields.join('\n  ') : 'foobar'}
}`;
*/