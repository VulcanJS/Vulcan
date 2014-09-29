defaultFrequency = 7;
defaultPosts = 5;

getCampaignPosts = function (postsCount) {

  var newsletterFrequency = getSetting('newsletterFrequency', defaultFrequency);

  // look for last scheduled campaign in the database
  var lastCampaign = SyncedCron._collection.findOne({name: 'Schedule newsletter'}, {sort: {finishedAt: -1}, limit: 1});
  
  // if there is a last campaign use its date, else default to posts from the last 7 days
  var lastWeek = moment().subtract(7, 'days').toDate();
  var after = (typeof lastCampaign != 'undefined') ? lastCampaign.finishedAt : lastWeek

  var params = getPostsParameters({
    view: 'campaign',
    limit: postsCount,
    after: after
  });
  return Posts.find(params.find, params.options).fetch();
}

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
      authorName: getAuthorName(post),
      postLink: getPostLink(post),
      profileUrl: getProfileUrl(postUser),
      postPageLink: getPostPageUrl(post),
      date: moment(post.postedAt).format("MMMM D YYYY")
    });

    if (post.body)
      properties.body = marked(trimWords(post.body, 20)).replace('<p>', '').replace('</p>', ''); // remove p tags
    
    if(post.url)
      properties.domain = getDomain(post.url)

    postsHTML += getEmailTemplate('emailPostItem')(properties);
  });

  // 2. Wrap posts HTML in digest template
  var digestHTML = getEmailTemplate('emailDigest')({
    siteName: getSetting('title'),
    date: moment().format("dddd, MMMM Do YYYY"),
    content: postsHTML
  });

  // 3. wrap digest HTML in email wrapper tempalte
  var emailHTML = buildEmailTemplate(digestHTML);

  return {
    postIds: _.pluck(postsArray, '_id'),
    subject: trimWords(subject, 15),
    html: emailHTML
  }
}

scheduleNextCampaign = function (isTest) {
  var isTest = typeof isTest === 'undefined' ? false : isTest;
  var posts = getCampaignPosts(getSetting('postsPerNewsletter', defaultPosts));
  if(!!posts.length){
    return scheduleCampaign(buildCampaign(posts), isTest);
  }else{
    var result = 'No posts to schedule today…';
    return result
  }
}

Meteor.methods({
  testCampaign: function () {
    if(isAdminById(this.userId))
      scheduleNextCampaign(true);
  }
});
