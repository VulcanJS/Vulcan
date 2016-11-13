import Telescope from 'meteor/nova:lib';
import mutations from './mutations.js';

export default resolvers = {
  Post: {
    categories(post, args, context) {
      return post.categories ? context.Categories.find({_id: {$in: post.categories}}, { fields: context.getViewableFields(context.currentUser, context.Categories) }).fetch() : [];
    },
  },
  Category: {
    parent(category, args, context) {
      return category.parent ? context.Categories.findOne({_id: category.parent }, { fields: context.getViewableFields(context.currentUser, context.Categories) }) : null;
    }
  },
  Query: {
    categories(root, args, context) {
      const options = {
        fields: context.getViewableFields(context.currentUser, context.Categories)
      };
      return context.Categories.find({}, options).fetch();
    },
    categoriesListTotal(root, args, context) {
      return context.Categories.find({}).count();
    },
    category(root, args, context) {
      return context.Categories.findOne({_id: args._id}, { fields: context.getViewableFields(context.currentUser, context.Categories) });
    },
  },
  Mutation: mutations,
};

Telescope.graphQL.addResolvers(resolvers);