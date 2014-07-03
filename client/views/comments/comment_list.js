Template.comment_list.created = function(){
  postObject = this.data;
}

Template.comment_list.helpers({
  has_comments: function(){
    var post = this;
    var comments = Comments.find({postId: post._id, parent: null}, {sort: {score: -1, postedAt: -1}});
    return comments.count() > 0;
  },
  child_comments: function(){
    var post = this;
    var comments = Comments.find({postId: post._id, parent: null}, {sort: {score: -1, postedAt: -1}});
    return comments;
  }
});

Template.comment_list.rendered = function(){
  // once all comments have been rendered, activate comment queuing for future real-time comments
  window.queueComments = true;
}