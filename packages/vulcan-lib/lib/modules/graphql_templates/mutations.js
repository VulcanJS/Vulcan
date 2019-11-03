import { convertToGraphQL } from './types.js';

/* ------------------------------------- Mutation Types ------------------------------------- */

/*

Mutation for creating a new document

createMovie(input: CreateMovieInput) : MovieOutput

*/
export const createMutationTemplate = ({ typeName }) =>
  `create${typeName}(data: Create${typeName}DataInput!) : ${typeName}Output`;

/*

Mutation for updating an existing document

updateMovie(input: UpdateMovieInput) : MovieOutput

*/
export const updateMutationTemplate = ({ typeName }) =>
  `update${typeName}(input: Mutation${typeName}Input, _id: String, selector: ${typeName}SelectorUniqueInput, data: Update${typeName}DataInput! ) : ${typeName}Output`;

/*

Mutation for updating an existing document; or creating it if it doesn't exist yet

upsertMovie(input: UpsertMovieInput) : MovieOutput

*/
export const upsertMutationTemplate = ({ typeName }) =>
  `upsert${typeName}(input: Mutation${typeName}Input, _id: String, selector: ${typeName}SelectorUniqueInput, data: Update${typeName}DataInput! ) : ${typeName}Output`;

/*

Mutation for deleting an existing document

deleteMovie(input: DeleteMovieInput) : MovieOutput

*/
export const deleteMutationTemplate = ({ typeName }) =>
  `delete${typeName}(input: Mutation${typeName}Input, _id: String, selector: ${typeName}SelectorUniqueInput) : ${typeName}Output`;

/* ------------------------------------- Mutation Input Types ------------------------------------- */


// find a single doc to mutate
export const mutationInputTemplate = ({ typeName }) =>
  `input Mutation${typeName}Input {
  # filtering
  filter: ${typeName}FilterInput
  sort: ${typeName}SortInput
  search: String
  _id: String

  # backwards-compatibility
  selector: ${typeName}SelectorUniqueInput

}`;

// TODO: not currently used

/*

Type for create mutation input argument

type CreateMovieInput {
  data: CreateMovieDataInput!
}

*/
export const createInputTemplate = ({ typeName }) =>
  `input Create${typeName}Input {
  data: Create${typeName}DataInput!
}`;

/*

Type for update mutation input argument

type UpdateMovieInput {
  selector: MovieSelectorUniqueInput!
  data: UpdateMovieDataInput!
}

Note: selector is for backwards-compatibility

*/
export const updateInputTemplate = ({ typeName }) =>
  `input Update${typeName}Input{
  filter: ${typeName}FilterInput
  selector: ${typeName}SelectorUniqueInput
  data: Update${typeName}DataInput!
}`;

/*

Type for upsert mutation input argument

Note: upsertInputTemplate uses same data type as updateInputTemplate

type UpsertMovieInput {
  selector: MovieSelectorUniqueInput!
  data: UpdateMovieDataInput!
}

Note: selector is for backwards-compatibility

*/
export const upsertInputTemplate = ({ typeName }) =>
  `input Upsert${typeName}Input{
  filter: ${typeName}FilterInput
  selector: ${typeName}SelectorUniqueInput
  data: Update${typeName}DataInput!
}`;

/*

Type for delete mutation input argument

type DeleteMovieInput {
  selector: MovieSelectorUniqueInput!
}

Note: selector is for backwards-compatibility

*/
export const deleteInputTemplate = ({ typeName }) =>
  `input Delete${typeName}Input{
  filter: ${typeName}FilterInput
  selector: ${typeName}SelectorUniqueInput
}`;

/*

Type for the create mutation input argument's data property

type CreateMovieDataInput {
  title: String
  description: String
}

*/
export const createDataInputTemplate = ({ typeName, fields }) =>
  `input Create${typeName}DataInput {
${convertToGraphQL(fields, '  ')}
}`;

/*

Type for the update mutation input argument's data property

type UpdateMovieDataInput {
  title: String
  description: String
}

*/
export const updateDataInputTemplate = ({ typeName, fields }) =>
  `input Update${typeName}DataInput {
${convertToGraphQL(fields, '  ')}
}`;

/* ------------------------------------- Mutation Output Type ------------------------------------- */

/*

Type for the return value of all mutations

type MovieOutput {
  data: Movie
}

*/
export const mutationOutputTemplate = ({ typeName }) =>
  `type ${typeName}Output{
  data: ${typeName}
}`;

/* ------------------------------------- Mutation Queries ------------------------------------- */

/*

Create mutation query used on the client

mutation createMovie($data: CreateMovieDataInput!) {
  createMovie(data: $data) {
    data {
      _id
      name
      __typename
    }
    __typename
  }
}

*/
export const createClientTemplate = ({ typeName, fragmentName }) =>
  `mutation create${typeName}($data: Create${typeName}DataInput!) {
  create${typeName}(data: $data) {
    data {
      ...${fragmentName}
    }
  }
}`;

/*

Update mutation query used on the client

mutation updateMovie($selector: MovieSelectorUniqueInput!, $data: UpdateMovieDataInput!) {
  updateMovie(selector: $selector, data: $data) {
    data {
      _id
      name
      __typename
    }
    __typename
  }
}

*/
export const updateClientTemplate = ({ typeName, fragmentName }) =>
  `mutation update${typeName}($input: Mutation${typeName}Input, $_id: String, $selector: ${typeName}SelectorUniqueInput!, $data: Update${typeName}DataInput!) {
  update${typeName}(input: $input, _id: $_id, selector: $selector, data: $data) {
    data {
      ...${fragmentName}
    }
  }
}`;

/*

Upsert mutation query used on the client

mutation upsertMovie($selector: MovieSelectorUniqueInput!, $data: UpdateMovieDataInput!) {
  upsertMovie(selector: $selector, data: $data) {
    data {
      _id
      name
      __typename
    }
    __typename
  }
}

*/
export const upsertClientTemplate = ({ typeName, fragmentName }) =>
  `mutation upsert${typeName}($input: Mutation${typeName}Input, $_id: String, $selector: ${typeName}SelectorUniqueInput!, $data: Update${typeName}DataInput!) {
  upsert${typeName}(input: $input, _id: $_id, selector: $selector, data: $data) {
    data {
      ...${fragmentName}
    }
  }
}`;

/*

Delete mutation query used on the client

mutation deleteMovie($selector: MovieSelectorUniqueInput!) {
  deleteMovie(selector: $selector) {
    data {
      _id
      name
      __typename
    }
    __typename
  }
}

*/
export const deleteClientTemplate = ({ typeName, fragmentName }) =>
  `mutation delete${typeName}($input: Mutation${typeName}Input, $_id: String, $selector: ${typeName}SelectorUniqueInput!) {
  delete${typeName}(input: $input, _id: $_id, selector: $selector) {
    data {
      ...${fragmentName}
    }
  }
}`;
