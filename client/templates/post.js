Template.post.events = {
    'click .discuss-link': function(evt){
      evt.preventDefault();
      Session.set('selected_post', this);
      Session.set('state', 'view_post');
  }

  , 'click .upvote-link': function(){
      Meteor.call('voteForPost', this);
  }

  , 'click .share-link': function(){
      e.preventDefault();
      $(".share-link").not($(this)).next().addClass("hidden");
      $(this).next().toggleClass("hidden");
      $(".overlay").toggleClass("hidden");
  }
};

Template.post.rank = function(){
  return 1;
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

Template.post.domain = function(){
  var a = document.createElement('a');
  a.href = this.url;
  return a.hostname;
};
