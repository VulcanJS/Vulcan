import { GraphQLSchema } from 'meteor/vulcan:lib';

const specificResolvers = {
  Post: {
    feed(post, args, context) {
      return context.RSSFeeds.findOne({_id: post.feedId}, {fields: context.getViewableFields(context.currentUser, context.RSSFeeds)});
    },
  },
};

GraphQLSchema.addResolvers(specificResolvers);
