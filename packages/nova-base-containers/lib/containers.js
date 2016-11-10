import Telescope from 'meteor/nova:lib';

// containers

Telescope.registerComponent("AppContainer",   require('./containers/AppContainer.jsx'));
Telescope.registerComponent("PostsListContainer",   require('./containers/PostsListContainer.jsx'));
Telescope.registerComponent("CategoriesListContainer",   require('./containers/CategoriesListContainer.jsx'));
Telescope.registerComponent("PostsSingleContainer",   require('./containers/PostsSingleContainer.jsx'));
Telescope.registerComponent("CommentsListContainer",   require('./containers/CommentsListContainer.jsx'));
Telescope.registerComponent("UsersSingleContainer",   require('./containers/UsersSingleContainer.jsx'));
Telescope.registerComponent("VoteContainer",   require('./containers/VoteContainer.jsx'));
