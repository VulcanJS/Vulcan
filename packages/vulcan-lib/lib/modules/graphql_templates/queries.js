import { Utils } from '../utils.js';

export const getSingleResolverName = typeName => Utils.camelCaseify(typeName);
export const getMultiResolverName = typeName => Utils.camelCaseify(Utils.pluralize(typeName));

/* ------------------------------------- Query Types ------------------------------------- */

/*

A query for a single document

movie(input: SingleMovieInput) : SingleMovieOutput

*/
export const singleQueryTemplate = ({ typeName }) => `${getSingleResolverName(typeName)}(_id: String, input: Single${typeName}Input): Single${typeName}Output`;


/*

A query for multiple documents

movies(input: MultiMovieInput) : MultiMovieOutput

*/
export const multiQueryTemplate = ({ typeName }) => `${getMultiResolverName(typeName)}(input: Multi${typeName}Input): Multi${typeName}Output`;

/* ------------------------------------- Query Input Types ------------------------------------- */

/*

The argument type when querying for a single document

type SingleMovieInput {
  selector {
    documentId: String
    # or `_id: String`
    # or `slug: String`
  }
  enableCache: Boolean
}

*/
export const singleInputTemplate = ({ typeName }) =>
  `input Single${typeName}Input {
  # filtering
  where: ${typeName}WhereInput
  orderBy: ${typeName}OrderByInput
  search: String
  filter: String
  _id: String

  # backwards-compatibility
  selector: ${typeName}SelectorUniqueInput

  # options
  # Whether to enable caching for this query
  enableCache: Boolean
  # Return null instead of throwing MissingDocumentError
  allowNull: Boolean
}`;

/*

The argument type when querying for multiple documents

type MultiMovieInput {
  terms: JSON
  offset: Int
  limit: Int
  enableCache: Boolean
}

*/
export const multiInputTemplate = ({ typeName }) =>
  `input Multi${typeName}Input {

  # filtering
  where: ${typeName}WhereInput
  orderBy: ${typeName}OrderByInput
  search: String
  offset: Int
  limit: Int
  filter: String

  # backwards-compatibility
  # A JSON object that contains the query terms used to fetch data
  terms: JSON

  # options
  # Whether to enable caching for this query
  enableCache: Boolean
  # Whether to calculate totalCount for this query
  enableTotal: Boolean
  
}`;

/* ------------------------------------- Query Output Types ------------------------------------- */

/*

The type for the return value when querying for a single document

type SingleMovieOuput{
  result: Movie
}

*/
export const singleOutputTemplate = ({ typeName }) =>
  `type Single${typeName}Output{
  result: ${typeName}
}`;

/*

The type for the return value when querying for multiple documents

type MultiMovieOuput{
  results: [Movie]
  totalCount: Int
}

*/
export const multiOutputTemplate = ({ typeName }) =>
  `type Multi${typeName}Output{
  results: [${typeName}]
  totalCount: Int
}`;

/* ------------------------------------- Query Queries ------------------------------------- */


/*

Single query used on the client

query singleMovieQuery($input: SingleMovieInput) {
  movie(input: $input) {
    result {
      _id
      name
      __typename
    }
    __typename
  }
}

*/
// TODO: with hooks, extraQueries becomes less necessary?
export const singleClientTemplate = ({ typeName, fragmentName, extraQueries }) =>
  `query single${typeName}Query($input: Single${typeName}Input, $_id: String) {
  ${Utils.camelCaseify(typeName)}(input: $input, _id: $id) {
    result {
      ...${fragmentName}
    }
    __typename
  }
  ${extraQueries ? extraQueries : ''}
}`;


/*

Multi query used on the client

mutation multiMovieQuery($input: MultiMovieInput) {
  movies(input: $input) {
    results {
      _id
      name
      __typename
    }
    totalCount
    __typename
  }
}

*/
export const multiClientTemplate = ({ typeName, fragmentName, extraQueries }) =>
  `query multi${typeName}Query($input: Multi${typeName}Input) {
  ${Utils.camelCaseify(Utils.pluralize(typeName))}(input: $input) {
    results {
      ...${fragmentName}
    }
    totalCount
    __typename
  }
  ${extraQueries ? extraQueries : ''}
}`;
