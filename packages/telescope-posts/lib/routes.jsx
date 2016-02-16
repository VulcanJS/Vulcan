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