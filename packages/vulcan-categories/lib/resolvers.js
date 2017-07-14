
// root resolvers: basic list, single, and total query resolvers
const resolvers = {

  list: {

    name: 'categoriesList',

    resolver(root, {terms}, context, info) {
      let {selector, options} = context.Categories.getParameters(terms);
      
      options.limit = terms.limit;
      options.skip = terms.offset;
      options.fields = context.getViewableFields(context.currentUser, context.Categories);
      
      return context.Categories.find(selector, options).fetch();
    },

  },

  single: {

    name: 'categoriesSingle',

    resolver(root, {documentId, slug}, context) {
      const selector = documentId ? {_id: documentId} : {slug: slug};
      return context.Categories.findOne(selector, { fields: context.getViewableFields(context.currentUser, context.Categories) });
    },

  },

  total: {

    name: 'categoriesTotal',

    resolver(root, args, context) {
      return context.Categories.find().count();
    },

  }
};

export default resolvers;
