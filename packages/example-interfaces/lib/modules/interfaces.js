import { addGraphQLSchema, addGraphQLResolvers } from 'meteor/vulcan:core';

addGraphQLSchema(`
  interface HierarchicalInterface {
    parentId: String
    parent: HierarchicalInterface
  }
`);

// type must be resolved dynamically at execution time. To prevent this resolver from knowing
// all the implementing types we return the parentType name. Note that this may not always work
const resolveType = (obj, context, info) => info.parentType.name;

addGraphQLResolvers({
  HierarchicalInterface: {
    __resolveType: resolveType,
  },
});
