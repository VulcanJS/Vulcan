import { GraphQLSchema } from 'meteor/nova:core';

// add these specific resolvers separately
const specificResolvers = {
  Post: {
    async categories(post, args, context) {
      if (post.categories) {
        console.log(post.categories);
        const categories = await context.BatchingCategories.find({_id: {$in: post.categories}}, { fields: context.getViewableFields(context.currentUser, context.Categories) });
        
        return categories;
      }
      return [];
    },
  },
  Category: {
    async parent(category, args, context) {
      if (category.parentId) {
        const categories = await context.BatchingCategories.findOne({_id: category.parentId }, { fields: context.getViewableFields(context.currentUser, context.Categories) });
        
        return categories;
      }
      return null;
    }
  },
};
GraphQLSchema.addResolvers(specificResolvers);

// root resolvers: basic list, single, and total query resolvers
const resolvers = {

  list: {

    name: 'categoriesList',

    async resolver(root, {terms}, context, info) {
      let {selector, options} = context.Categories.getParameters(terms);
      
      options.limit = terms.limit;
      options.skip = terms.offset;
      options.fields = context.getViewableFields(context.currentUser, context.Categories);
      
      const categories = await context.BatchingCategories.find(selector, options);
      
      return categories;
    },

  },

  single: {

    name: 'categoriesSingle',

    async resolver(root, {documentId, slug}, context) {
      const selector = documentId ? {_id: documentId} : {slug: slug};
      const category = await context.BatchingCategories.findOne(selector, { fields: context.getViewableFields(context.currentUser, context.Categories) });
      
      return category;
    },

  },

  total: {

    name: 'categoriesTotal',

    async resolver(root, args, context) {
      const categories = context.BatchingCategories.find();
      
      return categories.length;
    },

  }
};

export default resolvers;
