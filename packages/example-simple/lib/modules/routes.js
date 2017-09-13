import { addRoute, Components } from 'meteor/vulcan:core';

import '../components/movies/MoviesList.jsx';

addRoute({ name: 'movies', path: '/', componentName: 'MoviesList' });
