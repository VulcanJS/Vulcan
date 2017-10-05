/*

GraphQL config

*/

import { addGraphQLMutation, addGraphQLResolvers } from 'meteor/vulcan:core';

const specificResolvers = {
  Mutation: {
    increasePostViewCount(root, { postId }, context) {
      return context.Posts.update({_id: postId}, { $inc: { viewCount: 1 }});
    }
  }
};

addGraphQLResolvers(specificResolvers);
addGraphQLMutation('increasePostViewCount(postId: String): Float');



