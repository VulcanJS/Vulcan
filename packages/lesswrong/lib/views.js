import Comments from 'meteor/vulcan:comments';
import Users from "meteor/vulcan:users";

Comments.addView("postCommentsTop", function (terms) {
  return {
    selector: {postId: terms.postId},
    options: {sort: {baseScore: -1, postedAt: -1}}
  };
});

Comments.addView("postCommentsNew", function (terms) {
  return {
    selector: {postId: terms.postId},
    options: {sort: {postedAt: -1}}
  };
});

Comments.addView("recentComments", function (terms) {
  return {
    selector: {baseScore: {$gte: 0}},
    options: {sort: {postedAt: -1}},
    limit: 5
  };
});

Users.addView("topContributors", function (terms) {
  return {
    options: {sort: {karma: -1}},
    limit: 5
  };
});
