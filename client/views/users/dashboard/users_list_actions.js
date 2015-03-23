Template[getTemplate('users_list_actions')].helpers({
  isInvited: function() {
    return this.isInvited;
  },
  userIsAdmin: function(){
    return isAdmin(this);
  },
});

Template[getTemplate('users_list_actions')].events({
  'click .invite-link': function(e){
    e.preventDefault();
    Meteor.call('inviteUser', { userId : this._id });
  },
  'click .uninvite-link': function(e){
    e.preventDefault();
    Meteor.users.update(this._id,{
      $set:{
        isInvited: false
      }
    });
  },
  'click .admin-link': function(e){
    e.preventDefault();
    updateAdmin(this._id, true);
  },
  'click .unadmin-link': function(e){
    e.preventDefault();
    updateAdmin(this._id, false);
  },
  'click .delete-link': function(e){
    e.preventDefault();
    if(confirm(i18n.t("are_you_sure_you_want_to_delete")+getDisplayName(this)+"?"))
      Meteor.users.remove(this._id);
  }
});
