buildCampaign = function (postsCount) {
  // Every x days, find the top y posts that haven't yet been part of a digest, 
  // build a template around them, and pass the whole thing on to sender function.
  var params = getParameters({
    view: 'campaign',
    limit: postsCount
  });
  var campaignPosts = Posts.find(params.find, params.options).fetch();

  // 1. Iterate through posts and pass each of them through a handlebars template
  var postsHTML = _.map(campaignPosts, function(post){

    // the naked post object as stored in the database is missing a few properties, so let's add them
    var properties = _.extend(post, {
      authorName: getAuthorName(post),
      userAvatar: getAvatarUrl(Meteor.users.findOne(post.userId)),
      cleanHeadline:encodeURIComponent(post.title),
      cleanURL:encodeURIComponent(post.url),
      postLink: getPostLink(post)
    });
    
    if(post.url)
      properties.domain = getDomain(post.url)

    var template = Handlebars.templates[getTemplate('emailPostItem')](properties);
    return template;
  }).join('');

  // 2. Wrap posts HTML in digest template
  var digestHTML = Handlebars.templates[getTemplate('emailDigest')]({
    siteName: getSetting('title'),
    content: postsHTML
  });

  // 3. wrap digest HTML in email wrapper tempalte
  var emailHTML = buildEmailTemplate(digestHTML);

  // console.log(emailHTML)

  return emailHTML
}

Meteor.methods({
  testBuildCampaign: function (postsCount) {
    buildCampaign(postsCount);
  }
})