/*
Let's add a callback to the new post method that
appends a random emoji to the newly submitted post's title.
*/

function PostsNewAddRandomEmoji (post, user) {

  post.title = post.title + " " +_.sample(["🎉", "💎", "☠", "⏱", "🎈", "⛱"])

  return post;
}
Telescope.callbacks.add("posts.new.sync", PostsNewAddRandomEmoji);
