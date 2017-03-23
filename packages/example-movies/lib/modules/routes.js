import { addRoute } from 'meteor/vulcan:core';

import MoviesList from '../components/movies/MoviesList.jsx';

addRoute({ name: 'movies', path: '/', component: MoviesList });
