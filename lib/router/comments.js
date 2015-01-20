// Controller for comment pages

CommentPageController = RouteController.extend({
  waitOn: function() {
    return [
      coreSubscriptions.subscribe('singleCommentAndChildren', this.params._id),
      coreSubscriptions.subscribe('commentUsers', this.params._id),
      coreSubscriptions.subscribe('commentPost', this.params._id)
    ];
  },
  data: function() {
    return {
      comment: Comments.findOne(this.params._id)
    };
  },
  onAfterAction: function () {
    window.queueComments = false;
  },
  fastRender: true
});

Meteor.startup( function () {

  // Comment Reply

  Router.route('/comments/:_id', {
    name: 'comment_reply',
    template: getTemplate('comment_reply'),
    controller: CommentPageController,
    onAfterAction: function() {
      window.queueComments = false;
    }
  });

  // Comment Edit

  Router.route('/comments/:_id/edit', {
    name: 'comment_edit',
    template: getTemplate('comment_edit'),
    controller: CommentPageController,
    onAfterAction: function() {
      window.queueComments = false;
    }
  });

});