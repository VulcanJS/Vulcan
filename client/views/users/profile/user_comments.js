Template[getTemplate('userComments')].created = function () {
  Session.set('commentsShown', 5);
  var user = this.data;
  Tracker.autorun(function () {
    coreSubscriptions.subscribe('userComments', user._id, Session.get('commentsShown'));
  });
};

Template[getTemplate('userComments')].helpers({
  comments: function () {
    var comments = Comments.find({userId: this._id}, {limit: Session.get('commentsShown')});
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
    return Comments.find({userId: this._id}).count() >= Session.get('commentsShown');
  }
});

Template[getTemplate('userComments')].events({
  'click .comments-more': function (e) {
    e.preventDefault();
    var commentsShown = Session.get('commentsShown');
    Session.set('commentsShown', commentsShown + 10);
  }
});