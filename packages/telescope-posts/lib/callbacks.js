/**
 * Increment the user's post count and upvote the post
 */
function afterPostSubmitOperations (post) {
  var userId = post.userId;
  Meteor.users.update({_id: userId}, {$inc: {"telescope.postCount": 1}});
  return post;
}
Telescope.callbacks.add("postSubmitAsync", afterPostSubmitOperations);

function upvoteOwnPost (post) {
  var postAuthor = Meteor.users.findOne(post.userId);
  Telescope.upvoteItem(Posts, post, postAuthor);
  return post;
}
Telescope.callbacks.add("postSubmitAsync", upvoteOwnPost);
