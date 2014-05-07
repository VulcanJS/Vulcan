Categories = new Meteor.Collection('categories');

Categories.allow({
  insert: isAdminById
, update: isAdminById
, remove: isAdminById
});

Meteor.methods({
  category: function(category){
    if (!Meteor.user() || !isAdmin(Meteor.user()))
      throw new Meteor.Error(i18n.t('You need to login and be an admin to add a new category.'));
    var categoryId=Categories.insert(category);
    return category.name;
  }
});