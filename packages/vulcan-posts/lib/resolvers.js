import { GraphQLSchema, Utils } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';

const specificResolvers = {
  Post: {
    async user(post, args, context) {
      console.log("// Post.user: ", new Date().getMilliseconds())
      const user = await context.Users.loader.load(post.userId, `Post.user (${post.title})`);
      return context.Users.restrictViewableFields(context.currentUser, context.Users, user);
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

    check(user, terms, Posts) {
      const {selector} = Posts.getParameters(terms);
      const status = _.findWhere(Posts.statuses, {value: selector.status || 2});
      return Users.canDo(user, `posts.view.${status.label}.all`);
    },

    async resolver(root, {terms}, context, info) {
      console.log("// Post.list: ", new Date().getMilliseconds())

      const { Posts, currentUser } = context;

      // check that the current user can access the current query terms
      Utils.performCheck(this, currentUser, terms, Posts);

      // get selector and options from terms and perform Mongo query
      let {selector, options} = Posts.getParameters(terms);
      options.limit = (terms.limit < 1 || terms.limit > 100) ? 100 : terms.limit;
      options.skip = terms.offset;
      const posts = Posts.find(selector, options).fetch();

      // restrict documents fields
      const restrictedPosts = Users.restrictViewableFields(currentUser, Posts, posts);

      // prime the cache
      restrictedPosts.forEach(post => Posts.loader.prime(post._id, post));

      return restrictedPosts;
    },

  },

  single: {
    
    name: 'postsSingle',

    check(user, document, collection) {
      if (!document) return false;
      const status = _.findWhere(collection.statuses, {value: document.status});
      return Users.owns(user, document) ? Users.canDo(user, `posts.view.${status.label}.own`) : Users.canDo(user, `posts.view.${status.label}.all`);
    },

    resolver(root, {documentId, slug}, context) {

      const selector = documentId ? {_id: documentId} : {'slug': slug};
      const post = context.Posts.findOne(selector);

      Utils.performCheck(this, context.currentUser, post, context.Posts);

      return context.Users.restrictViewableFields(context.currentUser, context.Posts, post);
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
