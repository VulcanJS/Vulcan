import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import Posts from "meteor/nova:posts";
import Comments from "meteor/nova:comments";

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class CommentsListContainer extends Component {
  
  render() {

    const {loading, results, componentProps} = this.props;
    const Component = this.props.component;
    //const hasMore = comments && commentsViewTotal && comments.length < commentsViewTotal;

    return loading ? <Telescope.components.Loading/> : <Component 
        results={results || []}
        //count={comments && comments.length}
        {...componentProps}
      />;
  }
};

CommentsListContainer.propTypes = {
  loading: React.PropTypes.bool,
};

CommentsListContainer.displayName = "CommentsListContainer";

const CommentsListContainerWithData = graphql(gql`
  query getCommentsView ($postId: String) {
    comments (postId: $postId) {
      _id
      postId
      parentCommentId
      topLevelCommentId
      body
      htmlBody
      postedAt
      user {
        _id
        telescope {
          slug
          emailHash # used for the avatar
        }
      }
    }
  }
`, {
  options(ownProps) {
    return {
      variables: { 
        postId: ownProps.postId
      },
      // pollInterval: 20000,
    };
  },
  props(props) {
    const {data: {loading, comments}} = props;
    return {
      loading,
      results: comments,
      // loadMore() {
      //   // basically, rerun the query 'getPostsView' with a new offset
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
})(CommentsListContainer);

module.exports = CommentsListContainerWithData;