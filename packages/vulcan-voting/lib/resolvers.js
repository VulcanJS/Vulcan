import { GraphQLSchema } from 'meteor/vulcan:core';

const specificResolvers = {
  Post: {
    async upvoters(post, args, {currentUser, Users}) {
      if (!post.upvoters) return [];
      const upvoters = await Users.loader.loadMany(post.upvoters);
      return Users.restrictViewableFields(currentUser, Users, upvoters);
    },
    async downvoters(post, args, {currentUser, Users}) {
      if (!post.downvoters) return [];
      const downvoters = await Users.loader.loadMany(post.downvoters);
      return Users.restrictViewableFields(currentUser, Users, downvoters);
    },
  },
  Comment: {
    async upvoters(comment, args, {currentUser, Users}) {
      if (!comment.upvoters) return [];
      const upvoters = await Users.loader.loadMany(comment.upvoters);
      return Users.restrictViewableFields(currentUser, Users, upvoters);
    },
    async downvoters(comment, args, {currentUser, Users}) {
      if (!comment.downvoters) return [];
      const downvoters = await Users.loader.loadMany(comment.downvoters);
      return Users.restrictViewableFields(currentUser, Users, downvoters);    },
  },
};

GraphQLSchema.addResolvers(specificResolvers);
