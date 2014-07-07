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
viewParameters.category = function (terms, baseParameters) {
  // always same as "top" view for now
  var parameters = deepExtend(true, baseParameters, {options: {sort: {sticky: -1, score: -1}}});;

  if(typeof terms.category !== 'undefined' && !!terms.category)
    _.extend(parameters.find, {'categories.slug': terms.category});

  return parameters;
}

// push "categoriesModule" modules to postModules
postModules.push({
  template: 'postCategories',
  position: 'right-left'
});
  
// push "categoriesMenu" template to navItems
navItems.push('categoriesMenu');

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