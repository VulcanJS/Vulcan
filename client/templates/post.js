Template.post.events = {
    'click .discuss-link': function(){
      Session.set('selected_post', this);
      Session.set('state', 'view_post');
  }

  , 'click .upvote-link': function(){
      Meteor.call('voteForPost', this);
  }
};

Template.post.ago = function(){
  var submitted = new Date(this.submitted);
  return submitted.toString();
};

Template.post.voted = function(){
  var user = Meteor.user();
  if(!user) return false;
  var myvote = MyVotes.findOne({post: this._id, user: user._id});
  return !!myvote;
};
