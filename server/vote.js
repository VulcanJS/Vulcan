Meteor.methods({
  voteForPost: function(post){
    var user = this.userId();
    if(!user) return false;

    var myvote = MyVotes.findOne({post: post._id, user: user});
    if(myvote) return false;

    MyVotes.insert({post: post._id, user: user, vote: 1});
    Posts.update(post._id, {$inc: {votes: 1}});
    return true;
  }
});
