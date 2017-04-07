import { GraphQLSchema, Utils } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';
import { statuses } from './schema.js';

const specificResolvers = {
  Post: {
    user(post, args, context) {
      return context.Users.findOne({ _id: post.userId }, { fields: context.getViewableFields(context.currentUser, context.Users) });
    },
  },
  Mutation: {
    increasePostViewCount(root, { postId }, context) {
      return context.Posts.update({_id: postId}, { $inc: { viewCount: 1 }});
    }
  }
};

GraphQLSchema.addResolvers(specificResolvers);

const resolvers = {

  list: {

    name: 'postsList',

    check(user, selector) {
      const status = _.findWhere(statuses, {value: selector.status || 2});
      return Users.canDo(user, `posts.view.${status.label}.all`);
    },

    resolver(root, {terms}, context, info) {
      let {selector, options} = context.Posts.getParameters(terms);
      options.limit = (terms.limit < 1 || terms.limit > 100) ? 100 : terms.limit;
      options.skip = terms.offset;
      options.fields = context.getViewableFields(context.currentUser, context.Posts);

      Utils.performCheck(this, context.currentUser, selector);

      return context.Posts.find(selector, options).fetch();
    },

  },

  single: {
    
    name: 'postsSingle',

    check(user, document) {
      const status = _.findWhere(statuses, {value: document.status});
      return Users.owns(user, document) ? Users.canDo(user, `posts.view.${status.label}.own`) : Users.canDo(user, `posts.view.${status.label}.all`);
    },

    resolver(root, {documentId, slug}, context) {

      const selector = documentId ? {_id: documentId} : {'slug': slug};
      const post = context.Posts.findOne(selector);

      Utils.performCheck(this, context.currentUser, post);

      return context.Users.keepViewableFields(context.currentUser, context.Posts, post);
    },
  
  },

  total: {
    
    name: 'postsTotal',
    
    resolver(root, {terms}, context) {
      const {selector} = context.Posts.getParameters(terms);
      return context.Posts.find(selector).count();
    },
  
  }
};

export default resolvers;
