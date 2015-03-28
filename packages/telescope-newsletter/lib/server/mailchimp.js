var htmlToText = Npm.require('html-to-text');

scheduleCampaign = function (campaign, isTest) {
  var isTest = typeof isTest === 'undefined' ? false : isTest;

  var apiKey = Settings.get('mailChimpAPIKey');
  var listId = Settings.get('mailChimpListId');

  if(!!apiKey && !!listId){

		var wordCount = 15;
		var subject = campaign.subject;
		while (subject.length >= 150){
			subject = trimWords(subject, wordCount);
			wordCount--;
		}

    try {

      var api = new MailChimp(apiKey);
      var text = htmlToText.fromString(campaign.html, {wordwrap: 130});
      var defaultEmail = Settings.get('defaultEmail');
      var campaignOptions = {
        type: 'regular',
        options: {
          list_id: listId,
          subject: subject,
          from_email: defaultEmail,
          from_name: Settings.get('title')+ ' Top Posts',
        },
        content: {
          html: campaign.html,
          text: text
        }
      };

      console.log( '// Creating campaign…');

      // create campaign
      var mailchimpCampaign = api.call( 'campaigns', 'create', campaignOptions);

      console.log( '// Campaign created');
      // console.log(campaign)

      var scheduledTime = moment().utcOffset(0).add(1, 'hours').format("YYYY-MM-DD HH:mm:ss");

      var scheduleOptions = {
        cid: mailchimpCampaign.id,
        schedule_time: scheduledTime
      };

      // schedule campaign
      var schedule = api.call('campaigns', 'schedule', scheduleOptions);

      console.log('// Campaign scheduled for '+scheduledTime);
      // console.log(schedule)

      // if this is not a test, mark posts as sent
      if (!isTest)
        var updated = Posts.update({_id: {$in: campaign.postIds}}, {$set: {scheduledAt: new Date()}}, {multi: true})

      // send confirmation email
      var confirmationHtml = getEmailTemplate('emailDigestConfirmation')({
        time: scheduledTime,
        newsletterLink: mailchimpCampaign.archive_url,
        subject: subject
      });
      sendEmail(defaultEmail, 'Newsletter scheduled', buildEmailTemplate(confirmationHtml));

    } catch (error) {
      console.log(error);
    }
    return subject;
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

  var apiKey = Settings.get('mailChimpAPIKey');
  var listId = Settings.get('mailChimpListId');

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
