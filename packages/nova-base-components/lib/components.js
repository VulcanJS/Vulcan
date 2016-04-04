// common

Telescope.registerComponent("App", require('./common/App.jsx'));
Telescope.registerComponent("Footer", require('./common/Footer.jsx'));
Telescope.registerComponent("Header", require('./common/Header.jsx'));
Telescope.registerComponent("Layout", require('./common/Layout.jsx'));
Telescope.registerComponent("Logo", require('./common/Logo.jsx'));
Telescope.registerComponent("Flash", require('./common/Flash.jsx'));
Telescope.registerComponent('HeadTags', require('./common/HeadTags.jsx'));
Telescope.registerComponent("FlashMessages", require('./common/FlashMessages.jsx'));
Telescope.registerComponent("NewsletterForm", require('./common/NewsletterForm.jsx'));
Telescope.registerComponent("Icon", require('./common/Icon.jsx'));
Telescope.registerComponent("SearchForm", require('./common/SearchForm.jsx'));
Telescope.registerComponent("NewPostButton", require('./common/NewPostButton.jsx'));
Telescope.registerComponent("AppLoading", require('./common/AppLoading.jsx'));
Telescope.registerComponent("Error404", require('./common/Error404.jsx'));
Telescope.registerComponent("Loading", require('./common/Loading.jsx'));

// posts

Telescope.registerComponent("LoadMore", require('./posts/list/LoadMore.jsx'));
Telescope.registerComponent("NoMorePosts", require('./posts/list/NoMorePosts.jsx'));
Telescope.registerComponent("NoPosts", require('./posts/list/NoPosts.jsx'));
Telescope.registerComponent("PostItem", require('./posts/list/PostItem.jsx'));
Telescope.registerComponent("PostsLoading", require('./posts/list/PostsLoading.jsx'));
Telescope.registerComponent("PostViews", require('./posts/list/PostViews.jsx'));
Telescope.registerComponent("PostList", require('./posts/list/PostList.jsx'));
Telescope.registerComponent("PostListHeader", require('./posts/list/PostListHeader.jsx'));
Telescope.registerComponent("PostCategories", require('./posts/list/PostCategories.jsx'));
Telescope.registerComponent("PostCommenters", require('./posts/list/PostCommenters.jsx'));
Telescope.registerComponent("PostPage", require('./posts/PostPage.jsx'));
Telescope.registerComponent("PostStats", require('./posts/PostStats.jsx'));
Telescope.registerComponent("PostDaily", require('./posts/PostDaily.jsx'));
Telescope.registerComponent("PostDay", require('./posts/PostDay.jsx'));
Telescope.registerComponent("Vote", require('./posts/Vote.jsx'));
Telescope.registerComponent("PostThumbnail", require('./posts/list/PostThumbnail.jsx'));
Telescope.registerComponent("PostEditForm", require('./posts/PostEditForm.jsx'));
Telescope.registerComponent("PostNewForm", require('./posts/PostNewForm.jsx'));

// comments

Telescope.registerComponent("CommentItem", require('./comments/list/CommentItem.jsx'));
Telescope.registerComponent("CommentList", require('./comments/list/CommentList.jsx'));
Telescope.registerComponent("CommentNode", require('./comments/list/CommentNode.jsx'));
Telescope.registerComponent("CommentNew", require('./comments/list/CommentNew.jsx'));
Telescope.registerComponent("CommentEdit", require('./comments/list/CommentEdit.jsx'));

// categories

Telescope.registerComponent("CategoriesList", require('./categories/list/CategoriesList.jsx'));

// permissions

Telescope.registerComponent("CanCreatePost", require('./permissions/CanCreatePost.jsx'));
Telescope.registerComponent("CanEditPost", require('./permissions/CanEditPost.jsx'));
Telescope.registerComponent("CanView", require('./permissions/CanView.jsx'));
Telescope.registerComponent("CanViewPost", require('./permissions/CanViewPost.jsx'));
Telescope.registerComponent("CanEditUser", require('./permissions/CanEditUser.jsx'));

// users

Telescope.registerComponent("UserEdit", require('./users/UserEdit.jsx'));
Telescope.registerComponent("UserProfile", require('./users/UserProfile.jsx'));
Telescope.registerComponent("UserAvatar", require('./users/UserAvatar.jsx'));
Telescope.registerComponent("UserName", require('./users/UserName.jsx'));
Telescope.registerComponent("UserMenu", require('./users/UserMenu.jsx'));
Telescope.registerComponent("AccountsMenu", require('./users/AccountsMenu.jsx'));
Telescope.registerComponent("AccountsForm", require('./users/AccountsForm.jsx'));

// debug

Telescope.registerComponent("Cheatsheet", require('./debug/Cheatsheet.jsx'));
Telescope.registerComponent("Settings", require('./debug/Settings.jsx'));

