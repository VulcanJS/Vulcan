import Movies from './collection.js';
import { Votes } from 'meteor/vulcan:voting';
import gql from 'graphql-tag';

/*

Ideally this would use the same APIs on client and server, but for now:

1. Client: get data from Apollo store using readQuery
2. Server: get data from database using collection.find()

Note: on the client, this depends on user.votes to figure out which movies have
been reacted to by the current user. This is *not* returned by the `vote` mutation
and not asked for by `withVote`, so user.votes will not be updated until the next
polling, meaning cancelling a movie's vote won't immediately remove it from 
the list. 

*/
Movies.addView('userReactedMovies', (terms, apolloClient) => {

  let userVotes; 

  // not used for now
  // const fragmentText = `
  //   fragment UserVotes on User {
  //     _id
  //     votes{
  //       _id
  //       voteType
  //       power
  //       documentId
  //     }
  //   }
  // `

  /*

  Note: make sure query variables match exactly
  with query used with withDocument.

  */
  const queryText = `
    query UsersSingle($documentId: documentId){
      UsersSingle(documentId: $documentId) {
        _id
        votes(collectionName: "Movies"){
          _id
          voteType
          collectionName
          power
          documentId
        }
      }
    }
  `

  if (Meteor.isClient) {

    // on the client, get all votes from Apollo store

    // with readFragment (not used for now)
    // const user = apolloClient.readFragment({
    //   id: terms.userId, // `id` is any id that could be returned by `dataIdFromObject`.
    //   fragment: gql`${fragmentText}`,
    // });

    // with readQuery
    // Note: will only work if a matching query has already been executed by Apollo client
    const user = apolloClient.readQuery({
      query: gql`${queryText}`,
      variables: {documentId: terms.userId}
    }).UsersSingle;

    userVotes = user.votes;

  } else {

    // on the server, get votes from db

    // TODO: figure out how to make this async without messing up withList on the client
    // and get votes through GraphQL API using queryOne

    // const { userId } = terms;
    // const user = await context.Users.queryOne(userId, { fragmentText });
    // userVotes = user.votes;

    userVotes = Votes.find({ userId: terms.userId }).fetch();

  }

  const moviesIds = _.unique(_.pluck(userVotes, 'documentId'));

  const parameters = {
    selector: {_id: {$in: moviesIds}, userId: {$ne: terms.userId}}, // exclude own posts
    options: {limit: 5, sort: {postedAt: -1}}
  };

  return parameters;
});