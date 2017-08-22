import Comments from 'meteor/vulcan:comments';
import Users from "meteor/vulcan:users";
import LWEvents from "./collections/lwevents/collection.js";

Comments.addView("postCommentsTop", function (terms) {
  return {
    selector: {postId: terms.postId},
    options: {sort: {score: -1, postedAt: -1}}
  };
});

Comments.addView("postCommentsNew", function (terms) {
  return {
    selector: {postId: terms.postId},
    options: {sort: {postedAt: -1}}
  };
});

Comments.addView("postCommentsBest", function (terms) {
  return {
    selector: {postId: terms.postId},
    options: {sort: {baseScore: -1}, postedAt: -1}
  };
});

Comments.addView("recentComments", function (terms) {
  return {
    options: {sort: {postedAt: -1}, limit: terms.limit || 5},
  };
});

Users.addView("topContributors", function (terms) {
  return {
    options: {sort: {karma: -1}, limit: 5},
  };
});

LWEvents.addView("postVisits", function (terms) {
  return {
    selector: {documentId: terms.postId, userId: terms.userId, name: "post-view"},
    options: {sort: {createdAt: -1}, limit: terms.limit || 1},
  };
});
