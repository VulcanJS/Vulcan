Template[getTemplate('poll_form')].helpers ({
	binaryPoll: function () {
		return this.poll.type == "binary";
	},
	multiplePoll: function () {
		return this.poll.type == "multiple";
	},
	pollVoted: function () {
		var userId = Meteor.userId(),
			options = this.poll.options,
			optionsLength = options.length;
		if (optionsLength > 0) {
			for (var i=0; i < optionsLength; i++) {
				if (_.contains(options[i].voters, userId)) {
					return true;
				}
			}
		}	
		return false;
	},
	multiplePollBarPercentage: function (options) {
		var pollOptions = options.hash.options,
			optionsLength = pollOptions.length,
			biggist = 0;
		for(var i=0; i< optionsLength; i++) {
			var optionVotes = pollOptions[i].votes;

			if (optionVotes > biggist) {
				biggist = optionVotes;
			} else {
				biggist = biggist;
			}
		}
		if (!_.isUndefined(options.hash.voteCount)) {
			var percentage = Math.round((options.hash.votes / biggist) * 100, -1);
			if (percentage > 100) {
				return 100;
			}
			return percentage;
		}
	},
	votePercentage: function (options) {
		if (!_.isUndefined(options.hash.voteCount)) {
			return Math.round(options.hash.votes / options.hash.voteCount * 100, -1);
		}
		return Math.round(this.poll.options[options.hash.order-1].votes / this.poll.voteCount * 100, -1);
	},
	hasVotes: function() {
		return this.votes > 0;
	}
});

Template[getTemplate('poll_form')].events({
  'click .poll-multiple-vote-btn': function(e, instance){
    e.preventDefault();
    var post = instance.data;

    if(!Meteor.user()){
      Router.go('atSignIn');
      flashMessage(i18n.t("please_log_in_first"), "info");
    }
    if(_.isUndefined(this.voteOrder)) {
    	console.log("this is undefined");
    }
    Meteor.call('pollVote', post, this, function(error, result){
      	trackEvent("post poll-voted", {'_id': post._id});

	    Meteor.call('upvotePost', post, function(error, result){
	      trackEvent("post upvoted", {'_id': post._id});
	    });
    });


  },
  'click .poll-binary-vote-btn': function(e, instance){
    e.preventDefault();
    var order = e.currentTarget.id;
    var option = instance.data.poll.options[order-1];
    var post = this;

    if(!Meteor.user()){
      Router.go('atSignIn');
      flashMessage(i18n.t("please_log_in_first"), "info");
    }

    Meteor.call('pollVote', post, option, function(error, result){
      	trackEvent("post poll-voted", {'_id': this._id});
	    Meteor.call('upvotePost', post, function(error, result){
	      trackEvent("post upvoted", {'_id': post._id});
	    });
    });
  }
});

Template[getTemplate('poll_form')].rendered = function(){
	this.$('#vote-result-bar-1').progress();
	this.$('#vote-result-bar-2').progress();
	this.$('#vote-result-bar-3').progress();
	this.$('#vote-result-bar-4').progress();
	this.$('#vote-result-bar-5').progress();
}