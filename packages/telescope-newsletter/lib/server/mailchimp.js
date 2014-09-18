scheduleCampaign = function (campaign, isTest) {
  var isTest = typeof isTest === 'undefined' ? false : isTest;

  MailChimpOptions.apiKey = getSetting('mailChimpAPIKey');
  MailChimpOptions.listId = getSetting('mailChimpListId');

  var htmlToText = Npm.require('html-to-text');
  var text = htmlToText.fromString(campaign.html, {
      wordwrap: 130
  });
  var defaultEmail = getSetting('defaultEmail');
  var result= '';

  if(!!MailChimpOptions.apiKey && !!MailChimpOptions.listId){

    console.log( 'Creating campaign…');

    try {
        var api = new MailChimp();
    } catch ( error ) {
        console.log( error.message );
    }

    api.call( 'campaigns', 'create', {
      type: 'regular',
      options: {
        list_id: MailChimpOptions.listId,
        subject: campaign.subject,
        from_email: getSetting('defaultEmail'),
        from_name: getSetting('title')+ ' Top Posts',
      },
      content: {
        html: campaign.html,
        text: text
      }
    }, Meteor.bindEnvironment(function ( error, result ) {
      if ( error ) {
        console.log( error.message );
        result = error.message;
      } else {
        console.log( 'Campaign created');
        // console.log( JSON.stringify( result ) );

        var cid = result.id;
        var archive_url = result.archive_url;
        var scheduledTime = moment().zone(0).add('hours', 1).format("YYYY-MM-DD HH:mm:ss");

        api.call('campaigns', 'schedule', {
          cid: cid,
          schedule_time: scheduledTime
        }, Meteor.bindEnvironment(function ( error, result) {
          if (error) {
            console.log( error.message );
            result = error.message;
          }else{
            console.log('Campaign scheduled for '+scheduledTime);
            console.log(campaign.subject)
            // console.log( JSON.stringify( result ) );

            // if this is not a test, mark posts as sent
            if (!isTest)
              Posts.update({_id: {$in: campaign.postIds}}, {$set: {scheduledAt: new Date()}}, {multi: true})

            // send confirmation email
            var confirmationHtml = getEmailTemplate('emailDigestConfirmation')({
              time: scheduledTime,
              newsletterLink: archive_url,
              subject: campaign.subject
            });
            sendEmail(defaultEmail, 'Newsletter scheduled', buildEmailTemplate(confirmationHtml));
            result = campaign.subject;
          }
        }));
      }
    }));
  }
  return result;
}

addToMailChimpList = function(userOrEmail, confirm, done){
  var user, email;

  if(typeof userOrEmail == "string"){
    user = null;
    email = userOrEmail;
  }else if(typeof userOrEmail == "object"){
    user = userOrEmail;
    email = getEmail(user);
    if (!email)
      throw 'User must have an email address';
  }

  MailChimpOptions.apiKey = getSetting('mailChimpAPIKey');
  MailChimpOptions.listId = getSetting('mailChimpListId');
  // add a user to a MailChimp list.
  // called when a new user is created, or when an existing user fills in their email
  if(!!MailChimpOptions.apiKey && !!MailChimpOptions.listId){

    console.log('adding "'+email+'" to MailChimp list…');

    try {
        var api = new MailChimp();
    } catch ( error ) {
        console.log( error.message );
    }

    api.call( 'lists', 'subscribe', {
      id: MailChimpOptions.listId,
      email: {"email": email},
      double_optin: confirm
    }, Meteor.bindEnvironment(function ( error, result ) {
      if ( error ) {
        console.log( error.message );
        done(error, null);
      } else {
        console.log( JSON.stringify( result ) );
        if(!!user)
          setUserSetting('subscribedToNewsletter', true, user);
        done(null, result);
      }
    }));
  }

};

syncAddToMailChimpList = Async.wrap(addToMailChimpList);

Meteor.methods({
  addCurrentUserToMailChimpList: function(){
    var currentUser = Meteor.users.findOne(this.userId);
    try {
      return syncAddToMailChimpList(currentUser, false);
    } catch (error) {
      throw new Meteor.Error(500, error.message);
    }
  },
  addEmailToMailChimpList: function (email) {
    try {
      return syncAddToMailChimpList(email, true);
    } catch (error) {
      throw new Meteor.Error(500, error.message);
    }
  }
})