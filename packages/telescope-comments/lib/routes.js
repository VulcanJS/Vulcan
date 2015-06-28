// Controller for comment pages

Comments.controllers = {};

Comments.controllers.page = RouteController.extend({
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
    name: 'comment_page',
    template: 'comment_reply',
    controller: Comments.controllers.page,
    onAfterAction: function() {
      window.queueComments = false;
    }
  });

  // Comment Edit

  Router.route('/comments/:_id/edit', {
    name: 'comment_edit',
    template: 'comment_edit',
    controller: Comments.controllers.page,
    onAfterAction: function() {
      window.queueComments = false;
    }
  });

});
