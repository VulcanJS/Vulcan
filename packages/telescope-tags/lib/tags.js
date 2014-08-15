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
});

Categories = new Meteor.Collection("categories", {
  schema: categorySchema
});

// category post list parameters
viewParameters.category = function (terms) { 
  return {
    find: {'categories.slug': terms.category},
    options: {sort: {sticky: -1, score: -1}}
  };
}

// push "categories" modules to postHeading
postHeading.push({
  template: 'postCategories',
  order: 3
});
  
// push "categoriesMenu" template to primaryNav
primaryNav.push('categoriesMenu');

// push "categories" property to addToPostSchema, so that it's later added to postSchema
addToPostSchema.push(
  {
    propertyName: 'categories',
    propertySchema: {
      type: [categorySchema],
      optional: true
    }
  }
);

var getCheckedCategories = function (properties) {
  properties.categories = [];
  $('input[name=category]:checked').each(function() {
    var categoryId = $(this).val();
    properties.categories.push(Categories.findOne(categoryId));
  });
  return properties;
}

postSubmitClientCallbacks.push(getCheckedCategories);
postEditClientCallbacks.push(getCheckedCategories);

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
        throw new Meteor.Error(i18n.t('You need to login and be an admin to add a new category.'));
      var categoryId=Categories.insert(category);
      return category.name;
    }
  });
});

getCategoryUrl = function(slug){
  return getSiteUrl()+'category/'+slug;
};