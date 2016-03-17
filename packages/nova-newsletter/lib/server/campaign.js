import Email from 'meteor/nova:email';

const defaultFrequency = 7;
const defaultPosts = 5;

const Campaign = {};

Campaign.getPosts = function (postsCount) {

  // look for last scheduled campaign in the database
  var lastCampaign = SyncedCron._collection.findOne({name: 'scheduleNewsletter'}, {sort: {finishedAt: -1}, limit: 1});

  // if there is a last campaign and it was sent less than 7 days ago use its date, else default to posts from the last 7 days
  var lastWeek = moment().subtract(7, 'days');
  var after = (lastCampaign && moment(lastCampaign.finishedAt).isAfter(lastWeek)) ? lastCampaign.finishedAt : lastWeek.toDate();

  var params = Posts.parameters.get({
    view: 'campaign',
    after: after,
    options: {
      limit: postsCount,
    }
  });
  return Posts.find(params.find, params.options).fetch();
};

Campaign.build = function (postsArray) {
  var postsHTML = '', subject = '';

  // 1. Iterate through posts and pass each of them through a handlebars template
  postsArray.forEach(function (post, index) {
    if(index > 0)
      subject += ', ';

    subject += post.title;

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

    try {
      HTTP.get(post.authorAvatarUrl);
    } catch (error) {
      post.authorAvatarUrl = false;
    }

    if (post.body) {
      properties.body = Telescope.utils.trimHTML(post.htmlBody, 20);
    }

    if (post.commentCount > 0) {

      properties.popularComments = Comments.find({postId: post._id}, {sort: {score: -1}, limit: 2, transform: function (comment) {
        var user = Meteor.users.findOne(comment.userId);

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

    if(post.url) {
      properties.domain = Telescope.utils.getDomain(post.url);
    }

    if (properties.thumbnailUrl) {
      properties.thumbnailUrl = Telescope.utils.addHttp(properties.thumbnailUrl);
    }

    postsHTML += Email.getTemplate('postItem')(properties);
  });

  // 2. Wrap posts HTML in digest template
  var digestHTML = Email.getTemplate('newsletter')({
    siteName: Telescope.settings.get('title'),
    date: moment().format("dddd, MMMM Do YYYY"),
    content: postsHTML
  });

  // 3. wrap digest HTML in email wrapper template
  var emailHTML = Email.buildTemplate(digestHTML);

  var campaign = {
    postIds: _.pluck(postsArray, '_id'),
    subject: Telescope.utils.trimWords(subject, 15),
    html: emailHTML
  };
  return campaign;
};

export default Campaign;