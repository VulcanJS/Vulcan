Template.comments_list_compact.helpers({
  commentsCursor: function () {
    if (this.commentsCursor) { // not sure why this should ever be undefined, but it can apparently
      var comments = this.commentsCursor.map(function (comment, index) {
        comment.rank = index;
        return comment;
      });
      return comments;
    } else {
      console.log('commentsCursor not defined');
    }
  },
  postTitle: function () {
    var post = Posts.findOne(this.postId);
    return !!post && post.title;
  },
  fieldLabel: function () {
    return this.controllerOptions.fieldLabel;
  },
  fieldValue: function () {
    var controllerOptions = Template.parentData(3).data.controllerOptions;
    return controllerOptions.fieldValue(this);
  }
});

Template.comments_list_compact.events({
  'click .more-button': function (event) {
    event.preventDefault();
    if (this.controllerInstance) {
      // controller is a template
      this.loadMoreHandler(this.controllerInstance);
    } else {
      // controller is router
      this.loadMoreHandler();
    }
  }
});
