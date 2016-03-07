Template.comment_list.helpers({
  commentListClass: function () {
    var post = this;
    var comments = Comments.find({postId: post._id, parentCommentId: null}, {sort: {score: -1, postedAt: -1}});
    return !!comments.count() ? "has-comments" : "no-comments";
  },
  childComments: function(){
    var post = this;
    var comments = Comments.find({postId: post._id, parentCommentId: null}, {sort: {score: -1, postedAt: -1}});
    return comments;
  }
});

Template.comment_list.rendered = function(){
  // once all comments have been rendered, activate comment queuing for future real-time comments
  window.queueComments = true;
};
