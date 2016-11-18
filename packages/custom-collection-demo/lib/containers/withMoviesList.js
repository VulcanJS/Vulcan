import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import Movies from '../collection.js';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { fullMovieInfo } from './fragments.js';

export default function withMoviesList (component, options) {
  return graphql(gql`
    query getMoviesList($offset: Int, $limit: Int) {
      movies(offset: $offset, limit: $limit) {
        ...fullMovieInfo
      }
    }
  `, {
    options(ownProps) {
      return {
        variables: { 
          offset: 0,
          limit: 10
        },
        fragments: fullMovieInfo,
        pollInterval: 20000,
      };
    },
    props(props) {

      const {data: {loading, movies, moviesListTotal, fetchMore}} = props;

      return {
        loading,
        results: movies,
        totalCount: moviesListTotal,
        count: movies && movies.length,
        loadMore() {
          // basically, rerun the query 'getPostsList' with a new offset
          return fetchMore({
            variables: { offset: movies.length },
            updateQuery(previousResults, { fetchMoreResult }) {
              // no more post to fetch
              if (!fetchMoreResult.data) {
                return previousResults;
              }
              // return the previous results "augmented" with more
              return {...previousResults, movies: [...previousResults.movies, ...fetchMoreResult.data.movies]};
            },
          });
        },
        ...props.ownProps // pass on the props down to the wrapped component
      };
    },
  })(component);
}