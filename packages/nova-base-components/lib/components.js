// common

Telescope.registerComponent("App",                  require('./common/App.jsx'));
Telescope.registerComponent("Footer",               require('./common/Footer.jsx'));
Telescope.registerComponent("Header",               require('./common/Header.jsx'));
Telescope.registerComponent("Layout",               require('./common/Layout.jsx'));
Telescope.registerComponent("Logo",                 require('./common/Logo.jsx'));
Telescope.registerComponent("Flash",                require('./common/Flash.jsx'));
Telescope.registerComponent('HeadTags',             require('./common/HeadTags.jsx'));
Telescope.registerComponent("FlashMessages",        require('./common/FlashMessages.jsx'));
Telescope.registerComponent("NewsletterForm",       require('./common/NewsletterForm.jsx'));
Telescope.registerComponent("Icon",                 require('./common/Icon.jsx'));
Telescope.registerComponent("SearchForm",           require('./common/SearchForm.jsx'));
Telescope.registerComponent("NewPostButton",        require('./common/NewPostButton.jsx'));
Telescope.registerComponent("AppLoading",           require('./common/AppLoading.jsx'));
Telescope.registerComponent("Error404",             require('./common/Error404.jsx'));
Telescope.registerComponent("Loading",              require('./common/Loading.jsx'));
Telescope.registerComponent("Vote",                 require('./common/Vote.jsx'));

// posts

Telescope.registerComponent("PostsLoadMore",        require('./posts/PostsLoadMore.jsx'));
Telescope.registerComponent("PostsNoMore",          require('./posts/PostsNoMore.jsx'));
Telescope.registerComponent("PostsNoResults",       require('./posts/PostsNoResults.jsx'));
Telescope.registerComponent("PostsItem",            require('./posts/PostsItem.jsx'));
Telescope.registerComponent("PostsLoading",         require('./posts/PostsLoading.jsx'));
Telescope.registerComponent("PostsViews",           require('./posts/PostsViews.jsx'));
Telescope.registerComponent("PostsList",            require('./posts/PostsList.jsx'));
Telescope.registerComponent("PostsListHeader",      require('./posts/PostsListHeader.jsx'));
Telescope.registerComponent("PostsCategories",      require('./posts/PostsCategories.jsx'));
Telescope.registerComponent("PostsCommenters",      require('./posts/PostsCommenters.jsx'));
Telescope.registerComponent("PostsPage",            require('./posts/PostsPage.jsx'));
Telescope.registerComponent("PostsStats",           require('./posts/PostsStats.jsx'));
Telescope.registerComponent("PostsDaily",           require('./posts/PostsDaily.jsx'));
Telescope.registerComponent("PostsDay",             require('./posts/PostsDay.jsx'));
Telescope.registerComponent("PostsThumbnail",       require('./posts/PostsThumbnail.jsx'));
Telescope.registerComponent("PostsEditForm",        require('./posts/PostsEditForm.jsx'));
Telescope.registerComponent("PostsNewForm",         require('./posts/PostsNewForm.jsx'));

// comments

Telescope.registerComponent("CommentsItem",         require('./comments/CommentsItem.jsx'));
Telescope.registerComponent("CommentsList",         require('./comments/CommentsList.jsx'));
Telescope.registerComponent("CommentsNode",         require('./comments/CommentsNode.jsx'));
Telescope.registerComponent("CommentsNew",          require('./comments/CommentsNew.jsx'));
Telescope.registerComponent("CommentsEdit",         require('./comments/CommentsEdit.jsx'));

// categories

Telescope.registerComponent("CategoriesList",       require('./categories/CategoriesList.jsx'));

// permissions

Telescope.registerComponent("CanCreatePost",        require('./permissions/CanCreatePost.jsx'));
Telescope.registerComponent("CanEditPost",          require('./permissions/CanEditPost.jsx'));
Telescope.registerComponent("CanView",              require('./permissions/CanView.jsx'));
Telescope.registerComponent("CanViewPost",          require('./permissions/CanViewPost.jsx'));
Telescope.registerComponent("CanEditUser",          require('./permissions/CanEditUser.jsx'));

// users

Telescope.registerComponent("UserEdit",             require('./users/UserEdit.jsx'));
Telescope.registerComponent("UserProfile",          require('./users/UserProfile.jsx'));
Telescope.registerComponent("UserAvatar",           require('./users/UserAvatar.jsx'));
Telescope.registerComponent("UserName",             require('./users/UserName.jsx'));
Telescope.registerComponent("UserMenu",             require('./users/UserMenu.jsx'));
Telescope.registerComponent("AccountsMenu",         require('./users/AccountsMenu.jsx'));
Telescope.registerComponent("AccountsForm",         require('./users/AccountsForm.jsx'));