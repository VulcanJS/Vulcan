Template.users_list_actions.helpers({
  isInvited: function() {
    return this.telescope.isInvited;
  },
  userIsAdmin: function(){
    return Users.is.admin(this);
  },
});

Template.users_list_actions.events({
  'click .invite-link': function(e){
    e.preventDefault();
    Meteor.users.update(this._id, {$set: {"telescope.isInvited": true}});

  },
  'click .uninvite-link': function(e){
    e.preventDefault();
    Meteor.users.update(this._id, {$set: {"telescope.isInvited": false}});
  },
  'click .admin-link': function(e){
    e.preventDefault();
    Users.updateAdmin(this._id, true);
  },
  'click .unadmin-link': function(e){
    e.preventDefault();
    Users.updateAdmin(this._id, false);
  },
  'click .delete-link': function(e){
    e.preventDefault();
    if(confirm(i18n.t("are_you_sure_you_want_to_delete")+Users.getDisplayName(this)+"?"))
      Meteor.users.remove(this._id);
  }
});
