defaultFrequency = 7;
defaultPosts = 5;

getCampaignPosts = function (postsCount) {

  // look for last scheduled campaign in the database
  var lastCampaign = SyncedCron._collection.findOne({name: 'Schedule newsletter'}, {sort: {finishedAt: -1}, limit: 1});

  // if there is a last campaign use its date, else default to posts from the last 7 days
  var lastWeek = moment().subtract(7, 'days').toDate();
  var after = (typeof lastCampaign !== 'undefined') ? lastCampaign.finishedAt : lastWeek

  var params = Posts.getSubParams({
    view: 'campaign',
    limit: postsCount,
    after: after
  });
  return Posts.find(params.find, params.options).fetch();
};

buildCampaign = function (postsArray) {
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
      date: moment(post.postedAt).format("MMMM D YYYY")
    });

    if (post.body)
      properties.body = marked(Telescope.utils.trimWords(post.body, 20)).replace('<p>', '').replace('</p>', ''); // remove p tags

    if(post.url)
      properties.domain = Telescope.utils.getDomain(post.url);

    postsHTML += Telescope.email.getTemplate('emailPostItem')(properties);
  });

  // 2. Wrap posts HTML in digest template
  var digestHTML = Telescope.email.getTemplate('emailDigest')({
    siteName: Settings.get('title'),
    date: moment().format("dddd, MMMM Do YYYY"),
    content: postsHTML
  });

  // 3. wrap digest HTML in email wrapper template
  var emailHTML = Telescope.email.buildTemplate(digestHTML);

  var campaign = {
    postIds: _.pluck(postsArray, '_id'),
    subject: Telescope.utils.trimWords(subject, 15),
    html: emailHTML
  };

  return campaign;
};

scheduleNextCampaign = function (isTest) {
  isTest = !! isTest;
  var posts = getCampaignPosts(Settings.get('postsPerNewsletter', defaultPosts));
  if(!!posts.length){
    return scheduleCampaign(buildCampaign(posts), isTest);
  }else{
    var result = 'No posts to schedule today…';
    return result;
  }
};

Meteor.methods({
  sendCampaign: function () {
    if(Users.is.adminById(this.userId))
      return scheduleNextCampaign(false);
  },
  testCampaign: function () {
    if(Users.is.adminById(this.userId))
      return scheduleNextCampaign(true);
  }
});
