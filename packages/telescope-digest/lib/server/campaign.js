defaultFrequency = 7;
defaultPosts = 5;

getCampaignPosts = function (postsCount) {
  var newsletterFrequency = getSetting('newsletterFrequency', defaultFrequency);
  var xDaysAgo = moment().subtract('days', newsletterFrequency).toDate();
  var params = getParameters({
    view: 'campaign',
    limit: postsCount,
    after: xDaysAgo
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

    postsHTML += Handlebars.templates[getTemplate('emailPostItem')](properties);
  });

  // 2. Wrap posts HTML in digest template
  var digestHTML = Handlebars.templates[getTemplate('emailDigest')]({
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

scheduleNextCampaign = function () {
  var posts = getCampaignPosts(getSetting('postsPerNewsletter', defaultPosts));
  if(!!posts.length){
    scheduleCampaign(buildCampaign(posts))
  }else{
    console.log('No posts to schedule today…')
  }
}

Meteor.methods({
  testCampaign: function () {
    scheduleNextCampaign();
  }
});