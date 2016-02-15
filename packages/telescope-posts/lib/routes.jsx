FlowRouter.route('/', {
  name: 'postList',
  action: function (params, queryParams) {
    ReactLayout.render(AppContainer, {content: <PostListContainer {...queryParams} />})
    // mount(App, {content: <PostListContainer {...queryParams}/>});
  }
});

FlowRouter.route('/post/:_id', {
  name: 'post',
  action: function (params, queryParams) {
    ReactLayout.render(AppContainer, {content: <PostContainer {...params} />})
    // mount(App, {content: <PostListContainer {...queryParams}/>});
  }
});