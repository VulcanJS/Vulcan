import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import Posts from "meteor/nova:posts";
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

export default function withPostsList (component, options) {
  return graphql(gql`
    query getPostsList($terms: Terms, $offset: Int, $limit: Int) {
      postsListTotal(terms: $terms)
      posts(terms: $terms, offset: $offset, limit: $limit) {
        ${Posts.graphQLQueries.list}
      }
    }
  `, {
    options(ownProps) {
      return {
        variables: { 
          terms: ownProps.terms,
          offset: 0,
          limit: 10
        },
        // pollInterval: 20000,
      };
    },
    props(props) {

      const {data: {loading, posts, postsListTotal, fetchMore}} = props;

      return {
        loading,
        results: posts,
        totalCount: postsListTotal,
        count: posts && posts.length,
        loadMore() {
          // basically, rerun the query 'getPostsList' with a new offset
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
  })(component);
}