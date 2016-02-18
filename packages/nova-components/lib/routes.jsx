// ------------------------------------- Posts -------------------------------- //

FlowRouter.route('/', {
  name: 'posts.list',
  action: function (params, queryParams) {
    ({AppContainer, ListContainer, PostList} = Telescope.components);
    ({selector, options} = Posts.parameters.get(queryParams));
    ReactLayout.render(AppContainer, {content: 
      <ListContainer 
        collection={Posts} 
        publication="posts.list"
        selector={selector}
        options={options}
        terms={queryParams} 
        component={PostList}
        joins={Posts.simpleSchema().getJoins()}
      />})
    // mount(App, {content: <PostListContainer {...queryParams}/>});
  }
});

// FlowRouter.route('/post/new', {
//   name: 'postNew',
//   action: function (params, queryParams) {
//     ({ItemContainer} = Telescope.components);
//     ReactLayout.render(AppContainer, {content: <ItemContainer/>})
//     // mount(App, {content: <PostListContainer {...queryParams}/>});
//   }
// });

FlowRouter.route('/posts/new', {
  name: 'posts.new',
  action: function (params, queryParams) {
    ({AppContainer, PostNewContainer} = Telescope.components);
    ReactLayout.render(AppContainer, {content: <PostNewContainer />})
    // mount(App, {content: <PostListContainer {...queryParams}/>});
  }
});

FlowRouter.route('/posts/:_id', {
  name: 'posts.single',
  action: function (params, queryParams) {
    ({AppContainer, ItemContainer, Post} = Telescope.components);
    ReactLayout.render(AppContainer, {content: <ItemContainer collection={Posts} publication="posts.single" terms={params} component={Post}/>})
    // mount(App, {content: <PostListContainer {...queryParams}/>});
  }
});

FlowRouter.route('/posts/:_id/edit', {
  name: 'posts.edit',
  action: function (params, queryParams) {
    ({AppContainer, ItemContainer, PostEditContainer} = Telescope.components);
    ReactLayout.render(AppContainer, {content: <ItemContainer collection={Posts} publication="posts.single" terms={params} component={PostEditContainer}/>})
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