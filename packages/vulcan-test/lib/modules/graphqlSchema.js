// allow to easily test regex on a graphql string
// all blanks and series of blanks are replaces by one single space
export const normalizeGraphQLSchema = gqlSchema => gqlSchema.replace(/\s+/g, ' ').trim();