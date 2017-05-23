import { GraphQLSchema } from 'meteor/vulcan:core';

// add these specific resolvers separately
const specificResolvers = {
  Post: {
    async categories(post, args, {currentUser, Users, Categories}) {
      if (!post.categories) return [];
      const categories = _.compact(await Categories.loader.loadMany(post.categories));
      return Users.restrictViewableFields(currentUser, Categories, categories);
    },
  },
  Category: {
    async parent(category, args, {currentUser, Users, Categories}) {
      if (!category.parentId) return null;
      const parent = await Categories.loader.load(category.parentId);
      return Users.restrictViewableFields(currentUser, Categories, parent);
    }
  },
};
GraphQLSchema.addResolvers(specificResolvers);

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
