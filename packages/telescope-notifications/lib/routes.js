FlowRouter.route('/unsubscribe/:hash', {
  name: "unsubscribe",
  action: function(params, queryParams) {
    Meteor.logout();
    BlazeLayout.render("layout", {main: "unsubscribe"});
  }
});