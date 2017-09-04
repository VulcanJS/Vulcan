/*

GraphQL config

*/

import { addGraphQLMutation } from 'meteor/vulcan:core';

addGraphQLMutation('increasePostViewCount(postId: String): Float');
