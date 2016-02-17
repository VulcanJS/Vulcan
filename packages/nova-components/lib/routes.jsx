// ------------------------------------- Posts -------------------------------- //

FlowRouter.route('/', {
  name: 'postList',
  action: function (params, queryParams) {
    ({AppContainer, ListContainer, PostList} = Telescope.components);
    ReactLayout.render(AppContainer, {content: <ListContainer collection={Posts} publication="posts.list" terms={queryParams} component={PostList}/>})
    // mount(App, {content: <PostListContainer {...queryParams}/>});
  }
});

FlowRouter.route('/post/:_id', {
  name: 'postPage',
  action: function (params, queryParams) {
    ({AppContainer, ItemContainer, Post} = Telescope.components);
    ReactLayout.render(AppContainer, {content: <ItemContainer collection={Posts} publication="posts.single" terms={params} component={Post}/>})
    // mount(App, {content: <PostListContainer {...queryParams}/>});
  }
});

FlowRouter.route('/post/:_id/edit', {
  name: 'postEdit',
  action: function (params, queryParams) {
    ({AppContainer, ItemContainer, Post} = Telescope.components);
    ReactLayout.render(AppContainer, {content: <ItemContainer collection={Posts} publication="posts.single" terms={params} component={PostEdit}/>})
    // mount(App, {content: <PostListContainer {...queryParams}/>});
  }
});

// ------------------------------------- Comments -------------------------------- //

// FlowRouter.route('/comments/:_id', {
//   name: "commentPage",
//   action: function(params, queryParams) {
//     BlazeLayout.render("layout", {main: "comment_controller", commentTemplate: "comment_reply"});
//   }
// });

// FlowRouter.route('/comments/:_id/edit', {
//   name: "commentEdit",
//   action: function(params, queryParams) {
//     BlazeLayout.render("layout", {main: "comment_controller", commentTemplate: "comment_edit"});
//   }
// });

// ------------------------------------- Users -------------------------------- //

// Telescope.adminRoutes.route('/users', {
//   name: "adminUsers",
//   action: function(params, queryParams) {
//     BlazeLayout.render("layout", {main: "admin_wrapper", admin: "users_dashboard"});
//   }
// });

// FlowRouter.route('/users/:_idOrSlug', {
//   name: "userProfile",
//   action: function(params, queryParams) {
//     BlazeLayout.render("layout", {main: "user_controller", userTemplate: "user_profile"});
//   }
// });

// FlowRouter.route('/users/:_idOrSlug/edit', {
//   name: "userEdit",
//   action: function(params, queryParams) {
//     BlazeLayout.render("layout", {main: "user_controller", userTemplate: "user_edit"});
//   }
// });

// FlowRouter.route('/account', {
//   name: "userAccountShortcut",
//   triggersEnter: [function(context, redirect) {
//     redirect("userEdit", {_idOrSlug: Meteor.userId()});
//   }]
// });

// FlowRouter.route('/sign-out', {
//   name: "signOut",
//   triggersEnter: [function(context, redirect) {
//     AccountsTemplates.logout();
//     Messages.flash(i18n.t("you_have_been_logged_out"));
//   }]
// });