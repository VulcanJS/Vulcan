/* ------------------------------------- Main Type ------------------------------------- */

/* 

type Movie{
  _id: String
  title: String
  description: String
  createdAt: Date
}

*/
export const mainTypeTemplate = ({ typeName, description, interfaces }) =>
`# ${description}
type ${typeName} ${interfaces.length ? `implements ${interfaces.join(`, `)} ` : ''}{
  # TODO: generate fields and their type from JavaScript schema
}
`;

/* ------------------------------------- Selector Types ------------------------------------- */

/*

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
export const selectorInputTemplate = ({ typeName }) =>
`
  # TODO: get fields that can be used as part of a selector
`;

/*

type MovieSelectorUniqueInput {
  _id: String
  slug: String
}

*/
export const selectorUniqueInputTemplate = ({ typeName }) =>
`
  # TODO: get fields that can be used as part of a selector
`;

/*

enum MovieOrderByInput {
  title
  createdAt
}

*/
export const orderByInputTemplate = ({ typeName }) =>
`
  # TODO: get fields that can be ordered
`;

/* ------------------------------------- Query Types ------------------------------------- */

/*

movie(input: SingleMovieInput) : SingleMovieOutput

*/
export const singleQueryTemplate = ({ typeName }) => `${typeName}(input: Single${typeName}Input): Single${typeName}Output`;


/*

movies(input: MultiMovieInput) : MultiMovieOutput

*/
export const multiQueryTemplate = ({ typeName }) => `${typeName}s(input: Multi${typeName}Input): Multi${typeName}Output`;

/* ------------------------------------- Query Input Types ------------------------------------- */

/*

type MultiMovieInput {
  terms: JSON
  offset: Int
  limit: Int
  enableCache: Boolean
}

*/
export const multiInputTemplate = ({ typeName }) =>
`type Multi${typeName}Input {
  # A JSON object that contains the query terms used to fetch data
  terms: JSON, 
  # How much to offset the results by
  offset: Int, 
  # A limit for the query
  limit: Int, 
  # Whether to enable caching for this query
  enableCache: Boolean
  # OpenCRUD fields
  where: ${typeName}SelectorInput
  orderBy: ${typeName}OrderByInput
  skip: Int
  after: String
  before: String
  first: Int
  last: Int
}`;

/*

type SingleMovieInput {
  documentId: String
  slug: String
  enableCache: Boolean
}

*/
export const singleInputTemplate = ({ typeName }) =>
`type Single${typeName}Input {
  # The document's unique ID
  documentId: String, 
  # A unique slug identifying the document
  slug: String, 
  # Whether to enable caching for this query
  enableCache: Boolean
}`;

/* ------------------------------------- Query Output Types ------------------------------------- */

/*

type MultiMovieOuput{
  data: [Movie]
  totalCount: Int
}

*/
export const MultiOutputTemplate = ({ typeName }) =>
`type Multi${typeName}Output{
  data: [${typeName}]
  totalCount: Int
}`;

/*

type SingleMovieOuput{
  data: Movie
}

*/
export const singleOutputTemplate = ({ typeName }) =>
`type Single${typeName}Output{
  data: ${typeName}
}`;

/* ------------------------------------- Mutation Types ------------------------------------- */

/*

createMovie(input: CreateMovieInput) : MovieOutput

*/
export const createMutationTemplate = ({ typeName }) =>
`create${typeName}(input: Create${typeName}Input) : Create${typeName}Output`;

/*

updateMovie(input: UpdateMovieInput) : MovieOutput

*/
export const updateMutationTemplate = ({ typeName }) =>
`update${typeName}(input: Update${typeName}Input) : Update${typeName}Output`;

/*

upsertMovie(input: UpsertMovieInput) : MovieOutput

*/
export const upsertMutationTemplate = ({ typeName }) =>
`upsert${typeName}(input: Upsert${typeName}Input) : Upsert${typeName}Output`;

/*

deleteMovie(input: DeleteMovieInput) : MovieOutput

*/
export const deleteMutationTemplate = ({ typeName }) =>
`delete${typeName}(input: Delete${typeName}Input) : Delete${typeName}Output`;

/* ------------------------------------- Mutation Input Types ------------------------------------- */

/*

type CreateMovieInput {
  data: CreateMovieDataInput!
}

*/
export const createInputTemplate = ({ typeName }) =>
`type Create${typeName}Input{
  data: Create${typeName}DataInput!
}`;

/*

type UpdateMovieInput {
  selector: MovieSelectorUniqueInput!
  data: UpdateMovieDataInput!
}

*/
export const updateInputTemplate = ({ typeName }) =>
`type Update${typeName}Input{
  selector: ${typeName}SelectorUniqueInput!
  data: Update${typeName}DataInput!
}`;

/*

Note: upsertInputTemplate uses same data type as updateInputTemplate

type UpsertMovieInput {
  selector: MovieSelectorUniqueInput!
  data: UpdateMovieDataInput!
}

*/
export const upsertInputTemplate = ({ typeName }) =>
`type Upsert${typeName}Input{
  selector: ${typeName}SelectorUniqueInput!
  data: Update${typeName}DataInput!
}`;

/*

type DeleteMovieInput {
  selector: MovieSelectorUniqueInput!
}

*/
export const deleteInputTemplate = ({ typeName }) =>
`type Delete${typeName}Input{
  selector: ${typeName}SelectorUniqueInput!
}`;

/*

type CreateMovieDataInput {
  title: String
  description: String
}

*/
export const createDataInputTemplate = ({ typeName }) =>
`
  # TODO
`;

/*

type UpdateMovieDataInput {
  title: String
  description: String
}

*/
export const updateDataInputTemplate = ({ typeName }) =>
`
  # TODO
`;

/* ------------------------------------- Mutation Output Type ------------------------------------- */

/*

type MovieOutput {
  data: Movie
}

*/
export const mutationOutputTemplate = ({ typeName }) =>
`type ${typeName}Output{
  data: ${typeName}
}`;
