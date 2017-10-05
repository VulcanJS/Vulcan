import { addRoute, Components } from 'meteor/vulcan:core';

addRoute({ name: 'movies', path: '/', componentName: 'MoviesList' });

addRoute({ name: 'myReactions', path: '/my-reactions', componentName: 'MyReactions' });
