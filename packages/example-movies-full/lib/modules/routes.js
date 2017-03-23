import { addRoute, getComponent } from 'meteor/nova:core';

// add new "/movies" route that loads the MoviesWrapper component
addRoute({ name: 'movies', path: 'movies', componentName: 'MoviesWrapper' });
