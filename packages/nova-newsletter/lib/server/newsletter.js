import Telescope from 'meteor/nova:lib';
import moment from 'moment';
import Posts from "meteor/nova:posts";
import Comments from "meteor/nova:comments";
import Users from 'meteor/nova:users';
import Categories from "meteor/nova:categories";
import NovaEmail from 'meteor/nova:email';
import Newsletter from '../namespace.js';

// create new "newsletter" view for all posts from the past X days that haven't been scheduled yet
Posts.views.add("newsletter", function (terms) {
  return {
    selector: {
      scheduledAt: {$exists: false}
    },
    options: {
      sort: {baseScore: -1}, 
      limit: terms.limit
    }
  };
});

/**
 * @summary Return an array containing the latest n posts that can be sent in a newsletter
 * @param {Number} postsCount
 */
Newsletter.getPosts = function (postsCount) {

  // look for last scheduled newsletter in the database
  var lastNewsletter = SyncedCron._collection.findOne({name: 'scheduleNewsletter'}, {sort: {finishedAt: -1}, limit: 1});

  // if there is a last newsletter and it was sent less than 7 days ago use its date, else default to posts from the last 7 days
  var lastWeek = moment().subtract(7, 'days');
  var after = (lastNewsletter && moment(lastNewsletter.finishedAt).isAfter(lastWeek)) ? lastNewsletter.finishedAt : lastWeek.format("YYYY-MM-DD");
  
  // get parameters using "newsletter" view
  var params = Posts.parameters.get({
    view: "newsletter",
    after: after,
    limit: postsCount
  });
  
  return Posts.find(params.selector, params.options).fetch();
};

/**
 * @summary Build a newsletter campaign from an array of posts
 * (Called from Newsletter.scheduleNextWithMailChimp)
 * @param {Array} postsArray
 */
Newsletter.build = function (postsArray) {
  var postsHTML = '', subject = '';

  // 1. Iterate through posts and pass each of them through a handlebars template
  postsArray.forEach(function (post, index) {

    // add post title to email subject (don't add a coma for the first post)
    if(index > 0) subject += ', ';
    subject += post.title;

    // get author of the current post
    var postUser = Meteor.users.findOne(post.userId);

    // the naked post object as stored in the database is missing a few properties, so let's add them
    var properties = _.extend(post, {
      authorName: post.getAuthorName(),
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
      properties.body = Telescope.utils.trimHTML(post.htmlBody, 20);
    }

    // if post has comments
    if (post.commentCount > 0) {

      // get the two highest-scoring comments
      properties.popularComments = Comments.find({postId: post._id}, {sort: {score: -1}, limit: 2, transform: function (comment) {
        
        // get comment author
        var user = Meteor.users.findOne(comment.userId);

        // add properties to comment
        comment.body = Telescope.utils.trimHTML(comment.htmlBody, 20);
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
      properties.domain = Telescope.utils.getDomain(post.url);
    }

    // if post has a thumbnail, add the thumbnail URL as a property
    if (properties.thumbnailUrl) {
      properties.thumbnailUrl = Telescope.utils.addHttp(properties.thumbnailUrl);
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
    postsHTML += NovaEmail.getTemplate('postItem')(properties);
  });

  // 2. Wrap posts HTML in newsletter template
  var newsletterHTML = NovaEmail.getTemplate('newsletter')({
    siteName: Telescope.settings.get('title', "Nova"),
    date: moment().format("dddd, MMMM D YYYY"),
    content: postsHTML
  });

  // 3. wrap newsletter HTML in email wrapper template
  // (also pass date to wrapper as extra property just in case we need it)
  var emailHTML = NovaEmail.buildTemplate(newsletterHTML, {
    date: moment().format("dddd, MMMM D YYYY")
  });
  
  // 4. build campaign object and return it
  var campaign = {
    postIds: _.pluck(postsArray, '_id'),
    subject: Telescope.utils.trimWords(subject, 15),
    html: emailHTML
  };
  
  return campaign;
};
