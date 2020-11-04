import { convertToGraphQL } from './types.js';
import { filterInputType, selectorUniqueInputType } from './filtering.js';

// eslint-disable-next-line
const deprecated = `# Deprecated (use 'input' field instead).`;

const mutationReturnProperty = 'data';

/* ------------------------------------- Mutation Types ------------------------------------- */

/*

Mutation for creating a new document

createMovie(input: CreateMovieInput) : MovieOutput

*/
export const createMutationType = typeName => `create${typeName}`;
export const createMutationTemplate = ({ typeName }) =>
  `${createMutationType(typeName)}(
  input: ${createInputType(typeName, false)},
  ${deprecated}
  data: ${createDataInputType(typeName, false)}
) : ${mutationOutputType(typeName)}`;

/*

Mutation for updating an existing document

updateMovie(input: UpdateMovieInput) : MovieOutput

*/
export const updateMutationType = typeName => `update${typeName}`;
export const updateMutationTemplate = ({ typeName }) =>
  `${updateMutationType(typeName)}(
  input: ${updateInputType(typeName, false)},
  ${deprecated}
  selector: ${selectorUniqueInputType(typeName)},
  ${deprecated}
  data: ${updateDataInputType(typeName)}
) : ${mutationOutputType(typeName)}`;

/*

Mutation for updating an existing document; or creating it if it doesn't exist yet

upsertMovie(input: UpsertMovieInput) : MovieOutput

*/
export const upsertMutationType = typeName => `upsert${typeName}`;
export const upsertMutationTemplate = ({ typeName }) =>
  `${upsertMutationType(typeName)}(
  input: ${upsertInputType(typeName, false)},
  ${deprecated}
  selector: ${selectorUniqueInputType(typeName)},
  ${deprecated}
  data: ${updateDataInputType(typeName, false)}
) : ${mutationOutputType(typeName)}`;

/*

Mutation for deleting an existing document

deleteMovie(input: DeleteMovieInput) : MovieOutput

*/
export const deleteMutationType = typeName => `delete${typeName}`;
export const deleteMutationTemplate = ({ typeName }) =>
  `${deleteMutationType(typeName)}(
  input: ${deleteInputType(typeName, false)},
  ${deprecated}
  selector: ${selectorUniqueInputType(typeName)}
) : ${mutationOutputType(typeName)}`;

/* ------------------------------------- Mutation Input Types ------------------------------------- */

/*

Type for create mutation input argument

type CreateMovieInput {
  data: CreateMovieDataInput!
}

*/
export const createInputType = typeName => `Create${typeName}Input`;
export const createInputTemplate = ({ typeName }) =>
  `input ${createInputType(typeName)} {
  data: ${createDataInputType(typeName, true)}
  # An identifier to name the mutation's execution context
  contextName: String
}`;

/*

Type for update mutation input argument

type UpdateMovieInput {
  selector: MovieSelectorUniqueInput!
  data: UpdateMovieDataInput!
}

Note: selector is for backwards-compatibility

*/
export const updateInputType = typeName => `Update${typeName}Input`;
export const updateInputTemplate = ({ typeName }) =>
  `input ${updateInputType(typeName)}{
  filter: ${filterInputType(typeName)}
  id: String
  data: ${updateDataInputType(typeName, true)}
  # An identifier to name the mutation's execution context
  contextName: String
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
export const upsertInputType = typeName => `Upsert${typeName}Input`;
export const upsertInputTemplate = ({ typeName }) =>
  `input ${upsertInputType(typeName)}{
  filter: ${filterInputType(typeName)}
  id: String
  data: ${updateDataInputType(typeName, true)}
  # An identifier to name the mutation's execution context
  contextName: String
}`;

/*

Type for delete mutation input argument

type DeleteMovieInput {
  selector: MovieSelectorUniqueInput!
}

Note: selector is for backwards-compatibility

*/
export const deleteInputType = typeName => `Delete${typeName}Input`;
export const deleteInputTemplate = ({ typeName }) =>
  `input ${deleteInputType(typeName)}{
  filter: ${filterInputType(typeName)}
  id: String
}`;

/*

Type for the create mutation input argument's data property

type CreateMovieDataInput {
  title: String
  description: String
}

*/
export const createDataInputType = (typeName, nonNull = false) => `Create${typeName}DataInput${nonNull ? '!' : ''}`;
export const createDataInputTemplate = ({ typeName, fields }) =>
  `input ${createDataInputType(typeName)} {
${convertToGraphQL(fields, '  ')}
}`;

/*

Type for the update & upsert mutations input argument's data property

type UpdateMovieDataInput {
  title: String
  description: String
}

*/
export const updateDataInputType = (typeName, nonNull = false) => `Update${typeName}DataInput${nonNull ? '!' : ''}`;
export const updateDataInputTemplate = ({ typeName, fields }) =>
  `input ${updateDataInputType(typeName)} {
${convertToGraphQL(fields, '  ')}
}`;

/* ------------------------------------- Mutation Output Type ------------------------------------- */

/*

Type for the return value of all mutations

type MovieOutput {
  data: Movie
}

*/
export const mutationOutputType = typeName => `${typeName}MutationOutput`;
export const mutationOutputTemplate = ({ typeName }) =>
  `type ${mutationOutputType(typeName)}{
  ${mutationReturnProperty}: ${typeName}
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
  `mutation ${createMutationType(typeName)}($input: ${createInputType(typeName)}, $data: ${createDataInputType(typeName)}) {
  ${createMutationType(typeName)}(input: $input, data: $data) {
    ${mutationReturnProperty} {
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
  `mutation ${updateMutationType(typeName)}($input: ${updateInputType(typeName)}, $selector: ${selectorUniqueInputType(
    typeName
  )}, $data: ${updateDataInputType(typeName, false)}) {
  ${updateMutationType(typeName)}(input: $input, selector: $selector, data: $data) {
    ${mutationReturnProperty} {
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
  `mutation ${upsertMutationType(typeName)}($input: ${upsertInputType(typeName)}, $selector: ${selectorUniqueInputType(
    typeName
  )}, $data: ${updateDataInputType(typeName, false)}) {
  ${upsertMutationType(typeName)}(input: $input, selector: $selector, data: $data) {
    ${mutationReturnProperty} {
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
  `mutation ${deleteMutationType(typeName)}($input: ${deleteInputType(typeName)}, $selector: ${selectorUniqueInputType(typeName)}) {
  ${deleteMutationType(typeName)}(input: $input, selector: $selector) {
    ${mutationReturnProperty} {
      ...${fragmentName}
    }
  }
}`;
