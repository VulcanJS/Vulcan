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

// FlowRouter.route('/', {
//   name: "postsDefault",
//   action: function(params, queryParams) {
//     BlazeLayout.render("layout", {main: "main_posts_list"});
//   }
// });

// FlowRouter.route('/posts/:_id/edit', {
//   name: "postEdit",
//   action: function(params, queryParams) {
//     BlazeLayout.render("layout", {main: "post_edit"});
//   }
// });

// FlowRouter.route('/posts/:_id/:slug?', {
//   name: "postPage",
//   action: function(params, queryParams) {
//     trackRouteEntry(params._id);
//     BlazeLayout.render("layout", {main: "post_page"});
//   }
// });

// var trackRouteEntry = function (postId) {
//   var sessionId = Meteor.default_connection && Meteor.default_connection._lastSessionId ? Meteor.default_connection._lastSessionId : null;
//   Meteor.call('increasePostViews', postId, sessionId);
// }

// FlowRouter.route('/submit', {
//   name: "postSubmit",
//   action: function(params, queryParams) {
//     BlazeLayout.render("layout", {main: "post_submit"});
//   }
// });