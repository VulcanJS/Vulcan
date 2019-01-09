import Users from 'meteor/vulcan:users';
import VulcanEmail from 'meteor/vulcan:email';
import { SyncedCron } from 'meteor/percolatestudio:synced-cron';
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

/**
 * @summary Subscribe a user to the newsletter
 * @param {Object} user
 * @param {Boolean} confirm
 */
Newsletters.subscribeUser = async (user, confirm = false) => {
  const email = Users.getEmail(user);
  if (!email) {
    throw 'User must have an email address';
  }

  // eslint-disable-next-line no-console
  console.log(`// Adding ${email} to ${provider} list…`);
  const result = Newsletters[provider].subscribe(email, confirm);
  // eslint-disable-next-line no-console
  if (result) {console.log ('-> added');}
  await Connectors.update(Users, user._id, {$set: {newsletter_subscribeToNewsletter: true}});
};

/**
 * @summary Subscribe an email to the newsletter
 * @param {String} email
 */
Newsletters.subscribeEmail = (email, confirm = false) => {
  // eslint-disable-next-line no-console
  console.log(`// Adding ${email} to ${provider} list…`);
  const result = Newsletters[provider].subscribe(email, confirm);
  // eslint-disable-next-line no-console
  if (result) {console.log ('-> added');}
};


/**
 * @summary Unsubscribe a user from the newsletter
 * @param {Object} user
 */
Newsletters.unsubscribeUser = async (user) => {
  const email = Users.getEmail(user);
  if (!email) {
    throw 'User must have an email address';
  }

  // eslint-disable-next-line no-console
  console.log('// Removing "'+email+'" from list…');
  Newsletters[provider].unsubscribe(email);
  await Connectors.update(Users, user._id, {$set: {newsletter_subscribeToNewsletter: false}}); 
};

/**
 * @summary Unsubscribe an email from the newsletter
 * @param {String} email
 */
Newsletters.unsubscribeEmail = (email) => {
  // eslint-disable-next-line no-console
  console.log('// Removing "'+email+'" from list…');
  Newsletters[provider].unsubscribe(email);
};

/**
 * @summary Build a newsletter subject from an array of posts
 * (Called from Newsletter.send)
 * @param {Array} posts
 */
Newsletters.getSubject = posts => {
  const subject = posts.map((post, index) => index > 0 ? `, ${post.title}` : post.title).join('');
  return Utils.trimWords(subject, 15);
};

/**
 * @summary Build a newsletter campaign from an array of posts
 * (Called from Newsletter.send)
 * @param {Array} posts
 */
// Newsletters.build = posts => {
//   let postsHTML = '';
//   const excerptLength = getSetting('newsletterExcerptLength', 20);

//   // 1. Iterate through posts and pass each of them through a handlebars template
//   posts.forEach(function (post, index) {
    
//     // get author of the current post
//     var postUser = Users.findOne(post.userId);

//     // the naked post object as stored in the database is missing a few properties, so let's add them
//     var properties = _.extend(post, {
//       authorName: Posts.getAuthorName(post),
//       postLink: Posts.getLink(post, true),
//       profileUrl: Users.getProfileUrl(postUser, true),
//       postPageLink: Posts.getPageUrl(post, true),
//       date: moment(post.postedAt).format("MMMM D YYYY"),
//       authorAvatarUrl: Users.avatar.getUrl(postUser),
//       emailShareUrl: Posts.getEmailShareUrl(post),
//       twitterShareUrl: Posts.getTwitterShareUrl(post),
//       facebookShareUrl: Posts.getFacebookShareUrl(post)
//     });

//     // if post author's avatar returns an error, remove it from properties object
//     try {
//       HTTP.get(post.authorAvatarUrl);
//     } catch (error) {
//       post.authorAvatarUrl = false;
//     }

//     // trim the body and remove any HTML tags
//     if (post.body) {
//       properties.body = Utils.trimHTML(post.htmlBody, excerptLength);
//     }

//     // if post has comments
//     if (post.commentCount > 0) {

//       // get the two highest-scoring comments
//       properties.popularComments = Comments.find({postId: post._id}, {sort: {score: -1}, limit: 2, transform: function (comment) {

//         // get comment author
//         var user = Users.findOne(comment.userId);

//         // add properties to comment
//         comment.body = Utils.trimHTML(comment.htmlBody, excerptLength);
//         comment.authorProfileUrl = Users.getProfileUrl(user, true);
//         comment.authorAvatarUrl = Users.avatar.getUrl(user);

//         try {
//           HTTP.get(comment.authorAvatarUrl);
//         } catch (error) {
//           comment.authorAvatarUrl = false;
//         }

//         return comment;

//       }}).fetch();

//     }

//     // if post has an URL, at the link domain as a property
//     if(post.url) {
//       properties.domain = Utils.getDomain(post.url);
//     }

//     // if post has a thumbnail, add the thumbnail URL as a property
//     if (properties.thumbnailUrl) {
//       properties.thumbnailUrl = Utils.addHttp(properties.thumbnailUrl);
//     }

//     // if post has categories, add them
//     if (post.categories) {
//       properties.categories = post.categories.map(categoryID => {
//         const category = Categories.findOne(categoryID);
//         if (category) {
//           return {
//             name: category.name,
//             url: Categories.getUrl(category, true)
//           }
//         }
//       });
//     }
//     // console.log(properties)
//     // generate post item HTML and add it to the postsHTML string
//     postsHTML += VulcanEmail.getTemplate('postItem')(properties);
//   });

//   // 2. Wrap posts HTML in newsletter template
//   var newsletterHTML = VulcanEmail.getTemplate('newsletter')({
//     siteName: getSetting('title', 'My App'),
//     date: moment().format("dddd, MMMM D YYYY"),
//     content: postsHTML
//   });

//   // 3. wrap newsletter HTML in email wrapper template
//   // (also pass date to wrapper as extra property just in case we need it)
//   var emailHTML = VulcanEmail.buildTemplate(newsletterHTML, {
//     date: moment().format("dddd, MMMM D YYYY")
//   });

//   // 4. build campaign object and return it
//   var campaign = {
//     postIds: _.pluck(posts, '_id'),
//     subject: Newsletters.getSubject(posts),
//     html: emailHTML,
//     text: htmlToText.fromString(emailHTML, {wordwrap: 130})
//   };

//   return campaign;
// };

/**
 * @summary Get info about the next scheduled newsletter
 */
Newsletters.getNext = () => {
  var nextJob = SyncedCron.nextScheduledAtDate('scheduleNewsletter');
  return nextJob;
};

/**
 * @summary Get the last sent newsletter
 */
Newsletters.getLast = () => {
  return Newsletters.findOne({}, {sort: {createdAt: -1}});
};

/**
 * @summary Send the newsletter
 * @param {Boolean} isTest
 */
Newsletters.send = async (isTest = false) => {

  const newsletterEmail = VulcanEmail.emails.newsletter;
  const email = await VulcanEmail.build({ emailName: 'newsletter', variables: {terms: {view: 'newsletter'}}});
  const { subject, html, data } = email;
  const text = VulcanEmail.generateTextVersion(html);

  if(newsletterEmail.isValid(data)){

    // eslint-disable-next-line no-console
    console.log('// Sending newsletter…');
    // eslint-disable-next-line no-console
    console.log('// Subject: '+subject);

    const newsletter = Newsletters[provider].send({ subject, text, html, isTest });

    // if newsletter sending is successufl and this is not a test, mark posts as sent and log newsletter
    if (newsletter && !isTest) {

      runCallbacksAsync('newsletter.send.async', email);

      const createdAt = new Date();

      // log newsletter
      await Connectors.create(Newsletters, {
        createdAt,
        subject,
        html,
        provider,
        data,
      });

      // send confirmation email
      const confirmationHtml = VulcanEmail.getTemplate('newsletterConfirmation')({
        time: createdAt.toString(),
        newsletterLink: newsletter.archive_url,
        subject: subject
      });
      VulcanEmail.send(getSetting('defaultEmail'), 'Newsletter scheduled', VulcanEmail.buildTemplate(confirmationHtml));

    }

  } else {

    // eslint-disable-next-line no-console
    console.log('No newsletter to schedule today…');
  
  }
};

Meteor.startup(() => {
  if(!Newsletters[provider]) {
    // eslint-disable-next-line no-console
    console.log(`// Warning: please configure your settings for ${provider} support, or else disable the vulcan:newsletter package.`);
  }
});