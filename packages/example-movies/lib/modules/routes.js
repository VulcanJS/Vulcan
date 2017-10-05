import { addRoute } from 'meteor/vulcan:core';

addRoute({ name: 'movies', path: '/', componentName: 'MoviesList' });
