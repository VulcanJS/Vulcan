Categories = new Meteor.Collection('categories');

Meteor.methods({
  category: function(category){
    var user = Meteor.user();

    if (!user || !isAdmin(user))
      throw new Meteor.Error('You need to login and be an admin to add a new category.')
    
    var categoryId=Categories.insert(category);

    return category.name;
  }
});