/*

Custom `reactedMovies` GraphQL virtual field on Users collection.
Used for MyReactions2 example. 

*/
import Users from 'meteor/vulcan:users';
import { Votes } from 'meteor/vulcan:voting';
import Movies from './movies/index.js';

Users.addField([
  /**
    An array containing votes
  */
  {
    fieldName: 'reactedMovies',
    fieldSchema: {
      type: Array,
      optional: true,
      viewableBy: Users.owns,
      resolveAs: {
        type: '[Movie]',
        resolver: async (user, args, { currentUser }) => {
          const votes = Votes.find({userId: currentUser._id, collectionName: 'Movies'}).fetch();
          const votedMoviesIds = _.unique(_.pluck(votes, 'documentId'));
          const movies = Movies.find(
            {
              _id: {$in: votedMoviesIds}, 
              userId: {$ne: currentUser._id}
            }, 
            {
              limit: 5, 
              sort: {postedAt: -1}
            }
          ).fetch();
          return movies;
        }
      },
    }
  },
  {
    fieldName: 'reactedMovies.$',
    fieldSchema: {
      type: Object,
      optional: true
    }
  },
]);

``
