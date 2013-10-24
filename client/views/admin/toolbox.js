Template.toolbox.events= {
  'click .update-categories':function(){

  },
  'click .give-invites':function(){
      Meteor.call('giveInvites');
  } ,
  'click .update-user-slugs':function(){
      Meteor.call('updateUserSlugs');
  } 
}