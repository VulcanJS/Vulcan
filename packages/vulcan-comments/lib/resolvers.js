// root resolvers: basic list, single, and total query resolvers
const resolvers = {

  list: {

    name: 'commentsList',

    resolver(root, {terms}, {currentUser, Users, Comments}) {

      // get selector and options from terms and perform Mongo query
      let {selector, options} = Comments.getParameters(terms);
      options.skip = terms.offset;
      const comments = Comments.find(selector, options).fetch();

      // restrict documents fields
      const restrictedComments = Users.restrictViewableFields(currentUser, Comments, comments);

      // prime the cache
      restrictedComments.forEach(comment => Comments.loader.prime(comment._id, comment));

      return restrictedComments;
    },

  },

  single: {

    name: 'commentsSingle',

    async resolver(root, {documentId}, {currentUser, Users, Comments}) {
      const comment = await Comments.loader.load(documentId);
      return Users.restrictViewableFields(currentUser, Comments, comment);
    },

  },

  total: {

    name: 'commentsTotal',
    // broken because it doesn't take any arguments in the query
    resolver(root, {terms}, context) {
      return context.Comments.find({postId: terms.postId}).count();
    },

  }
};

export default resolvers;
