Template[getTemplate('user_friend_votes')].created = function () {

  var user = this.data.friend;
  var instance = this;

  // initialize the terms and posts local reactive variables
  instance.terms = new ReactiveVar({
    view: 'userUpvotedPosts',
    userId: user._id,
    limit: 10
  });
  instance.posts = new ReactiveVar({});

  // will re-run when the "terms" local reactive variable changes
  this.autorun(function () {

    // get the new terms and generate new parameters from them
    var terms = instance.terms.get();
    var parameters = getPostsParameters(terms);

    // subscribe to the userPosts publication
    instance.subscription = Meteor.subscribe('userUpvotedPosts', terms);

    // update the instance's "posts" cursor
    instance.posts.set(Posts.find(parameters.find, parameters.options));
    
  });
};

var answerName = function(data,post) {
  	var voteOnThis = _.findWhere(data.votes.pollvotedPosts, {'itemId' :post._id}).voteOrder;

  	return post.poll.options[voteOnThis-1].name;
}

Template[getTemplate('user_friend_votes')].helpers({
  posts: function () {
    var user = this.friend;
    var posts = Template.instance().posts.get().fetch();
    posts = _.map(posts, function (post) {
      var vote = _.findWhere(user.votes.pollvotedPosts, {itemId: post._id});
      post.votedAt = vote.votedAt;
      return post;
    });
    return posts;
  },
  hasMorePosts: function () {
    return Template.instance().posts.get().count() >= Template.instance().terms.get().limit;
  },
  friendVotedOption: function (friend) {
  	var friend = friend.hash.friend,
  		post = this;

  	return answerName(friend,post);
  },
  userVotedOption: function (user) {
  	var user = user.hash.user,
  		post = this;

  	if(!user.votes.pollvotedPosts || !_.findWhere(user.votes.pollvotedPosts, {'itemId' :this._id})) {
  		return false;
  	}
  	return answerName(user,post);
  },
  diffAnswer: function (data) {
  	var friend = data.hash.friend,
  	 	user = data.hash.user,
  	 	post = this;
  	return answerName(friend,post) !== answerName(user,post);
  },
  friendComment: function(data) {
  	var friend = data.hash.friend;
  	if(!friend.votes.pollvotedPosts || !_.findWhere(friend.votes.pollvotedPosts, {'itemId' :this._id})) {
  		return false;
  	}
  }
});

Template[getTemplate('user_friend_votes')].events({
  'click .upvotedposts-more': function (e) {
    e.preventDefault();
    var terms = Template.instance().terms.get();
    terms.limit += 10;
    Template.instance().terms.set(terms)
  }
});