import { GraphQLSchema } from 'meteor/vulcan:lib';

const specificResolvers = {
  RSSFeed: {
    user(message, args, context) {
      return context.Users.findOne({_id: message.userId}, {fields: context.getViewableFields(context.currentUser, context.Users)});
    },
  },
};

GraphQLSchema.addResolvers(specificResolvers);

const resolvers = {

  list: {

    name: 'rssFeedList',

    resolver(root, {terms}, {currentUser, RSSFeeds, Users}, info) {
      // get selector and options from terms and perform Mongo query
      let {selector, options} = RSSFeeds.getParameters(terms);
      options.limit = (terms.limit < 1 || terms.limit > 1000) ? 1000 : terms.limit;
      options.skip = terms.offset;
      const rssFeeds = RSSFeeds.find(selector, options).fetch();

      //restrict document fields
      const restrictedRssFeeds = Users.restrictViewableFields(currentUser, RSSFeeds, rssFeeds);

      //prime the cache
      restrictedRssFeeds.forEach(rssFeed => RSSFeeds.loader.prime(rssFeed._id, rssFeed));

      return restrictedRssFeeds;
    },

  },

  single: {

    name: 'rssFeedSingle',

    resolver(root, {documentId}, context) {
      return context.RSSFeeds.findOne({_id: documentId}, { fields: context.getViewableFields(context.currentUser, context.RSSFeeds) });
    },

  },

  total: {

    name: 'rssFeedTotal',

    resolver(root, {terms}, context) {
      const {selector} = context.RSSFeeds.getParameters(terms);
      return context.RSSFeeds.find(selector).count();
    },

  }
};


export default resolvers;
