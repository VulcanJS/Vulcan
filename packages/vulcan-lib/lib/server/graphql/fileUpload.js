export const fileUploadTypeDefs = `
# @see https://www.apollographql.com/docs/apollo-server/data/file-uploads/
# The implementation for this scalar is provided by the
# 'GraphQLUpload' export from the 'graphql-upload' package
# in the resolver map below.
scalar Upload
type File {
  filename: String!
  mimetype: String!
  encoding: String!
}
`;
