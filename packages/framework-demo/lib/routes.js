import Telescope from 'meteor/nova:lib';
import MoviesWrapper from './components/MoviesWrapper.jsx';

// add new "/movies" route that loads the MoviesWrapper component
Telescope.routes.add({ name: 'movies', path: 'movies', component: MoviesWrapper });
