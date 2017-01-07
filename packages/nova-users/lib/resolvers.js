import { GraphQLSchema } from 'meteor/nova:lib';

const specificResolvers = {
  User: {
    __downvotedComments(user, args, context) {
      return user.__downvotedComments ? user.__downvotedComments : []
    },
    __downvotedPosts(user, args, context) {
      return user.__downvotedPosts ? user.__downvotedPosts : []
    },
    __upvotedComments(user, args, context) {
      return user.__upvotedComments ? user.__upvotedComments : []
    },
    __upvotedPosts(user, args, context) {
      return user.__upvotedPosts ? user.__upvotedPosts : [];
    },
  },
  Query: {
    currentUser(root, args, context) {
      return context && context.userId ? context.Users.findOne(context.userId) : null;
    },
  },
};

GraphQLSchema.addResolvers(specificResolvers);

const resolvers = {

  list: {

    name: 'usersList',

    resolver(root, {terms}, context, info) {
      const options = {
        // protected limit
        limit: (terms.limit < 1 || terms.limit > 100) ? 100 : terms.limit,
        skip: terms.offset,
        // keep only fields that should be viewable by current user
        fields: context.getViewableFields(context.currentUser, context.Users),
      };
      return context.Users.find({}, options).fetch();
    },

  },

  single: {
    
    name: 'usersSingle',
    
    resolver(root, {documentId, slug}, context) {
      const selector = documentId ? {_id: documentId} : {'__slug': slug};
      return context.Users.findOne(selector, { fields: context.getViewableFields(context.currentUser, context.Users) });
    },
  
  },

  total: {
    
    name: 'usersTotal',
    
    resolver(root, args, context) {
      return context.Users.find().count();
    },
  
  }
};

export default resolvers;