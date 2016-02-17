Template.comment_controller.onCreated(function () {
  
  var template = this;
  var commentId = FlowRouter.getParam("_id");

  template.subscribe('singleCommentAndChildren', commentId);

  if (FlowRouter.getRouteName() === "commentPage") {
    template.subscribe('commentUsers', commentId);
    template.subscribe('commentPost', commentId);
  }

});

Template.comment_controller.helpers({
  data: function () {
    return {comment: Comments.findOne(FlowRouter.getParam("_id"))};
  }
});