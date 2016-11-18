const Movies = new Mongo.Collection("movies");

Movies.typeName = 'Movie';

export default Movies;