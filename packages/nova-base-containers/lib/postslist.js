import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import Posts from "meteor/nova:posts";

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

export default function withPostsList(params){
  return graphql(gql`
    query getPostsView($terms: Terms, $offset: Int, $limit: Int) {
      postsViewTotal(terms: $terms)
      posts(terms: $terms, offset: $offset, limit: $limit) {
        ${Posts.graphQLQueries.list}
      }
    }
  `, {
    options(ownProps) {
      
      // two ways of passing terms: via the wrapping call, or via
      // the component calling the wrapped component
      const finalProps = {...params, ...ownProps};

      // console.log(params)
      // console.log(ownProps)
      // console.log(finalProps)

      return {
        variables: { 
          terms: finalProps.terms,
          offset: 0,
          limit: 10
        },
        // pollInterval: 20000,
      };
    },
    props(props) {

      const {data: {loading, posts, postsViewTotal, fetchMore}} = props;

      return {
        loading,
        results: posts,
        totalCount: postsViewTotal,
        count: posts && posts.length,
        loadMore() {
          // basically, rerun the query 'getPostsView' with a new offset
          return fetchMore({
            variables: { offset: posts.length },
            updateQuery(previousResults, { fetchMoreResult }) {
              // no more post to fetch
              if (!fetchMoreResult.data) {
                return previousResults;
              }
              // return the previous results "augmented" with more
              return {...previousResults, posts: [...previousResults.posts, ...fetchMoreResult.data.posts]};
            },
          });
        },
        ...props.ownProps // pass on the props down to the wrapped component
      };
    },
  })
}