FlowRouter.route('/', {
  name: 'postList',
  action: function (params, queryParams) {
    const AppContainer = Telescope.getComponent('AppContainer');
    const ListContainer = Telescope.getComponent('ListContainer');
    const PostList = Telescope.getComponent('PostList');
    ReactLayout.render(AppContainer, {content: <ListContainer collection={Posts} subscription="posts.list" terms={queryParams} component={PostList}/>})
    // mount(App, {content: <PostListContainer {...queryParams}/>});
  }
});

FlowRouter.route('/post/:_id', {
  name: 'postPage',
  action: function (params, queryParams) {
    const AppContainer = Telescope.getComponent('AppContainer');
    const ItemContainer = Telescope.getComponent('ItemContainer');
    const Post = Telescope.getComponent('Post');
    ReactLayout.render(AppContainer, {content: <ItemContainer collection={Posts} subscription="posts.single" terms={params} component={Post}/>})
    // mount(App, {content: <PostListContainer {...queryParams}/>});
  }
});

FlowRouter.route('/post/:_id/edit', {
  name: 'postEdit',
  action: function (params, queryParams) {
    const AppContainer = Telescope.getComponent('AppContainer');
    const ItemContainer = Telescope.getComponent('ItemContainer');
    const PostEdit = Telescope.getComponent('PostEdit');
    ReactLayout.render(AppContainer, {content: <ItemContainer collection={Posts} subscription="posts.single" terms={params} component={PostEdit}/>})
    // mount(App, {content: <PostListContainer {...queryParams}/>});
  }
});