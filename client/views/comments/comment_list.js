Template.comment_list.helpers({
  has_comments: function(){
    // note: use this.post to access 'post' object in parent template
    if(this.post){
      return Comments.find({post: this.post._id, parent: null}).count() > 0;
    }
  },
  child_comments: function(){
    return Comments.find({post: this.post._id, parent: null}, {sort: {score: -1, submitted: -1}});
  }
})