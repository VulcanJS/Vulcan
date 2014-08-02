buildCampaign = function (postsCount) {
  // Every x days, find the top y posts that haven't yet been part of a digest, 
  // build a template around them, and pass the whole thing on to sender function.
  var params = getParameters({
    view: 'campaign',
    limit: postsCount
  });
  var campaignPosts = Posts.find(params.find, params.options).fetch();
  console.log(_.pluck(campaignPosts, 'title'))

  // iterate through posts and pass each of them through a handlebars template
  var postsHTML = _.map(campaignPosts, function(post){
    console.log(post)

    // the naked post object as stored in the database is missing a few properties, so let's add them
    var properties = _.extend(post, {
      authorName: getAuthorName(post),
      userAvatar: getAvatarUrl(Meteor.users.findOne(post.userId)),
      cleanHeadline:encodeURIComponent(post.title),
      cleanURL:encodeURIComponent(post.url),
      outgoingUrl: getOutgoingUrl(post.url)
    });
    
    if(post.url)
      properties.domain = getDomain(post.url)

    var template = Handlebars.templates[getTemplate('postItemEmail')](properties);
    return template;
  }).join('');

  console.log(postsHTML)
}

Meteor.methods({
  testBuildCampaign: function (postsCount) {
    buildCampaign(postsCount);
  }
})