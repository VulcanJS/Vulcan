import Telescope from 'meteor/nova:lib';
import Users from 'meteor/nova:users';

// shortcut
const gVF = Users.getViewableFields;

const resolvers = {
  Post: {
    categories(post, args, context) {
      return post.categories ? context.Categories.find({_id: {$in: post.categories}}, { fields: gVF(context.currentUser, context.Categories) }).fetch() : [];
    },
  },
  Category: {
    parent(category, args, context) {
      return category.parent ? context.Categories.findOne({_id: category.parent }, { fields: gVF(context.currentUser, context.Categories) }) : null;
    }
  },
  Query: {
    categories(root, args, context) {
      const options = {
        limit: 5,
        fields: gVF(context.currentUser, context.Categories)
      };
      return context.Categories.find({}, options).fetch();
    },
    category(root, args, context) {
      return context.Categories.findOne({_id: args._id}, { fields: gVF(context.currentUser, context.Categories) });
    },
  },
};

Telescope.graphQL.addResolvers(resolvers);