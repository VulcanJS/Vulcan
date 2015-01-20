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
	votePercentage: function (order) {
		return Math.round(this.poll.options[order.hash.order-1].votes / this.poll.voteCount * 100, -1);
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
    });
  },
  'click .poll-binary-vote-btn': function(e, instance){
    e.preventDefault();
    var order = e.currentTarget.id;
    var option = instance.data.poll.options[order-1];

    if(!Meteor.user()){
      Router.go('atSignIn');
      flashMessage(i18n.t("please_log_in_first"), "info");
    }

    Meteor.call('pollVote', this, option, function(error, result){
      trackEvent("post poll-voted", {'_id': post._id});
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