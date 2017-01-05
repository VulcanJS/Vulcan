import { GraphQLSchema } from 'meteor/nova:core';

// add these specific resolvers separately
const specificResolvers = {
  Post: {
    categories(post, args, context) {
      return post.categories ? context.Categories.find({_id: {$in: post.categories}}, { fields: context.getViewableFields(context.currentUser, context.Categories) }).fetch() : [];
    },
  },
  // TODO: fix this
  // Category: {
  //   parent(category, args, context) {
  //     return category.parent ? context.Categories.findOne({_id: category.parent }, { fields: context.getViewableFields(context.currentUser, context.Categories) }) : null;
  //   }
  // },
};
GraphQLSchema.addResolvers(specificResolvers);

// root resolvers: basic list, single, and total query resolvers
const resolvers = {

  list: {

    name: 'categoriesList',

    resolver(root, {offset, limit, terms}, context, info) {
      let {selector, options} = context.Categories.getParameters(terms);
      
      options.limit = limit;
      options.skip = offset;
      options.fields = context.getViewableFields(context.currentUser, context.Categories);
      
      return context.Categories.find(selector, options).fetch();
    },

  },

  single: {

    name: 'categoriesSingle',

    resolver(root, {documentId}, context) {
      return context.Categories.findOne({_id: documentId}, { fields: context.getViewableFields(context.currentUser, context.Categories) });
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
