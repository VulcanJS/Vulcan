import { Utils } from '../utils.js';
import { selectorUniqueInputType, filterInputType, sortInputType } from './filtering.js';

// eslint-disable-next-line
const deprecated1 = `# Deprecated (use 'filter/id' fields instead).`;
// eslint-disable-next-line
const deprecated2 = `# Deprecated (use 'filter/id' fields instead).`;

const singleReturnProperty = 'result';
const multiReturnProperty = 'results';

/* ------------------------------------- Query Types ------------------------------------- */

/*

A query for a single document

movie(input: SingleMovieInput) : SingleMovieOutput

*/
export const singleQueryType = typeName => Utils.camelCaseify(typeName);
export const singleQueryTemplate = ({ typeName }) =>
  `${singleQueryType(typeName)}(input: ${singleInputType(typeName, true)}): ${singleOutputType(typeName)}`;

/*

A query for multiple documents

movies(input: MultiMovieInput) : MultiMovieOutput

*/
export const multiQueryType = typeName => Utils.camelCaseify(Utils.pluralize(typeName));
export const multiQueryTemplate = ({ typeName }) =>
  `${multiQueryType(typeName)}(input: ${multiInputType(typeName, false)}): ${multiOutputType(typeName)}`;

/* ------------------------------------- Query Input Types ------------------------------------- */

/*

The argument type when querying for a single document

type SingleMovieInput {
  filter: MovieFilterInput
  sort: MovieSortInput
  search: String
  enableCache: Boolean
}

*/
export const singleInputType = (typeName, nonNull = false) => `Single${typeName}Input${nonNull ? '!' : ''}`;
export const singleInputTemplate = ({ typeName }) =>
  `input ${singleInputType(typeName)} {
  # filtering
  filter: ${filterInputType(typeName)}
  sort: ${sortInputType(typeName)}
  search: String
  id: String

  # backwards-compatibility
  ${deprecated1}
  selector: ${selectorUniqueInputType(typeName)}

  # options (backwards-compatibility)
  # Whether to enable caching for this query
  enableCache: Boolean
  # Return null instead of throwing MissingDocumentError
  allowNull: Boolean
  # An identifier to name the query's execution context
  contextName: String
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
export const multiInputType = (typeName, nonNull = false) => `Multi${typeName}Input${nonNull ? '!' : ''}`;
export const multiInputTemplate = ({ typeName }) =>
  `input ${multiInputType(typeName)} {

  # filtering
  filter: ${filterInputType(typeName)}
  sort: ${sortInputType(typeName)}
  search: String
  offset: Int
  limit: Int

  # backwards-compatibility
  # A JSON object that contains the query terms used to fetch data
  ${deprecated2}
  terms: JSON

  # options (backwards-compatibility)
  # Whether to enable caching for this query
  enableCache: Boolean
  # Whether to calculate totalCount for this query
  enableTotal: Boolean
  # An identifier to name the query's execution context
  contextName: String

}`;

/* ------------------------------------- Query Output Types ------------------------------------- */

/*

The type for the return value when querying for a single document

type SingleMovieOuput{
  result: Movie
}

*/
export const singleOutputType = typeName => `Single${typeName}Output`;
export const singleOutputTemplate = ({ typeName }) =>
  `type ${singleOutputType(typeName)}{
  ${singleReturnProperty}: ${typeName}
}`;

/*

The type for the return value when querying for multiple documents

type MultiMovieOuput{
  results: [Movie]
  totalCount: Int
}

*/
export const multiOutputType = typeName => ` Multi${typeName}Output`;
export const multiOutputTemplate = ({ typeName }) =>
  `type ${multiOutputType(typeName)}{
  ${multiReturnProperty}: [${typeName}]
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
  `query ${singleQueryType(typeName)}($input: ${singleInputType(typeName, true)}) {
  ${singleQueryType(typeName)}(input: $input) {
    ${singleReturnProperty} {
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
  `query ${multiQueryType(typeName)}($input: ${multiInputType(typeName, false)}) {
  ${multiQueryType(typeName)}(input: $input) {
    ${multiReturnProperty} {
      ...${fragmentName}
    }
    totalCount
    __typename
  }
  ${extraQueries ? extraQueries : ''}
}`;
