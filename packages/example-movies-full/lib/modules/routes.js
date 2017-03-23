import { addRoute, getComponent } from 'meteor/vulcan:core';

// add new "/movies" route that loads the MoviesWrapper component
addRoute({ name: 'movies', path: '/', componentName: 'MoviesWrapper' });
