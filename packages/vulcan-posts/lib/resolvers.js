import { GraphQLSchema, Utils } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';

const specificResolvers = {
  Post: {
    async user(post, args, context) {
      if (!post.userId) return null;
      const user = await context.Users.loader.load(post.userId);
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

    check(currentUser, post, Posts) {
      if (Users.isAdmin(currentUser)) { // admins can always see everything
        return true;
      } else if (post.status === Posts.config.STATUS_APPROVED) {
        return !post.isFuture; // future posts should not be viewable
      } else if (post.status === Posts.config.STATUS_PENDING) {
        return Users.owns(currentUser, post); // pending posts only viewable by owner
      } else {
        return false;
      }
    },

    resolver(root, {terms}, {currentUser, Users, Posts}, info) {

      // get selector and options from terms and perform Mongo query
      let {selector, options} = Posts.getParameters(terms);
      options.limit = (terms.limit < 1 || terms.limit > 100) ? 100 : terms.limit;
      options.skip = terms.offset;
      const posts = Posts.find(selector, options).fetch();

      // restrict documents fields
      const viewablePosts = _.filter(posts, post => this.check(currentUser, post, Posts));
      const restrictedPosts = Users.restrictViewableFields(currentUser, Posts, viewablePosts);

      // prime the cache
      restrictedPosts.forEach(post => Posts.loader.prime(post._id, post));

      return restrictedPosts;
    },

  },

  single: {
    
    name: 'postsSingle',

    check(user, document, collection) {
      const status = _.findWhere(collection.statuses, {value: document.status});
      return Users.owns(user, document) ? Users.canDo(user, `posts.view.${status.label}.own`) : Users.canDo(user, `posts.view.${status.label}.all`);
    },

    async resolver(root, {documentId, slug}, {currentUser, Users, Posts}) {

      // don't use Dataloader if post is selected by slug
      const post = documentId ? await Posts.loader.load(documentId) : Posts.findOne({slug});

      Utils.performCheck(this, currentUser, post, Posts, documentId);

      return Users.restrictViewableFields(currentUser, Posts, post);
    },
  
  },

  total: {
    
    name: 'postsTotal',
    
    resolver(root, {terms}, {Posts}) {
      const {selector} = Posts.getParameters(terms);
      return Posts.find(selector).count();
    },
  
  }
};

export default resolvers;
