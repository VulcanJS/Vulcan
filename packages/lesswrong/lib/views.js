import Comments from 'meteor/vulcan:comments';

Comments.addView("postCommentsByVotes", function (terms) {
  return {
    selector: {postId: terms.postId},
    options: {sort: {baseScore: -1, postedAt: -1}}
  };
});
