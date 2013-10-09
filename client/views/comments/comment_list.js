Template.comment_list.helpers({
  has_comments: function(){
    // note: use this.post to access 'post' object in router data context
    if(this.post)
      return this.comments.count() > 0;
  },
  child_comments: function(){
    // return all root comments
    return Comments.find({post: this.post._id, parent: null}, {sort: {score: -1, submitted: -1}});
  }
});

Template.comment_list.created = function(){
  postObject = this.data.post;
}