/**
 * Increment the user's post count and upvote the post
 */
function afterPostSubmitOperations (post) {
  var userId = post.userId,
      postAuthor = Meteor.users.findOne(userId);

  Meteor.users.update({_id: userId}, {$inc: {"telescope.postCount": 1}});
  Telescope.upvoteItem(Posts, post, postAuthor);
  return post;
}
Telescope.callbacks.add("postSubmitAsync", afterPostSubmitOperations);
