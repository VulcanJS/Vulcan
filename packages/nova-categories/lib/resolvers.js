import Telescope from 'meteor/nova:lib';

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
        limit: 5,
        fields: context.getViewableFields(context.currentUser, context.Categories)
      };
      return context.Categories.find({}, options).fetch();
    },
    category(root, args, context) {
      return context.Categories.findOne({_id: args._id}, { fields: context.getViewableFields(context.currentUser, context.Categories) });
    },
  },
};

Telescope.graphQL.addResolvers(resolvers);