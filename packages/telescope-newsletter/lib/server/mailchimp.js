var htmlToText = Npm.require('html-to-text');

scheduleCampaign = function (campaign, isTest) {
  var isTest = typeof isTest === 'undefined' ? false : isTest;

  var apiKey = getSetting('mailChimpAPIKey');
  var listId = getSetting('mailChimpListId');

  if(!!apiKey && !!listId){

    try {

      var api = new MailChimp(apiKey);
      var text = htmlToText.fromString(campaign.html, {wordwrap: 130});
      var defaultEmail = getSetting('defaultEmail');
      var campaignOptions = {
        type: 'regular',
        options: {
          list_id: listId,
          subject: campaign.subject,
          from_email: defaultEmail,
          from_name: getSetting('title')+ ' Top Posts',
        },
        content: {
          html: campaign.html,
          text: text
        }
      };

      console.log( '// Creating campaign…');

      // create campaign
      var campaign = api.call( 'campaigns', 'create', campaignOptions);
      
      console.log( '// Campaign created');
      // console.log(campaign)

      var scheduledTime = moment().zone(0).add(1, 'hours').format("YYYY-MM-DD HH:mm:ss");

      var scheduleOptions = {
        cid: campaign.id,
        schedule_time: scheduledTime
      };

      // schedule campaign
      var schedule = api.call('campaigns', 'schedule', scheduleOptions);
      
      console.log('// Campaign scheduled for '+scheduledTime);
      // console.log(schedule)

      // if this is not a test, mark posts as sent
      if (!isTest)
        Posts.update({_id: {$in: campaign.postIds}}, {$set: {scheduledAt: new Date()}}, {multi: true})

      // send confirmation email
      var confirmationHtml = getEmailTemplate('emailDigestConfirmation')({
        time: scheduledTime,
        newsletterLink: campaign.archive_url,
        subject: campaign.subject
      });
      sendEmail(defaultEmail, 'Newsletter scheduled', buildEmailTemplate(confirmationHtml));

    } catch (error) {
      console.log(error);
    }
    return campaign.subject;
  }
}

addToMailChimpList = function(userOrEmail, confirm, done){
  
  var user, email;

  var confirm = (typeof confirm === 'undefined') ? false : confirm // default to no confirmation

  // not sure if it's really necessary that the function take both user and email?
  if (typeof userOrEmail == "string") {
    user = null;
    email = userOrEmail;
  } else if (typeof userOrEmail == "object") {
    user = userOrEmail;
    email = getEmail(user);
    if (!email)
      throw 'User must have an email address';
  }

  var apiKey = getSetting('mailChimpAPIKey');
  var listId = getSetting('mailChimpListId');

  // add a user to a MailChimp list.
  // called when a new user is created, or when an existing user fills in their email
  if(!!apiKey && !!listId){

    try {

      console.log('// Adding "'+email+'" to MailChimp list…');

      var api = new MailChimp(apiKey);
      var subscribeOptions = {
        id: listId,
        email: {"email": email},
        double_optin: confirm
      };

      // subscribe user
      var subscribe = api.call('lists', 'subscribe', subscribeOptions);

      // mark user as subscribed
      if(!!user)
        setUserSetting('subscribedToNewsletter', true, user);

      console.log("// User subscribed");
      
      return subscribe;

    } catch (error) {
      throw new Meteor.Error("subscription-failed", error.message);
      console.log( error.message );
    }
  }
};

Meteor.methods({
  addCurrentUserToMailChimpList: function(){
    var currentUser = Meteor.users.findOne(this.userId);
    try {
      return addToMailChimpList(currentUser, false);
    } catch (error) {
      throw new Meteor.Error(500, error.message);
    }
  },
  addEmailToMailChimpList: function (email) {
    try {
      return addToMailChimpList(email, true);
    } catch (error) {
      throw new Meteor.Error(500, error.message);
    }
  }
});