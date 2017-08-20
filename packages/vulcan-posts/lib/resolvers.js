import { addGraphQLResolvers, Utils } from 'meteor/vulcan:core';

const specificResolvers = {
  Mutation: {
    increasePostViewCount(root, { postId }, context) {
      return context.Posts.update({_id: postId}, { $inc: { viewCount: 1 }});
    }
  }
};

addGraphQLResolvers(specificResolvers);

const resolvers = {

  list: {

    name: 'PostsList',

    resolver(root, {terms}, {currentUser, Users, Posts}, info) {

      // get selector and options from terms and perform Mongo query
      let {selector, options} = Posts.getParameters(terms);
      options.skip = terms.offset;
      const posts = Posts.find(selector, options).fetch();

      // restrict documents fields
      const viewablePosts = _.filter(posts, post => Posts.checkAccess(currentUser, post));
      const restrictedPosts = Users.restrictViewableFields(currentUser, Posts, viewablePosts);

      // prime the cache
      restrictedPosts.forEach(post => Posts.loader.prime(post._id, post));

      return restrictedPosts;
    },

  },

  single: {
    
    name: 'PostsSingle',

    async resolver(root, {documentId, slug}, {currentUser, Users, Posts}) {

      // don't use Dataloader if post is selected by slug
      const post = documentId ? await Posts.loader.load(documentId) : (slug ? Posts.findOne({slug}) : Posts.findOne());

      Utils.performCheck(Posts.checkAccess, currentUser, post, Posts, documentId);

      return Users.restrictViewableFields(currentUser, Posts, post);
    },
  
  },

  total: {
    
    name: 'PostsTotal',
    
    resolver(root, {terms}, {Posts}) {
      const {selector} = Posts.getParameters(terms);
      return Posts.find(selector).count();
    },
  
  }
};

export default resolvers;
