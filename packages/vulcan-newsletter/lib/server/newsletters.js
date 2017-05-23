import Posts from "meteor/vulcan:posts";
import Comments from "meteor/vulcan:comments";
import Users from 'meteor/vulcan:users';
import Categories from "meteor/vulcan:categories";
import VulcanEmail from 'meteor/vulcan:email';
import { SyncedCron } from 'meteor/percolatestudio:synced-cron';
import moment from 'moment';
import Newsletters from '../modules/collection.js';
import { Utils, getSetting } from 'meteor/vulcan:core';
import htmlToText from 'html-to-text';

const provider = getSetting('newsletterProvider', 'mailchimp'); // default to MailChimp

// create new "newsletter" view for all posts from the past X days that haven't been scheduled yet
Posts.addView("newsletter", terms => ({
  selector: {
    scheduledAt: {$exists: false}
  },
  options: {
    sort: {baseScore: -1},
    limit: terms.limit
  }
}));

/*

subscribeUser

subscribeEmail

unsubscribeUser

unsubscribeEmail

getPosts

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
Newsletters.subscribeUser = (user, confirm = false) => {
  const email = Users.getEmail(user);
  if (!email) {
    throw 'User must have an email address';
  }

  console.log(`// Adding ${email} to ${provider} list…`); // eslint-disable-line
  const result = Newsletters[provider].subscribe(email, confirm);
  if (result) {console.log ('-> added')}
  Users.setSetting(user, 'newsletter_subscribeToNewsletter', true);
}

/**
 * @summary Subscribe an email to the newsletter
 * @param {String} email
 */
Newsletters.subscribeEmail = (email, confirm = false) => {
  console.log(`// Adding ${email} to ${provider} list…`); // eslint-disable-line
  const result = Newsletters[provider].subscribe(email, confirm);
  if (result) {console.log ('-> added')}
}


/**
 * @summary Unsubscribe a user from the newsletter
 * @param {Object} user
 */
Newsletters.unsubscribeUser = (user) => {
  const email = Users.getEmail(user);
  if (!email) {
    throw 'User must have an email address';
  }
  
  console.log('// Removing "'+email+'" from list…'); // eslint-disable-line
  Newsletters[provider].unsubscribe(email);
  Users.setSetting(user, 'newsletter_subscribeToNewsletter', false);
}

/**
 * @summary Unsubscribe an email from the newsletter
 * @param {String} email
 */
Newsletters.unsubscribeEmail = (email) => {
  console.log('// Removing "'+email+'" from list…'); // eslint-disable-line
  Newsletters[provider].unsubscribe(email);
}

/**
 * @summary Return an array containing the latest n posts that can be sent in a newsletter
 * @param {Number} postsCount
 */
Newsletters.getPosts = postsCount => {

  // look for last scheduled newsletter in the database
  var lastNewsletter = Newsletters.getLast();

  // if there is a last newsletter and it was sent less than 7 days ago use its date, else default to posts from the last 7 days
  var lastWeek = moment().subtract(7, 'days');
  var after = (lastNewsletter && moment(lastNewsletter.createdAt).isAfter(lastWeek)) ? lastNewsletter.createdAt : lastWeek.format("YYYY-MM-DD");

  // get parameters using "newsletter" view
  var params = Posts.getParameters({
    view: "newsletter",
    after: after,
    limit: postsCount
  });

  return Posts.find(params.selector, params.options).fetch();
};

/**
 * @summary Build a newsletter subject from an array of posts
 * (Called from Newsletter.send)
 * @param {Array} posts
 */
Newsletters.getSubject = posts => {
  const subject = posts.map((post, index) => index > 0 ? `, ${post.title}` : post.title).join('');
  return Utils.trimWords(subject, 15);
}

/**
 * @summary Build a newsletter campaign from an array of posts
 * (Called from Newsletter.send)
 * @param {Array} posts
 */
Newsletters.build = posts => {
  let postsHTML = '';
  const excerptLength = getSetting('newsletterExcerptLength', 20);

  // 1. Iterate through posts and pass each of them through a handlebars template
  posts.forEach(function (post, index) {
    
    // get author of the current post
    var postUser = Users.findOne(post.userId);

    // the naked post object as stored in the database is missing a few properties, so let's add them
    var properties = _.extend(post, {
      authorName: Posts.getAuthorName(post),
      postLink: Posts.getLink(post, true),
      profileUrl: Users.getProfileUrl(postUser, true),
      postPageLink: Posts.getPageUrl(post, true),
      date: moment(post.postedAt).format("MMMM D YYYY"),
      authorAvatarUrl: Users.avatar.getUrl(postUser),
      emailShareUrl: Posts.getEmailShareUrl(post),
      twitterShareUrl: Posts.getTwitterShareUrl(post),
      facebookShareUrl: Posts.getFacebookShareUrl(post)
    });

    // if post author's avatar returns an error, remove it from properties object
    try {
      HTTP.get(post.authorAvatarUrl);
    } catch (error) {
      post.authorAvatarUrl = false;
    }

    // trim the body and remove any HTML tags
    if (post.body) {
      properties.body = Utils.trimHTML(post.htmlBody, excerptLength);
    }

    // if post has comments
    if (post.commentCount > 0) {

      // get the two highest-scoring comments
      properties.popularComments = Comments.find({postId: post._id}, {sort: {score: -1}, limit: 2, transform: function (comment) {

        // get comment author
        var user = Users.findOne(comment.userId);

        // add properties to comment
        comment.body = Utils.trimHTML(comment.htmlBody, excerptLength);
        comment.authorProfileUrl = Users.getProfileUrl(user, true);
        comment.authorAvatarUrl = Users.avatar.getUrl(user);

        try {
          HTTP.get(comment.authorAvatarUrl);
        } catch (error) {
          comment.authorAvatarUrl = false;
        }

        return comment;

      }}).fetch();

    }

    // if post has an URL, at the link domain as a property
    if(post.url) {
      properties.domain = Utils.getDomain(post.url);
    }

    // if post has a thumbnail, add the thumbnail URL as a property
    if (properties.thumbnailUrl) {
      properties.thumbnailUrl = Utils.addHttp(properties.thumbnailUrl);
    }

    // if post has categories, add them
    if (post.categories) {
      properties.categories = post.categories.map(categoryID => {
        const category = Categories.findOne(categoryID);
        if (category) {
          return {
            name: category.name,
            url: Categories.getUrl(category, true)
          }
        }
      });
    }
    // console.log(properties)
    // generate post item HTML and add it to the postsHTML string
    postsHTML += VulcanEmail.getTemplate('postItem')(properties);
  });

  // 2. Wrap posts HTML in newsletter template
  var newsletterHTML = VulcanEmail.getTemplate('newsletter')({
    siteName: getSetting('title', 'My App'),
    date: moment().format("dddd, MMMM D YYYY"),
    content: postsHTML
  });

  // 3. wrap newsletter HTML in email wrapper template
  // (also pass date to wrapper as extra property just in case we need it)
  var emailHTML = VulcanEmail.buildTemplate(newsletterHTML, {
    date: moment().format("dddd, MMMM D YYYY")
  });

  // 4. build campaign object and return it
  var campaign = {
    postIds: _.pluck(posts, '_id'),
    subject: Newsletters.getSubject(posts),
    html: emailHTML,
    text: htmlToText.fromString(emailHTML, {wordwrap: 130})
  };

  return campaign;
};

/**
 * @summary Get info about the next scheduled newsletter
 */
Newsletters.getNext = () => {
  var nextJob = SyncedCron.nextScheduledAtDate('scheduleNewsletter');
  return nextJob;
}

/**
 * @summary Get the last sent newsletter
 */
Newsletters.getLast = () => {
  return Newsletters.findOne({}, {sort: {createdAt: -1}});
}

/**
 * @summary Send the newsletter
 * @param {Boolean} isTest
 */
Newsletters.send = (isTest = false) => {

  const defaultPosts = 5;
  const posts = Newsletters.getPosts(getSetting('postsPerNewsletter', defaultPosts));
  const postsIds = _.pluck(posts, '_id');

  if(!!posts.length){

    const { title, subject, text, html } = Newsletters.build(posts);

    console.log('// Creating campaign…');
    console.log('// Subject: '+subject)

    const newsletter = Newsletters[provider].send({ title, subject, text, html, isTest });

    // if newsletter sending is successufl and this is not a test, mark posts as sent and log newsletter
    if (newsletter && !isTest) {

      var updated = Posts.update({_id: {$in: postsIds}}, {$set: {scheduledAt: new Date()}}, {multi: true}) // eslint-disable-line
      console.log(`updated ${updated} posts`)

      const createdAt = new Date();

      // log newsletter
      Newsletters.insert({
        createdAt,
        subject,
        html,
        provider,
        properties: newsletter
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
    
    console.log('No posts to schedule today…');
  
  }
}