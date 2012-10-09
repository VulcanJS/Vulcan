Template.comment_list.helpers({
  has_comments: function(){
    var post = Posts.findOne(Session.get('selectedPostId'));
    if(post){
      return Comments.find({post: post._id, parent: null}).count() > 0;
    }
  },
  child_comments: function(){
    var post = Posts.findOne(Session.get('selectedPostId'));
    return Comments.find({post: post._id, parent: null}, {sort: {score: -1, submitted: -1}});
  }
})