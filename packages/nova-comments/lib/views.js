import Comments from './collection.js';

// will be common to all other view unless specific properties are overwritten
Comments.addDefaultView(function (terms) {
  return {
    options: {limit: 1000}
  };
});

Comments.addView("postComments", function (terms) {
  return {
    selector: {postId: terms.postId},
    options: {sort: {postedAt: -1}}
  };
});

Comments.addView("userComments", function (terms) {
  return {
    selector: {userId: terms.userId},
    options: {sort: {postedAt: -1}}
  };
});