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
  defaultArgument = defaultArgument || '';
  setting = getSetting(setting, defaultArgument);
  return setting;
});
UI.registerHelper('isLoggedIn', function() {
  return !!Meteor.user();
});
UI.registerHelper('canView', function() {
  return can.view(Meteor.user());
});
UI.registerHelper('canPost', function() {
  return can.post(Meteor.user());
});
UI.registerHelper('canComment', function() {
  return can.comment(Meteor.user());
});
UI.registerHelper('isAdmin', function(showError) {
  if (isAdmin(Meteor.user())) {
    return true;
  }
  if ((typeof showError === 'string') && (showError === 'true')) {
    flashMessage(i18n.t('sorry_you_do_not_have_access_to_this_page'), 'error');
  }
  return false;
});
UI.registerHelper('canEdit', function(item) {
  return can.edit(Meteor.user(), item, false);
});

UI.registerHelper('log', function(context){
  console.log(context);
});

UI.registerHelper('formatDate', function(datetime, format) {
  Session.get('momentLocale'); // depend on session variable to reactively rerun the helper
  return moment(datetime).format(format);
});

UI.registerHelper('timeAgo', function(datetime) {
  Session.get('momentLocale'); // depend on session variable to reactively rerun the helper
  return moment(datetime).fromNow();
});

UI.registerHelper('sanitize', function(content) {
  console.log('cleaning up…');
  console.log(content);
  return cleanUp(content);
});

UI.registerHelper('pluralize', function(count, string) {
  string = count === 1 ? string : string + 's';
  return i18n.t(string);
});

UI.registerHelper('profileUrl', function(userOrUserId) {
  var user = (typeof userOrUserId === 'string') ? Meteor.users.findOne(userOrUserId) :  userOrUserId;
  if (!!user) {
    return getProfileUrl(user);
  }
});

UI.registerHelper('friendVotesUrl', function(friendId) {
  var user = Meteor.user();
  if (!!user) {
    return getFriendVotesUrl(user, friendId);
  }
});

UI.registerHelper('userName', function(userOrUserId) {
  var user = (typeof userOrUserId === 'string') ? Meteor.users.findOne(userOrUserId) :  userOrUserId;
  if (!!user) {
    return getUserName(user);
  }
});

// UI.registerHelper('wonderCount', function(userOrUserId) {
//   var user = (typeof userOrUserId === 'string') ? Meteor.users.findOne(userOrUserId) :  userOrUserId;

//     if (_.isUndefined(this.votes.pollvotedPosts)) {
//       return 0;
//     }
//     var other = this.votes.pollvotedPosts,
//         self = Meteor.user().votes.pollvotedPosts,
//         togetherIds = _.pluck(self.concat(other), 'itemId'),
//         togetherLength = togetherIds.length;
//     return Math.round( ( ( togetherLength - (_.uniq(togetherIds).length ) ) / togetherLength) * 100 );
// });

// UI.registerHelper('sharedOpinionCount', function(userOrUserId) {
//   var user = (typeof userOrUserId === 'string') ? Meteor.users.findOne(userOrUserId) :  userOrUserId;

//   console.log(userOrUserId);
  
//   console.log(Meteor.users.findOne(userOrUserId));

//     if (_.isUndefined(this.votes.pollvotedPosts)) {
//       return 0;
//     }
//     // var other = this.votes.pollvotedPosts,
//         // self = Meteor.user().votes.pollvotedPosts,
//         together = self.concat(other),
//         selfItemIds = _.pluck(self, 'itemId'),
//         otherItemIds = _.pluck(other, 'itemId'),
//         sameIds = _.intersection(selfItemIds, otherItemIds),
//         sameVotes = [];

//     for (var i=0, l=together.length; i<l; i++) {
//       if ( _.contains(sameIds,together[i].itemId) && !_.isUndefined(together[i].voteOrder) ) {
//         sameVotes.push(together[i].itemId+"-"+together[i].voteOrder);
//       }
//     } 

//     if (_.isEmpty(sameVotes)) {
//       return 0;
//     }

//     return Math.round( ( (sameVotes.length - _.uniq(sameVotes).length) / sameIds.length ) * 100 );
// });


