
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

}
`

/* ------------------------------------- Selector Types ------------------------------------- */

/*

type MovieSelectorInput {
  genre: String
}

*/
export const selectorInputTemplate = ({ typeName }) => 
`

`

/*

type MovieSelectorUniqueInput {
  _id: String
}

*/
export const selectorUniqueInputTemplate = ({ typeName }) => 
`

`

/* ------------------------------------- Query Types ------------------------------------- */

/*

movies(input: ListMovieInput) : [Movie]

*/
export const listQueryTemplate = ({ typeName }) => `${typeName}s(input: List${typeName}Input): [${typeName}]`

/*

movie(input: SingleMovieInput) : Movie

*/
export const singleQueryTemplate = ({ typeName }) => `${typeName}(input: Single${typeName}Input): ${typeName}`

/*

totalMovies(input: TotalMovieInput) : Int

*/
export const totalQueryTemplate = ({ typeName }) =>
`total${typeName}(
  # A JSON object that contains the query terms used to fetch data
  terms: JSON,
  # Whether to enable caching for this query
  enableCache: Boolean
): Int`

/* ------------------------------------- Query Input Types ------------------------------------- */

/*

type ListMovieInput {
  terms: JSON
  offset: Int
  limit: Int
  enableCache: Boolean
}

*/
export const listInputTemplate = ({ typeName }) => 
`type List${typeName}Input {
  # A JSON object that contains the query terms used to fetch data
  terms: JSON, 
  # How much to offset the results by
  offset: Int, 
  # A limit for the query
  limit: Int, 
  # Whether to enable caching for this query
  enableCache: Boolean
}`

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
}`

/* ------------------------------------- Query Output Types ------------------------------------- */

/*

type ListMovieOuput{
  data: [Movie]
}

*/
export const listOutputTemplate = ({ typeName }) => 
`type List${typeName}Output{
  data: [${typeName}]
}`

/*

type SingleMovieOuput{
  data: Movie
}

*/
export const singleOutputTemplate = ({ typeName }) => 
`type Single${typeName}Output{
  data: ${typeName}
}`

/* ------------------------------------- Mutation Types ------------------------------------- */

/*

createMovie(input: CreateMovieInput) : CreateMovieOutput

*/
export const createMutationTemplate = ({ typeName }) => `create${typeName}(input: Create${typeName}Input) : Create${typeName}Output`

/*

updateMovie(input: UpdateMovieInput) : UpdateMovieOutput

*/
export const updateMutationTemplate = ({ typeName }) => `update${typeName}(input: Update${typeName}Input) : Update${typeName}Output`

/*

upsertMovie(input: UpsertMovieInput) : UpsertMovieOutput

*/
export const upsertMutationTemplate = ({ typeName }) => `upsert${typeName}(input: Upsert${typeName}Input) : Upsert${typeName}Output`

/*

deleteMovie(input: DeleteMovieInput) : DeleteMovieOutput

*/
export const deleteMutationTemplate = ({ typeName }) => `delete${typeName}(input: Delete${typeName}Input) : Delete${typeName}Output`

/* ------------------------------------- Mutation Input Types ------------------------------------- */

/*

type CreateMovieInput {
  data: CreateMovieDataInput!
}

*/
export const createInputTemplate = ({ typeName }) =>
`type Create${typeName}Input{
  data: Create${typeName}DataInput!
}`

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
}`

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
}`

/*

type DeleteMovieInput {
  selector: MovieSelectorUniqueInput!
}

*/
export const deleteInputTemplate = ({ typeName }) =>
`type Delete${typeName}Input{
  selector: ${typeName}SelectorUniqueInput!
}`

/*

type CreateMovieDataInput {
  title: String
  description: String
}

*/
export const createDataInputTemplate = ({ typeName }) => 
`

`

/*

type UpdateMovieDataInput {
  title: String
  description: String
}

*/
export const updateDataInputTemplate = ({ typeName }) => 
`

`

/* ------------------------------------- Mutation Output Types ------------------------------------- */

/*

type CreateMovieOutput {
  data: Movie
}

*/
export const createOutputTemplate = ({ typeName }) => 
`type Create${typeName}Output{
  data: ${typeName}
}`

/*

type UpdateMovieOutput {
  data: Movie
}

*/
export const updateOutputTemplate = ({ typeName }) => 
`type Update${typeName}Output{
  data: ${typeName}
}`

/*

type UpsertMovieOutput {
  data: Movie
}

*/
export const upsertOutputTemplate = ({ typeName }) => 
`type Upsert${typeName}Output{
  data: ${typeName}
}`

/*

type DeleteMovieOutput {
  data: Movie
}

*/
export const deleteOutputTemplate = ({ typeName }) => 
`type Delete${typeName}Output{
  data: ${typeName}
}`


