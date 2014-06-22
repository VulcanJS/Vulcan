Categories = new Meteor.Collection('categories');

CategorySchema = new SimpleSchema({
 _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
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

// push "categories" property to addToPostSchema, so that it's later added to postSchema
addToPostSchema.push(
  {
    propertyName: 'categories',
    propertySchema: {
      type: [CategorySchema],
      optional: true
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
      throw new Meteor.Error(i18n.t('You need to login and be an admin to add a new category.'));
    var categoryId=Categories.insert(category);
    return category.name;
  }
});
});