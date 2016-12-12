import MoviesWrapper from './components/MoviesWrapper.jsx';
import { addRoute } from 'meteor/nova:core';

// add new "/movies" route that loads the MoviesWrapper component
addRoute({ name: 'movies', path: 'movies', component: MoviesWrapper });
