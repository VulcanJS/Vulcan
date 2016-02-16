FlowRouter.route('/', {
  name: 'postList',
  action: function (params, queryParams) {
    const PostListContainer = Telescope.getComponent('PostListContainer');
    ReactLayout.render(AppContainer, {content: <PostListContainer terms={queryParams} component="PostList"/>})
    // mount(App, {content: <PostListContainer {...queryParams}/>});
  }
});

FlowRouter.route('/post/:_id', {
  name: 'postPage',
  action: function (params, queryParams) {
    const PostContainer = Telescope.getComponent('PostContainer');
    ReactLayout.render(AppContainer, {content: <PostContainer {...params} component="Post"/>})
    // mount(App, {content: <PostListContainer {...queryParams}/>});
  }
});

FlowRouter.route('/post/:_id/edit', {
  name: 'postEdit',
  action: function (params, queryParams) {
    const PostContainer = Telescope.getComponent('PostContainer');
    ReactLayout.render(AppContainer, {content: <PostContainer {...params} component="PostEdit"/>})
    // mount(App, {content: <PostListContainer {...queryParams}/>});
  }
});