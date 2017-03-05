import { GraphQLSchema } from 'meteor/nova:core';

// add these specific resolvers separately
const specificResolvers = {
  Post: {
    categories(post, args, context) {
      return post.categories ? context.Categories.find({_id: {$in: post.categories}}, { fields: context.getViewableFields(context.currentUser, context.Categories) }).fetch() : [];
    },
  },
  Category: {
    parent(category, args, context) {
      return category.parentId ? context.Categories.findOne({_id: category.parentId }, { fields: context.getViewableFields(context.currentUser, context.Categories) }) : null;
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
