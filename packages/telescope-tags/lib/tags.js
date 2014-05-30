Categories = new Meteor.Collection('categories');

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