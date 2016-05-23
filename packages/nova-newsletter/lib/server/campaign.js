import { Avatar } from 'meteor/nova:core';
// import Email from 'meteor/nova:email';

// create new "campaign" view for all posts from the past X days that haven't been scheduled yet
Posts.views.add("campaign", function (terms) {
  return {
    find: {
      scheduledAt: {$exists: false},
      postedAt: {
        $gte: terms.after
      }
    },
    options: {
      sort: {baseScore: -1}, 
      limit: terms.limit
    }
  };
});

const Campaign = {};

/**
 * @summary Return an array containing the latest n posts that can be sent in a newsletter
 * @param {Number} postsCount
 */
Campaign.getPosts = function (postsCount) {

  // look for last scheduled campaign in the database
  var lastCampaign = SyncedCron._collection.findOne({name: 'scheduleNewsletter'}, {sort: {finishedAt: -1}, limit: 1});

  // if there is a last campaign and it was sent less than 7 days ago use its date, else default to posts from the last 7 days
  var lastWeek = moment().subtract(7, 'days');
  var after = (lastCampaign && moment(lastCampaign.finishedAt).isAfter(lastWeek)) ? lastCampaign.finishedAt : lastWeek.toDate();

  // get parameters using "campaign" view
  var params = Posts.parameters.get({
    view: 'campaign',
    after: after,
    limit: postsCount
  });
  return Posts.find(params.selector, params.options).fetch();
};

/**
 * @summary Build a newsletter campaign from an array of posts
 * (Called from Campaign.scheduleNextWithMailChimp)
 * @param {Array} postsArray
 */
Campaign.build = function (postsArray) {
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
      authorAvatarUrl: Avatar.getUrl(postUser)
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
        comment.authorAvatarUrl = Avatar.getUrl(user);

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

    // generate post item HTML and add it to the postsHTML string
    postsHTML += Telescope.email.getTemplate('postItem')(properties);
  });

  // 2. Wrap posts HTML in newsletter template
  var newsletterHTML = Telescope.email.getTemplate('newsletter')({
    siteName: Telescope.settings.get('title'),
    date: moment().format("dddd, MMMM Do YYYY"),
    content: postsHTML
  });

  // 3. wrap newsletter HTML in email wrapper template
  var emailHTML = Telescope.email.buildTemplate(newsletterHTML);

  // 4. build campaign object and return it
  var campaign = {
    postIds: _.pluck(postsArray, '_id'),
    subject: Telescope.utils.trimWords(subject, 15),
    html: emailHTML
  };
  return campaign;
};

export default Campaign;
module.exports = Campaign;