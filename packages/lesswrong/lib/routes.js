import { addRoute } from 'meteor/vulcan:core';

addRoute({ name: 'inbox', path: '/inbox', componentName: 'InboxWrapper' });
addRoute({ name: 'newPost', path: '/newPost', componentName: 'PostsNewForm' });
addRoute({ name: 'editPost', path: '/editPost', componentName: 'PostsEditForm' });

addRoute({ name: 'recentComments', path: '/recentComments', componentName: 'RecentCommentsPage' });


//Route for testing the editor. Useful for debugging
addRoute({ name: 'editorTest', path: '/editorTest', componentName: 'EditorTest' });
