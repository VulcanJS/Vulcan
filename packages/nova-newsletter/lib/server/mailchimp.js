import htmlToText from 'html-to-text';
// import Email from 'meteor/nova:email';
import Campaign from "./campaign.js";

const defaultPosts = 5;

Campaign.scheduleNextWithMailChimp = function (isTest) {
  isTest = !! isTest;
  var posts = Campaign.getPosts(Telescope.settings.get('postsPerNewsletter', defaultPosts));
  if(!!posts.length){
    return Campaign.scheduleWithMailChimp(Campaign.build(posts), isTest);
  }else{
    var result = 'No posts to schedule today…';
    return result;
  }
};

Campaign.scheduleWithMailChimp = function (campaign, isTest) {
  isTest = typeof isTest === 'undefined' ? false : isTest;

  var apiKey = Telescope.settings.get('mailChimpAPIKey');
  var listId = Telescope.settings.get('mailChimpListId');

  if(!!apiKey && !!listId){

    var wordCount = 15;
    var subject = campaign.subject;
    while (subject.length >= 150){
      subject = Telescope.utils.trimWords(subject, wordCount);
      wordCount--;
    }

    try {

      var api = new MailChimp(apiKey);
      var text = htmlToText.fromString(campaign.html, {wordwrap: 130});
      var defaultEmail = Telescope.settings.get('defaultEmail');
      var campaignOptions = {
        type: 'regular',
        options: {
          list_id: listId,
          subject: subject,
          from_email: defaultEmail,
          from_name: Telescope.settings.get('title')+ ' Top Posts',
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
      var confirmationHtml = Telescope.email.getTemplate('digestConfirmation')({
        time: scheduledTime,
        newsletterLink: mailchimpCampaign.archive_url,
        subject: subject
      });
      Telescope.email.send(defaultEmail, 'Newsletter scheduled', Telescope.email.buildTemplate(confirmationHtml));

    } catch (error) {
      console.log(error);
    }
    return subject;
  }
};

const MailChimpList = {};

MailChimpList.add = function(userOrEmail, confirm, done){

  var apiKey = Telescope.settings.get('mailChimpAPIKey');
  var listId = Telescope.settings.get('mailChimpListId');

  var user, email;

  confirm = (typeof confirm === 'undefined') ? false : confirm; // default to no confirmation

  // not sure if it's really necessary that the function take both user and email?
  if (typeof userOrEmail === "string") {
    user = null;
    email = userOrEmail;
  } else if (typeof userOrEmail === "object") {
    user = userOrEmail;
    email = Users.getEmail(user);
    if (!email)
      throw 'User must have an email address';
  }

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
      if (!!user) {
        Users.setSetting(user, 'newsletter_subscribeToNewsletter', true);
      }

      console.log("// User subscribed");

      return subscribe;

    } catch (error) {
      throw new Meteor.Error("subscription-failed", error.message);
    }
  } else {
    throw new Meteor.Error("Please provide your MailChimp API key and list ID", error.message);
  }
};

export default MailChimpList;