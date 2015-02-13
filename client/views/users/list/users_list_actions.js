Template[getTemplate('users_list_actions')].helpers({
  isInvited: function() {
    return this.isInvited;
  },
  userIsAdmin: function(){
    return isAdmin(this);
  },
});

Template[getTemplate('users_list_actions')].events({
  'click .invite-link': function(e, instance){
    e.preventDefault();
    Meteor.call('inviteUser', { userId : instance.data._id });
  },
  'click .uninvite-link': function(e, instance){
    e.preventDefault();
    Meteor.users.update(instance.data._id,{
      $set:{
        isInvited: false
      }
    });
  },
  'click .admin-link': function(e, instance){
    e.preventDefault();
    updateAdmin(instance.data._id, true);
  },
  'click .unadmin-link': function(e, instance){
    e.preventDefault();
    updateAdmin(instance.data._id, false);
  },
  'click .delete-link': function(e, instance){
    e.preventDefault();
    if(confirm(i18n.t("are_you_sure_you_want_to_delete")+getDisplayName(instance.data)+"?"))
      Meteor.users.remove(instance.data._id);
  }
});
