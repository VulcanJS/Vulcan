import { addRoute } from 'meteor/nova:core';

import MoviesList from '../components/movies/MoviesList.jsx';

addRoute({ name: 'movies', path: 'movies', component: MoviesList });
