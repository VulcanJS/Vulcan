import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Comments from 'meteor/nova:comments';

export default function withCommentsList (component, options) {
  return graphql(gql`
    query getCommentsList ($postId: String) {
      commentsListTotal(postId: $postId)
      comments (postId: $postId) {
        ...fullCommentInfo
      }
    }
  `, {
    options(ownProps) {
      return {
        variables: { 
          postId: ownProps.postId
        },
        fragments: Comments.fragments.full,
        // pollInterval: 20000,
      };
    },
    props(props) {
      const {data: {loading, comments}} = props;
      return {
        loading,
        results: comments,
        // loadMore() {
        //   // basically, rerun the query 'getPostsList' with a new offset
        //   return fetchMore({
        //     variables: { offset: posts.length },
        //     updateQuery(previousResults, { fetchMoreResult }) {
        //       // no more post to fetch
        //       if (!fetchMoreResult.data) {
        //         return previousResults;
        //       }
        //       // return the previous results "augmented" with more
        //       return {...previousResults, posts: [...previousResults.posts, ...fetchMoreResult.data.posts]};
        //     },
        //   });
        // },
      };
    },
  })(component);
}