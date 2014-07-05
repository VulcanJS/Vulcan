Template[getTemplate('toolbox')].events({
  'click .update-categories':function(){

  },
  'click .give-invites':function(){
      Meteor.call('giveInvites');
  } ,
  'click .update-user-profiles':function(){
      Meteor.call('updateUserProfiles');
  }, 
  'click .update-posts-slugs':function(){
      Meteor.call('updatePostsSlugs');
  }
});
