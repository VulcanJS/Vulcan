import Comments from 'meteor/vulcan:comments';

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
    options: {sort: {postedAt: -1}},
    limit: 15
  };
});
