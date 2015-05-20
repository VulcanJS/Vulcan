/**
 * Comment views are filters used for subscribing to and viewing comments
 * @namespace Comments.views
 */
Comments.views = {};

/**
 * Add a module to a comment view
 * @param {string} viewName - The name of the view
 * @param {function} [viewFunction] - The function used to calculate query terms. Takes terms and baseParameters arguments
 */
Comments.views.add = function (viewName, viewFunction) {
  Comments.views[viewName] = viewFunction;
};

// will be common to all other view unless specific properties are overwritten
Comments.views.baseParameters = {
  options: {
    limit: 10
  }
};

Comments.views.add("postComments", function (terms) {
  return {
    find: {postId: terms.postId},
    options: {limit: 0, sort: {score: -1, postedAt: -1}}
  };
});

Comments.views.add("userComments", function (terms) {
  return {
    find: {userId: terms.userId},
    options: {sort: {postedAt: -1}}
  };
});