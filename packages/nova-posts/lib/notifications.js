Posts.getNotificationProperties = function (post) {
  var postAuthor = Meteor.users.findOne(post.userId);
  var properties = {
    postAuthorName : Posts.getAuthorName(post),
    postTitle : Telescope.utils.cleanUp(post.title),
    profileUrl: Users.getProfileUrl(postAuthor, true),
    postUrl: Posts.getPageUrl(post, true),
    thumbnailUrl: post.thumbnailUrl,
    linkUrl: !!post.url ? Telescope.utils.getOutgoingUrl(post.url) : Posts.getPageUrl(post, true)
  };

  if(post.url)
    properties.url = post.url;

  if(post.htmlBody)
    properties.htmlBody = post.htmlBody;

  return properties;
};

// Telescope.notifications = Object.assign(Telescope.notifications, {
//   newPost: {
//     properties(data) {
//       return Posts.getNotificationProperties(data.post);
//     },
//     subject(properties) {
//       return properties.postAuthorName+' has created a new post: '+properties.postTitle;
//     },
//     emailTemplate: "newPost"
//   },

//   newPendingPost: {
//     properties(data) {
//       return Posts.getNotificationProperties(data.post);
//     },
//     subject(properties) {
//       return properties.postAuthorName+' has a new post pending approval: '+properties.postTitle;
//     },
//     emailTemplate: "newPendingPost"
//   },

//   postApproved: {
//     properties(data) {
//       return Posts.getNotificationProperties(data.post);
//     },
//     subject(properties) {
//       return 'Your post “'+properties.postTitle+'” has been approved';
//     },
//     emailTemplate: "postApproved"
//   }
// });