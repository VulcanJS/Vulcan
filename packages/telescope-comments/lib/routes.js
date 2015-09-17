FlowRouter.route('/comments/:_id', {
  name: "commentPage",
  action: function(params, queryParams) {
    BlazeLayout.render("layout", {main: "comment_controller", commentTemplate: "comment_reply"});
  }
});

FlowRouter.route('/comments/:_id/edit', {
  name: "commentEdit",
  action: function(params, queryParams) {
    BlazeLayout.render("layout", {main: "comment_controller", commentTemplate: "comment_edit"});
  }
});