// ** Handlebars helpers **

Handlebars.registerHelper('canView', function(action) {
  var action=(typeof action !== 'string') ? null : action;
  return canView(Meteor.user(), action);
});
Handlebars.registerHelper('canPost', function(action) {
  var action=(typeof action !== 'string') ? null : action;
  return canPost(Meteor.user(), action);
});
Handlebars.registerHelper('canComment', function(action) {
  var action=(typeof action !== 'string') ? null : action;
  return canComment(Meteor.user(), action);
});
Handlebars.registerHelper('canUpvote', function(collection, action) {
  var action=(typeof action !== 'string') ? null : action;
  return canUpvote(Meteor.user()), collection, action;
});
Handlebars.registerHelper('canDownvote', function(collection, action) {
  var action=(typeof action !== 'string') ? null : action;
  return canDownvote(Meteor.user(), collection, action);
});
Handlebars.registerHelper('isAdmin', function(showError) {
  if(isAdmin(Meteor.user())){
    return true;
  }else{
    if((typeof showError === "string") && (showError === "true"))
      throwError('Sorry, you do not have access to this page');
    return false;
  }
});
Handlebars.registerHelper('canEdit', function(collectionName, item, action) {
  var action = (typeof action !== 'string') ? null : action;
  var collection = (typeof collectionName !== 'string') ? Posts : eval(collectionName);
  console.log(item);
  // var itemId = (collectionName==="Posts") ? Session.get('selectedPostId') : Session.get('selectedCommentId');
  // var item=collection.findOne(itemId);
  return item && canEdit(Meteor.user(), item, action);
});