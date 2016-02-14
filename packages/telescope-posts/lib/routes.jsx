FlowRouter.route('/', {
  name: 'postList',
  action: function (params, queryParams) {
    ReactLayout.render(AppContainer, {content: <PostListContainer {...queryParams} />})
    // mount(App, {content: <PostListContainer {...queryParams}/>});
  }
});