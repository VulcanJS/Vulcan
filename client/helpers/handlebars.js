// ** Handlebars helpers **

UI.registerHelper('eachWithRank', function(items, options) {
  // not used, forces multiple renders
  // note: cannot use this because it would delete and recreate all nodes
  items.rewind();
  var out = '';
  items.forEach(function(item, i){
    var key = 'Branch-' + i;
    out = out + Spark.labelBranch(key,function(){
      return options.fn(_.extend(item, {rank: i}));
    });
  });
  return out;
});

UI.registerHelper('getSetting', function(setting, defaultArgument){
  var defaultArgument = (typeof defaultArgument !== 'undefined') ? defaultArgument : '';
  var setting = getSetting(setting, defaultArgument);
  return setting;
});
UI.registerHelper('isLoggedIn', function() {
  return !!Meteor.user();
});
UI.registerHelper('canView', function() {
  return canView(Meteor.user());
});
UI.registerHelper('canPost', function() {
  return canPost(Meteor.user());
});
UI.registerHelper('canComment', function() {
  return canComment(Meteor.user());
});
UI.registerHelper('canUpvote', function(collection) {
  return canUpvote(Meteor.user(), collection);
});
UI.registerHelper('canDownvote', function(collection) {
  return canDownvote(Meteor.user(), collection);
});
UI.registerHelper('isAdmin', function(showError) {
  if(isAdmin(Meteor.user())){
    return true;
  }else{
    if((typeof showError === "string") && (showError === "true"))
      throwError(i18n.t('Sorry, you do not have access to this page'));
    return false;
  }
});
UI.registerHelper('canEdit', function(collectionName, item, action) {
  var action = (typeof action !== 'string') ? null : action;
  var collection = (typeof collectionName !== 'string') ? Posts : eval(collectionName);
  // console.log(item);
  // var itemId = (collectionName==="Posts") ? Session.get('selectedPostId') : Session.get('selectedCommentId');
  // var item=collection.findOne(itemId);
  return item && canEdit(Meteor.user(), item, action);
});

UI.registerHelper('log', function(context){
  console.log(context);
});

UI.registerHelper("formatDate", function(datetime, format) {
  return moment(datetime).format(format);
});

UI.registerHelper("sanitize", function(content) {
  console.log('cleaning up…')
  console.log(content)
  return cleanUp(content);
});

UI.registerHelper('pluralize', function(count, string) {
  string = count === 1 ? string : string + 's';
  return i18n.t(string);
});