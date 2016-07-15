import NovaEmail from 'meteor/nova:email';

// Invitation email
Picker.route('/email/invite-existing-user/:id?', function(params, req, res, next) {
  
  var html;
  var invitingUser = typeof params.id === "undefined" ? Meteor.users.findOne() : Meteor.users.findOne(params.id);
  
  var communityName = Settings.get('title','Telescope'),
      emailProperties = {
        newUser : false,
        communityName : communityName,
        actionLink : Telescope.utils.getSigninUrl(),
        invitedBy : Users.getDisplayName(invitingUser),
        profileUrl : Users.getProfileUrl(invitingUser)
      };

  html = NovaEmail.getTemplate('emailInvite')(emailProperties);
  res.end(NovaEmail.buildTemplate(html));
});

// Invitation email
Picker.route('/email/invite-new-user/:id?', function(params, req, res, next) {
  
  var html;
  var invitingUser = typeof params.id === "undefined" ? Meteor.users.findOne() : Meteor.users.findOne(params.id);
  
  var communityName = Settings.get('title','Telescope'),
      emailProperties = {
        newUser : true,
        communityName : communityName,
        actionLink : Telescope.utils.getSignupUrl(),
        invitedBy : Users.getDisplayName(invitingUser),
        profileUrl : Users.getProfileUrl(invitingUser)
      };

  html = NovaEmail.getTemplate('emailInvite')(emailProperties);
  res.end(NovaEmail.buildTemplate(html));
});