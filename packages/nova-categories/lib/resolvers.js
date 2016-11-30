import Telescope from 'meteor/nova:lib';

// add these specific resolvers separately
const specificResolvers = {
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
};
Telescope.graphQL.addResolvers(specificResolvers);

// root resolvers: basic list, single, and total query resolvers
const resolvers = {

  list: {

    name: 'categoriesList',

    resolver(root, {offset, limit}, context, info) {
      const options = {
        // protected limit
        limit: (limit < 1 || limit > 10) ? 10 : limit, // maybe remove the limit on categories?
        skip: offset,
        // keep only fields that should be viewable by current user
        fields: context.getViewableFields(context.currentUser, context.Categories),
      };
      return context.Categories.find({}, options).fetch();
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