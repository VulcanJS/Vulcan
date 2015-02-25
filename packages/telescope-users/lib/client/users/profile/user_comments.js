Template[getTemplate('userComments')].created = function () {
  Session.set('commentsShown', 5);

  var user = this.data;
  var instance = this;
  
  instance.commentsShown = new ReactiveVar(5);
  instance.comments = new ReactiveVar({});

  this.autorun(function () {
    
    // get parameters
    var limit = instance.commentsShown.get();
    
    // subscribe
    instance.subscription = Meteor.subscribe('userComments', user._id, limit);

    // set cursor
    instance.comments.set(Comments.find({userId: user._id}, {limit: limit}));
  });
};

Template[getTemplate('userComments')].helpers({
  comments: function () {
    var comments = Template.instance().comments.get();
    if(!!comments){
      // extend comments with each commented post
      var extendedComments = comments.map(function (comment) {
        var post = Posts.findOne(comment.postId);
        if(post) // post might not be available anymore
          comment.postTitle = post.title;
        return comment;
      });
      return extendedComments;
    }
  },
  hasMoreComments: function () {
    return Template.instance().comments.get().count() >= Template.instance().commentsShown.get();
  }
});

Template[getTemplate('userComments')].events({
  'click .comments-more': function (e) {
    e.preventDefault();
    var commentsShown = Template.instance().commentsShown.get();
    Template.instance().commentsShown.set(commentsShown+5);
  }
});