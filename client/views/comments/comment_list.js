Template.comment_list.created = function(){
  postObject = this.data;
}

Template.comment_list.helpers({
  has_comments: function(){
    var post = this;
    var comments = Comments.find({post: post._id, parent: null}, {sort: {score: -1, submitted: -1}});
    return comments.count() > 0;
  },
  child_comments: function(){
    var post = this;
    var comments = Comments.find({post: post._id, parent: null}, {sort: {score: -1, submitted: -1}});
    return comments;
  }
});