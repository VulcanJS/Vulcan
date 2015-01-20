Template[getTemplate('comment_list')].helpers({
  comment_item: function () {
    return getTemplate('comment_item');
  },
  child_comments: function(){
    var post = this;
    var comments = Comments.find({postId: post._id, parentCommentId: null}, {sort: {score: -1, postedAt: -1}});
    return comments;
  },
  threadModules: function () {
    return threadModules;
  },
  getTemplate: function () {
    return getTemplate(this.template);
  }
});

Template[getTemplate('comment_list')].rendered = function(){
  // once all comments have been rendered, activate comment queuing for future real-time comments
  window.queueComments = true;
};