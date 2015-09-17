Telescope.adminRoutes.route('/users', {
  name: "adminUsers",
  action: function(params, queryParams) {
    BlazeLayout.render("layout", {main: "admin_wrapper", admin: "users_dashboard"});
  }
});

FlowRouter.route('/users/:_idOrSlug', {
  name: "userProfile",
  action: function(params, queryParams) {
    BlazeLayout.render("layout", {main: "user_controller", userTemplate: "user_profile"});
  }
});

FlowRouter.route('/users/:_idOrSlug/edit', {
  name: "userEdit",
  action: function(params, queryParams) {
    BlazeLayout.render("layout", {main: "user_controller", userTemplate: "user_edit"});
  }
});

FlowRouter.route('/account', {
  name: "userAccountShortcut",
  triggersEnter: [function(context, redirect) {
    redirect("userEdit", {_idOrSlug: Meteor.userId()});
  }],
});

FlowRouter.route('/sign-out', {
  name: "signOut",
  action: function(params, queryParams) {
    Meteor.logout();
    BlazeLayout.render("layout", {main: "sign_out"});
  }
});

//   // Unsubscribe (from notifications)

//   Router.route('/unsubscribe/:hash', {
//     name: 'unsubscribe',
//     template: 'unsubscribe',
//     data: function() {
//       return {
//         hash: this.params.hash
//       };
//     }
//   });

// });
