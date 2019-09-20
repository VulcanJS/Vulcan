import { convertToGraphQL } from './types.js';

/* ------------------------------------- Selector Types ------------------------------------- */

/*

The selector type is used to query for one or more documents

type MovieSelectorInput {
  AND: [MovieSelectorInput]
  OR: [MovieSelectorInput]
  id: String
  id_not: String
  id_in: [String!]
  id_not_in: [String!]
  ...
  name: String
  name_not: String
  name_in: [String!]
  name_not_in: [String!]
  ...
}

see https://www.opencrud.org/#sec-Data-types

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

/*

See https://docs.hasura.io/1.0/graphql/manual/queries/query-filters.html#
 
*/
export const whereFieldTemplate = ({ typeName, fields }) =>
`input ${typeName}WhereFieldTemplate {
  _and: [whereFieldTemplate]
  _not: whereFieldTemplate
  _or: [whereFieldTemplate]
  created_at: timestamptz_comparison_exp
  id: Int_comparison_exp
  title: String_comparison_exp
  updated_at: timestamptz_comparison_exp
}`;


/*

The orderBy type defines which fields a query can be ordered by

enum MovieOrderByInput {
  title
  createdAt
}

*/
export const orderByInputTemplate = ({ typeName, fields }) =>
`enum ${typeName}OrderByInput {
  foobar
  ${fields.join('\n  ')}
}`;
