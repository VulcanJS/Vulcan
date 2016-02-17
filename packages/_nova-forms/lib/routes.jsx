FlowRouter.route('/post/new', {
  name: 'newPost',
  action: function (params, queryParams) {
    ReactLayout.render(AppContainer, {content: <NewPost {...params} />})
    // mount(App, {content: <PostListContainer {...queryParams}/>});
  }
});