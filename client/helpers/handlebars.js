// ** Handlebars helpers **

Handlebars.registerHelper('eachWithRank', function(items, options) {
  // not used, forces multiple renders
  // note: cannot use this because it would delete and recreate all nodes
  items.rewind()
  var out = '';
  items.forEach(function(item, i){
    var key = 'Branch-' + i;
    out = out + Spark.labelBranch(key,function(){
      return options.fn(_.extend(item, {rank: i}));
    });
  });
  return out;
});

Handlebars.registerHelper('getSetting', function(setting, defaultArgument){
  return getSetting(setting, defaultArgument);
});
Handlebars.registerHelper('canView', function() {
  return canView(Meteor.user());
});
Handlebars.registerHelper('canPost', function() {
  return canPost(Meteor.user());
});
Handlebars.registerHelper('canComment', function() {
  return canComment(Meteor.user());
});
Handlebars.registerHelper('canUpvote', function(collection) {
  return canUpvote(Meteor.user(), collection);
});
Handlebars.registerHelper('canDownvote', function(collection) {
  return canDownvote(Meteor.user(), collection);
});
Handlebars.registerHelper('isAdmin', function(showError) {
  if(isAdmin(Meteor.user())){
    return true;
  }else{
    if((typeof showError === "string") && (showError === "true"))
      throwError(i18n.t('Sorry, you do not have access to this page'));
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