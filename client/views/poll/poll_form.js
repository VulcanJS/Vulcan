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
		for (var i=0; i < optionsLength; i++) {
			if (this.poll.options[i].voters.indexOf(userId) > -1) {
				return true;
			}
		}
		return false;
	},
	totalVotes: function () {
		console.log(this);
		return this.poll.voteCount;
	}
});

Template[getTemplate('poll_form')].events({
  'click .poll-vote-btn': function(e, instance){
    e.preventDefault();
    var order = this.voteOrder,
    	post = instance.data;

    console.log(this);
    console.log(order);

    if(!Meteor.user()){
      Router.go('atSignIn');
      flashMessage(i18n.t("please_log_in_first"), "info");
    }
    Meteor.call('pollVote', post, this, function(error, result){
      trackEvent("post poll-voted", {'_id': post._id});
    });
  }
});



Template[getTemplate('poll_form')].rendered = function(){
	this.$('#binary-vote-result-bar').progress('increment');
}