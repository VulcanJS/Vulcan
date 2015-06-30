
//////////////////////////////////////////////////////
// Collection Hooks                                 //
//////////////////////////////////////////////////////

/**
 * Generate HTML body from Markdown on post insert
 */
Posts.before.insert(function (userId, doc) {
  if(!!doc.body)
    doc.htmlBody = Telescope.utils.sanitize(marked(doc.body));
});

/**
 * Generate HTML body from Markdown when post body is updated
 */
Posts.before.update(function (userId, doc, fieldNames, modifier) {
  // if body is being modified, update htmlBody too
  if (Meteor.isServer && modifier.$set && modifier.$set.body) {
    modifier.$set.htmlBody = Telescope.utils.sanitize(marked(modifier.$set.body));
  }
});

/**
 * Generate slug when post title is updated
 */
Posts.before.update(function (userId, doc, fieldNames, modifier) {
  // if title is being modified, update slug too
  if (Meteor.isServer && modifier.$set && modifier.$set.title) {
    modifier.$set.slug = Telescope.utils.slugify(modifier.$set.title);
  }
});

/**
 * Disallow $rename
 */
Posts.before.update(function (userId, doc, fieldNames, modifier) {
  if (!!modifier.$rename) {
    throw new Meteor.Error("illegal $rename operator detected!");
  }
});

//////////////////////////////////////////////////////
// Callbacks                                        //
//////////////////////////////////////////////////////

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
