// import Telescope from 'meteor/nova:lib';
// import React, { PropTypes, Component } from 'react';
// import Movies from '../collection.js';
// import { graphql } from 'react-apollo';
// import gql from 'graphql-tag';
// import { moviesListProps, moviesSingleProps } from './fragments.js';

// export default function withMoviesList (component, options) {
//   return graphql(gql`
//     query getMoviesList($offset: Int, $limit: Int) {
//       moviesTotal
//       moviesList(offset: $offset, limit: $limit) {
//         ...moviesListProps
//       }
//     }
//   `, {
//     options(ownProps) {
//       return {
//         variables: { 
//           offset: 0,
//           limit: 5
//         },
//         fragments: moviesListProps,
//         pollInterval: 20000,
//       };
//     },
//     props(props) {

//       const {data: {loading, moviesList, moviesTotal, fetchMore}} = props;

//       return {
//         loading,
//         results: moviesList,
//         totalCount: moviesTotal,
//         count: moviesList && moviesList.length,
//         loadMore() {
//           // basically, rerun the query 'getPostsList' with a new offset
//           return fetchMore({
//             variables: { offset: moviesList.length },
//             updateQuery(previousResults, { fetchMoreResult }) {
//               // no more post to fetch
//               if (!fetchMoreResult.data) {
//                 return previousResults;
//               }
//               // return the previous results "augmented" with more
//               return {...previousResults, moviesList: [...previousResults.moviesList, ...fetchMoreResult.data.moviesList]};
//             },
//           });
//         },
//         ...props.ownProps // pass on the props down to the wrapped component
//       };
//     },
//   })(component);
// }