import { addRoute } from 'meteor/vulcan:core';

addRoute({ name: 'inbox', path: '/inbox', componentName: 'InboxWrapper' });
addRoute({ name: 'inbox', path: '/newPost', componentName: 'PostsNewForm' });
