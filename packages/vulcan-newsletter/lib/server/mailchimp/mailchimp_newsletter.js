/* eslint-disable no-console */

// newsletter scheduling with MailChimp

import Posts from 'meteor/vulcan:posts';
import VulcanEmail from 'meteor/vulcan:email';
import htmlToText from 'html-to-text';
import moment from 'moment';
import MailChimp from './mailchimp_api.js';
import { Utils, getSetting } from 'meteor/vulcan:core';
import Newsletters from '../../collection.js';

const defaultPosts = 5;

Newsletters.scheduleNextWithMailChimp = function (isTest = false) {
  var posts = Newsletters.getPosts(getSetting('postsPerNewsletter', defaultPosts));
  if(!!posts.length){
    return Newsletters.scheduleWithMailChimp(Newsletters.build(posts), isTest);
  }else{
    var result = {result: 'No posts to schedule today…'};
    return result;
  }
};

Newsletters.scheduleWithMailChimp = function (campaign, isTest = false) {

  var apiKey = getSetting('mailChimpAPIKey');
  var listId = getSetting('mailChimpListId');

  if(!!apiKey && !!listId){

    var wordCount = 15;
    var subject = campaign.subject;
    while (subject.length >= 150){
      subject = Utils.trimWords(subject, wordCount);
      wordCount--;
    }

    try {

      var api = new MailChimp(apiKey);
      var text = htmlToText.fromString(campaign.html, {wordwrap: 130});
      var defaultEmail = getSetting('defaultEmail');
      var campaignOptions = {
        type: 'regular',
        options: {
          list_id: listId,
          subject: subject,
          from_email: defaultEmail,
          from_name: getSetting('title')
        },
        content: {
          html: campaign.html,
          text: text
        }
      };

      console.log('// Creating campaign…');
      console.log('// Subject: '+subject)
      // create campaign
      var mailchimpNewsletter = api.call( 'campaigns', 'create', campaignOptions);

      console.log('// Newsletter created');
      // console.log(campaign)

      var scheduledTime = moment().utcOffset(0).add(1, 'hours').format("YYYY-MM-DD HH:mm:ss");

      var scheduleOptions = {
        cid: mailchimpNewsletter.id,
        schedule_time: scheduledTime
      };

      // schedule campaign
      var schedule = api.call('campaigns', 'schedule', scheduleOptions); // eslint-disable-line

      console.log('// Newsletter scheduled for '+scheduledTime);
      // console.log(schedule)

      // if this is not a test, mark posts as sent and log newsletter
      if (!isTest) {

        var updated = Posts.update({_id: {$in: campaign.postIds}}, {$set: {scheduledAt: new Date()}}, {multi: true, validate: false}) // eslint-disable-line
        console.log(`updated ${updated} posts`)

        // log newsletter
        Newsletters.insert({
          createdAt: new Date(),
          scheduledAt: scheduledMoment.toDate(),
          subject,
          html: campaign.html,
          provider: 'MailChimp'
        });

      }

      // send confirmation email
      var confirmationHtml = VulcanEmail.getTemplate('newsletterConfirmation')({
        time: scheduledTime,
        newsletterLink: mailchimpNewsletter.archive_url,
        subject: subject
      });
      VulcanEmail.send(defaultEmail, 'Newsletter scheduled', VulcanEmail.buildTemplate(confirmationHtml));

    } catch (error) {
      console.log(error);
    }
    return subject;
  }
};
