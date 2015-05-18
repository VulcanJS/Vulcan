// ** Handlebars helpers **

Template.registerHelper('eachWithRank', function(items, options) {
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
Template.registerHelper('isLoggedIn', function() {
  return !!Meteor.user();
});
Template.registerHelper('canView', function() {
  return Users.can.view(Meteor.user());
});
Template.registerHelper('canPost', function() {
  return Users.can.post(Meteor.user());
});
Template.registerHelper('canComment', function() {
  return Users.can.comment(Meteor.user());
});
Template.registerHelper('isAdmin', function(user) {
  var user = typeof user === "undefined" ? Meteor.user() : user;
  if (Users.is.admin(Meteor.user())) {
    return true;
  }
  return false;
});
Template.registerHelper('canEdit', function(item) {
  return Users.can.edit(Meteor.user(), item, false);
});

Template.registerHelper('log', function(context){
  console.log(context);
});

Template.registerHelper('formatDate', function(datetime, format) {
  Session.get('momentLocale'); // depend on session variable to reactively rerun the helper
  return moment(datetime).format(format);
});

Template.registerHelper('timeAgo', function(datetime) {
  Session.get('momentLocale'); // depend on session variable to reactively rerun the helper
  return moment(datetime).fromNow();
});

Template.registerHelper('sanitize', function(content) {
  console.log('cleaning up…');
  console.log(content);
  return Telescope.utils.cleanUp(content);
});

Template.registerHelper('pluralize', function(count, string) {
  string = count === 1 ? string : string + 's';
  return i18n.t(string);
});

Template.registerHelper('getProfileUrl', function(userOrUserId) {
  var user = (typeof userOrUserId === 'string') ? Meteor.users.findOne(userOrUserId) :  userOrUserId;
  if (!!user) {
    return Users.getProfileUrl(user);
  }
});

Template.registerHelper('getUsername', function(userOrUserId) {
  var user = (typeof userOrUserId === 'string') ? Meteor.users.findOne(userOrUserId) :  userOrUserId;
  if (!!user) {
    return Users.getUserName(user);
  }
});

Template.registerHelper('getDisplayName', function(userOrUserId) {
  var user = (typeof userOrUserId === 'string') ? Meteor.users.findOne(userOrUserId) :  userOrUserId;
  if (!!user) {
    return Users.getDisplayName(user);
  }
});

Template.registerHelper('icon', function(iconName, iconClass) {
  return Telescope.utils.getIcon(iconName, iconClass);
});
