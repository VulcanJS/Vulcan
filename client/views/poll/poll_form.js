Template[getTemplate('poll_form')].helpers ({
	binaryPoll: function () {
		return this.poll.type == "binary";
	},
	multiplePoll: function () {
		return this.poll.type == "multiple";
	},
	pollVoted: function () {
		var userId = Meteor.userId();
		if (!this.poll || !this.poll.options) {
			return false;
		}
		var options = this.poll.options,
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
	},
	comment_form: function () {
		return getTemplate('comment_form');
	},
	comment_list: function () {
		return getTemplate('comment_list');
	}
});

Template[getTemplate('poll_form')].events({
  'click .poll-multiple-vote-btn': function(e, instance){
    e.preventDefault();
    var post = instance.data;

    if(!Meteor.user()){
      Meteor.loginWithFacebook({requestPermissions: ['email', 'public_profile', 'user_friends']});
      flashMessage(i18n.t("please_log_in_first"), "info");
    }
    if(_.isUndefined(this.voteOrder)) {
    	console.log("this is undefined");
    }
    Meteor.call('pollVote', post, this, function(error, result){
	    Meteor.call('upvotePost', post, function(error, result){});
      	trackEvent("post poll-voted", {'_id': post._id});
    });
  },
  'click .poll-binary-vote-btn': function(e, instance){
    e.preventDefault();
    var order = e.currentTarget.id;
    var option = instance.data.poll.options[order-1];
    var post = this;

    if(!Meteor.user()){
      Meteor.loginWithFacebook({requestPermissions: ['email', 'public_profile', 'user_friends']});
      flashMessage(i18n.t("please_log_in_first"), "info");
    }

    Meteor.call('pollVote', post, option, function(error, result){
	    Meteor.call('upvotePost', post, function(error, result){});
      	trackEvent("post poll-voted", {'_id': this._id});
    });
  },
	'click .custom-answer-btn': function (e) {
		var pathname = getPathname();
		if (pathname.indexOf('/posts/') !== -1) {
			$(e.target).addClass('green').html('<p>Please submit your answer in comment <i class="arrow down icon"></i></p>')
			return;
		}
  		var url= 'http://'+getHostName()+'/posts/'+this._id+'?display=comment-only';
  		var iframe = '<iframe id="comment-modal" src="'+url+'" max-width="991px" height="100%" scrolling="auto" frameborder="0" seamless></iframe>'
	    $('.standard-post-modal-content').html(iframe);

	    $('.ui.post.modal')
	  		.modal('show');
  }
});

Template[getTemplate('poll_form')].rendered = function () {

};