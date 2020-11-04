import Users from 'meteor/vulcan:users';
import VulcanEmail from 'meteor/vulcan:email';
import { SyncedCron } from 'meteor/littledata:synced-cron';
import Newsletters from '../modules/collection.js';
import { Utils, getSetting, registerSetting, runCallbacksAsync, Connectors } from 'meteor/vulcan:core';

registerSetting('newsletter.provider', 'mailchimp', 'Newsletter provider');
registerSetting('defaultEmail', null, 'Email newsletter confirmations will be sent to');

const provider = getSetting('newsletter.provider', 'mailchimp'); // default to MailChimp

/*

subscribeUser

subscribeEmail

unsubscribeUser

unsubscribeEmail

getSubject

build

getNext

getLast

send

*/

export const testProvider = () => {
  if (!Newsletters[provider]) {
    throw new Error(`Could not find newsletter provider “${provider}”. Please make sure your settings are configured correctly.`);
  }
};

/**
 * @summary Subscribe a user to the newsletter
 * @param {Object} user
 * @param {Boolean} confirm
 */
export const subscribeUser = async (user, confirm = false) => {
  testProvider();
  const email = Users.getEmail(user);
  if (!email) {
    throw 'User must have an email address';
  }

  // eslint-disable-next-line no-console
  console.log(`// Adding ${email} to ${provider} list…`);
  const result = await Newsletters[provider].subscribe(email, confirm);
  // eslint-disable-next-line no-console
  if (result) {
    console.log('-> added');
  }
  await Connectors.update(Users, user._id, { $set: { newsletter_subscribeToNewsletter: true } });
  return { email, success: result };
};
Newsletters.subscribeUser = subscribeUser;

/**
 * @summary Subscribe an email to the newsletter
 * @param {String} email
 */
export const subscribeEmail = async (email, confirm = false) => {
  testProvider();
  // eslint-disable-next-line no-console
  console.log(`// Adding ${email} to ${provider} list…`);
  const result = await Newsletters[provider].subscribe(email, confirm);
  // eslint-disable-next-line no-console
  if (result) {
    console.log('-> added');
    return { email, success: result };
  }
};
Newsletters.subscribeEmail = subscribeEmail;

/**
 * @summary Unsubscribe a user from the newsletter
 * @param {Object} user
 */
export const unsubscribeUser = async user => {
  testProvider();
  const email = Users.getEmail(user);
  if (!email) {
    throw 'User must have an email address';
  }

  // eslint-disable-next-line no-console
  console.log('// Removing "' + email + '" from list…');
  Newsletters[provider].unsubscribe(email);
  await Connectors.update(Users, user._id, { $set: { newsletter_subscribeToNewsletter: false } });
};
Newsletters.unsubscribeUser = unsubscribeUser;

/**
 * @summary Unsubscribe an email from the newsletter
 * @param {String} email
 */
export const unsubscribeEmail = email => {
  testProvider();
  // eslint-disable-next-line no-console
  console.log('// Removing "' + email + '" from list…');
  Newsletters[provider].unsubscribe(email);
};
Newsletters.unsubscribeEmail = unsubscribeEmail;
/**
 * @summary Build a newsletter subject from an array of posts
 * (Called from Newsletter.send)
 * @param {Array} posts
 */
export const getSubject = posts => {
  const subject = posts.map((post, index) => (index > 0 ? `, ${post.title}` : post.title)).join('');
  return Utils.trimWords(subject, 15);
};
Newsletters.getSubject = getSubject;

/**
 * @summary Get info about the next scheduled newsletter
 */
export const getNext = () => {
  var nextJob = SyncedCron.nextScheduledAtDate('scheduleNewsletter');
  return nextJob;
};
Newsletters.getNext = getNext;

/**
 * @summary Get the last sent newsletter
 */
export const getLast = () => {
  return Newsletters.findOne({}, { sort: { createdAt: -1 } });
};
Newsletters.getLast = getLast;

/**
 * @summary Send the newsletter
 * @param {Boolean} isTest
 */
export const send = async ({ newsletterId, isTest = false }) => {
  testProvider();
  let result = { _id: newsletterId };

  if (!newsletterId) {
    throw new Error('You must specify a newsletterId argument');
  }

  const newsletter = await Connectors.get(Newsletters, { _id: newsletterId });

  const newsletterEmail = VulcanEmail.emails.newsletter;
  // if newsletter document already has its own subject, html, and data use them;
  // else get them from email object
  const email = await VulcanEmail.build({ emailName: 'newsletter', variables: { terms: { view: 'newsletter' } } });

  const { subject, html, data } = { ...email, ...newsletter };
  const text = VulcanEmail.generateTextVersion(html);

  if (!newsletterEmail.isValid || newsletterEmail.isValid(data)) {
    // eslint-disable-next-line no-console
    console.log('// Sending newsletter…');
    // eslint-disable-next-line no-console
    console.log('// Subject: ' + subject);

    try {
      const sendResult = await Newsletters[provider].send({ subject, text, html, isTest });
      // console.log('// newsletter sending success!');
      // console.log(sendResult);

      //   // send confirmation email
      //   const confirmationHtml = VulcanEmail.getTemplate('newsletterConfirmation')({
      //     time: createdAt.toString(),
      //     newsletterLink: sendResult.archive_url,
      //     subject: subject,
      //   });
      //   VulcanEmail.send(getSetting('defaultEmail'), 'Newsletter scheduled', VulcanEmail.buildTemplate(confirmationHtml));

      await runCallbacksAsync('newsletter.send.async', email);

      // status 2 = scheduled
      result = { scheduledAt: new Date(), status: 2 };
    } catch (error) {
      console.log('// Newsletter sending error!');
      console.log(error);
      // status 4 = error
      result = { error, status: 4 };
    }

    await Connectors.update(Newsletters, { _id: newsletterId }, { $set: result });
    return result;
  }
};
Newsletters.send = send;