// modules/routes.js #tutorial-step-6 - 
// Thi is the file that is called into package.js that allows the component to be found. 

// First, we import this from vulcan core, which is a utility to add a new route.
import { addRoute, Components } from 'meteor/vulcan:core';

// Then, we add the component for what we want to add.
import '../components/movies/MoviesList.jsx';

// Next, we add the name 'movies', the path, which is the root, and the component name 'MovieList'. 
addRoute({ name: 'movies', path: '/', componentName: 'MoviesList' });
