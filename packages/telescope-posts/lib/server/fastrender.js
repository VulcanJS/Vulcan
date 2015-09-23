Posts.fastRenderSubscribe = function (params) {

  // generate cat array
  var categories = [];
  var index = 0;
  while (!!params.query["cat["+index+"]"]) {
    categories.push(params.query["cat["+index+"]"]);
    delete params.query["cat["+index+"]"];
    index++;
  }
  if (categories.length) {
    params.query.cat = categories;
  }

  this.subscribe('postsList', params.query);
  this.subscribe('postsListUsers', params.query);
};

Meteor.startup(function () {
  FastRender.route("/", Posts.fastRenderSubscribe);
  FastRender.route("/posts/:_id/:slug?", function (params) {
    var postId = params._id;
    this.subscribe('singlePost', postId);
    this.subscribe('postUsers', postId);
    this.subscribe('commentsList', {view: 'postComments', postId: postId});
  });
});