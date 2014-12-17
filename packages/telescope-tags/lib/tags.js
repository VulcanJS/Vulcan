// category schema
categorySchema = new SimpleSchema({
 _id: {
    type: String,
    optional: true
  },
  order: {
    type: Number,
    optional: true
  },
  slug: {
    type: String
  },
  name: {
    type: String
  },
  description: {
    type: String,
    autoform: {
      rows: 5
    }
  }   
});

Categories = new Meteor.Collection("categories", {
  schema: categorySchema
});

// we want to wait until categories are all loaded to load the rest of the app
preloadSubscriptions.push('categories');

adminNav.push({
  route: 'categories',
  label: 'Categories',
  description: 'add_and_remove_categories'
});

// category post list parameters
viewParameters.category = function (terms) {
  var categoryId = Categories.findOne({slug: terms.category})._id;
  return {
    find: {'categories': {$in: [categoryId]}} ,
    options: {sort: {sticky: -1, score: -1}} // for now categories views default to the "top" view
  };
}

// push "categories" modules to postHeading
postHeading.push({
  template: 'postCategories',
  order: 30
});
  
// push "categoriesMenu" template to primaryNav
primaryNav.push('categoriesMenu');

// push "categories" property to addToPostSchema, so that it's later added to postSchema
addToPostSchema.push(
  {
    propertyName: 'categories',
    propertySchema: {
      type: [String],
      optional: true,
      editable: true,
      autoform: {
        editable: true,
        noselect: true,
        options: function () {
          var categories = Categories.find().map(function (category) {
            return {
              value: category._id,
              label: category.name
            }  
          });
          return categories;
        }
      }
    }
  }
);

Meteor.startup(function () {
  Categories.allow({
    insert: isAdminById
  , update: isAdminById
  , remove: isAdminById
  });

  Meteor.methods({
    category: function(category){
      console.log(category)
      if (!Meteor.user() || !isAdmin(Meteor.user()))
        throw new Meteor.Error(i18n.t('you_need_to_login_and_be_an_admin_to_add_a_new_category'));
      var categoryId=Categories.insert(category);
      return category.name;
    }
  });
});

getCategoryUrl = function(slug){
  return getSiteUrl()+'category/'+slug;
};