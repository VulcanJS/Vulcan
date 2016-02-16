// common

Telescope.registerComponent("Footer", require('./common/Footer.jsx'));
Telescope.registerComponent("Header", require('./common/Header.jsx'));
Telescope.registerComponent("Layout", require('./common/Layout.jsx'));
Telescope.registerComponent("Logo", require('./common/Logo.jsx'));

// posts

Telescope.registerComponent("LoadMore", require('./posts/list/LoadMore.jsx'));
Telescope.registerComponent("NoMorePosts", require('./posts/list/NoMorePosts.jsx'));
Telescope.registerComponent("NoPosts", require('./posts/list/NoPosts.jsx'));
Telescope.registerComponent("PostItem", require('./posts/list/PostItem.jsx'));
Telescope.registerComponent("PostsLoading", require('./posts/list/PostsLoading.jsx'));
Telescope.registerComponent("PostList", require('./posts/list/PostList.jsx'));
Telescope.registerComponent("Post", require('./posts/Post.jsx'));
Telescope.registerComponent("PostEdit", require('./posts/PostEdit.jsx'));

// comments

Telescope.registerComponent("CommentItem", require('./comments/list/CommentItem.jsx'));
Telescope.registerComponent("CommentList", require('./comments/list/CommentList.jsx'));