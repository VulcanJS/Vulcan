import { convertToGraphQL } from './types.js';
import { Utils } from '../utils.js';

// field types that support filtering
const supportedFieldTypes = ['String', 'Int', 'Float', 'Boolean', 'Date'];
const getContentType = type =>
  type
    .replace('[', '')
    .replace(']', '')
    .replace('!', '');
const isSupportedFieldType = type => supportedFieldTypes.includes(type);

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
export const selectorInputType = typeName => `${typeName}SelectorInput`;
export const selectorInputTemplate = ({ typeName, fields }) =>
  `input ${selectorInputType(typeName)} {
  _and: [${selectorInputType(typeName)}]
  _or: [${selectorInputType(typeName)}]
${convertToGraphQL(fields, '  ')}
}`;

/*

The unique selector type is used to query for exactly one document

type MovieSelectorUniqueInput {
  _id: String
  slug: String
}

*/
export const selectorUniqueInputType = typeName => `${typeName}SelectorUniqueInput`;
export const selectorUniqueInputTemplate = ({ typeName, fields }) =>
  `input ${selectorUniqueInputType(typeName)} {
  _id: String
  documentId: String # OpenCRUD backwards compatibility
  slug: String
${convertToGraphQL(fields, '  ')}
}`;

const formatFilterName = s => Utils.capitalize(s.replace('_', ''));

/*

See https://docs.hasura.io/1.0/graphql/manual/queries/query-filters.html#
 
Note: if a filter doesn't take arguments just use a boolean (e.g. `_onlyPublic: true`)
instead of defining a custom type. 

*/
export const filterInputType = typeName => `${typeName}FilterInput`;
export const fieldFilterInputTemplate = ({ typeName, fields, customFilters = [], customSorts = [] }) =>
  `input ${filterInputType(typeName)} {
  _and: [${filterInputType(typeName)}]
  _not: ${filterInputType(typeName)}
  _or: [${filterInputType(typeName)}]
${customFilters.map(filter => `  ${filter.name}: ${filter.arguments ? customFilterType(typeName, filter) : 'Boolean'}`)}
${customSorts.map(sort => `  ${sort.name}: ${customSortType(typeName, sort)}`)}
${fields
  .map(field => {
    const { name, type } = field;
    const contentType = getContentType(type);
    if (isSupportedFieldType(contentType)) {
      const isArrayField = type[0] === '[';
      return `  ${name}: ${contentType}_${isArrayField ? 'Array_' : ''}Selector`;
    } else {
      return '';
    }
  })
  .join('\n')}
}`;

export const sortInputType = typeName => `${typeName}SortInput`;
export const fieldSortInputTemplate = ({ typeName, fields }) =>
  `input ${sortInputType(typeName)} {
${fields.map(({ name }) => `  ${name}: SortOptions`).join('\n')}
}`;

export const customFilterType = (typeName, filter) => `${typeName}${formatFilterName(filter.name)}FilterInput`;
export const customFilterTemplate = ({ typeName, filter }) =>
  `input ${customFilterType(typeName, filter)}{
  ${filter.arguments}
}`;

// TODO: not currently used
export const customSortType = (typeName, filter) => `${typeName}${formatFilterName(filter.name)}SortInput`;
export const customSortTemplate = ({ typeName, sort }) =>
  `input ${customSortType(typeName, sort)}{
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
