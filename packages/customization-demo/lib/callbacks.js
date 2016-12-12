/*
Let's add a callback to the new post method that
appends a random emoji to the newly submitted post's title.
*/

import Telescope from 'meteor/nova:lib';
import { Callbacks } from 'meteor/nova:core';

function PostsNewAddRandomEmoji (post, user) {

  post.title = post.title + " " +_.sample(["🎉", "💎", "☠", "⏱", "🎈", "⛱"])

  return post;
}
Callbacks.add("posts.new.sync", PostsNewAddRandomEmoji);
