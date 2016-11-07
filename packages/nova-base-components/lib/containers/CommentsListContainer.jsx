import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import Posts from "meteor/nova:posts";
import Comments from "meteor/nova:comments";

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class CommentsListContainer extends Component {
  
  render() {

    const {loading, comments, commentsViewTotal, refetchQuery, loadMore, componentProps} = this.props;
    const Component = this.props.component;
    const hasMore = comments && commentsViewTotal && comments.length < commentsViewTotal;

    return loading ? <Telescope.components.Loading/> : <Component 
      results={comments || []}
      hasMore={hasMore}
      ready={!loading}
      count={comments && comments.length}
      totalCount={commentsViewTotal}
      loadMore={loadMore}
      refetchQuery={refetchQuery}
      {...componentProps}
    />;
  }
};

CommentsListContainer.propTypes = {
  loading: React.PropTypes.bool,
  postsViewTotal: React.PropTypes.number,
  posts: React.PropTypes.array,
  refetch: React.PropTypes.func,
  loadMore: React.PropTypes.func,
  params: React.PropTypes.object
};

CommentsListContainer.displayName = "CommentsListContainer";

const CommentsListContainerWithData = graphql(gql`
  query getCommentsView ($postId: String) {
    comments (postId: $postId) {
      _id
      # note: currently not used in PostsCommentsThread
      # parentComment {
      #   htmlBody
      #   postedAt
      #   user {
      #     _id
      #     telescope {
      #       slug
      #       emailHash # used for the avatar
      #     }
      #   }
      # }
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
    const {data: {loading, comments, commentsViewTotal, refetch, fetchMore}} = props;
    return {
      loading,
      comments,
      commentsViewTotal,
      refetchQuery: refetch,
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
    };
  },
})(CommentsListContainer);

module.exports = CommentsListContainerWithData;