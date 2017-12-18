import { addRoute } from 'meteor/vulcan:core';

addRoute({ name: 'movie', path: '/', componentName: 'MoviesList' });
addRoute({ name: 'movie.single', path: 'movie/:slug', componentName: 'MoviesGet' });
addRoute({ name: 'movie.adhoc', path: 'movie', componentName: 'MoviesAdhoc' });
