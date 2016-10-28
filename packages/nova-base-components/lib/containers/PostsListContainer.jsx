import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { ListContainer } from "meteor/utilities:react-list-container";
import Posts from "meteor/nova:posts";

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const PostsListContainer = (props, context) => {

  const {loading, posts, postsViewTotal, refetchQuery, loadMore, componentProps} = props;
  const Component = props.component;
  const hasMore = posts && postsViewTotal && posts.length < postsViewTotal;

  return loading ? <Telescope.components.Loading/> : <Component 
    results={posts || []}
    hasMore={hasMore}
    ready={!loading}
    count={posts && posts.length}
    totalCount={postsViewTotal}
    loadMore={loadMore}
    refetchQuery={refetchQuery}
    {...componentProps}
  />;
};

PostsListContainer.propTypes = {
  loading: React.PropTypes.bool,
  postsViewTotal: React.PropTypes.number,
  posts: React.PropTypes.array,
  refetch: React.PropTypes.func,
  loadMore: React.PropTypes.func,
  params: React.PropTypes.object
};

PostsListContainer.displayName = "PostsListContainer";

const PostsListContainerWithData = graphql(gql`
  query getPostsView($terms: Terms, $offset: Int, $limit: Int) {
    postsViewTotal(terms: $terms)
    posts(terms: $terms, offset: $offset, limit: $limit) {
      _id
      title
      url
      slug
      htmlBody
      thumbnailUrl
      baseScore
      postedAt
      sticky
      categories {
        _id
        name
        slug
      }
      commentCount
      upvoters {
        _id
      }
      downvoters {
        _id
      }
      upvotes # should be asked only for admins?
      score # should be asked only for admins?
      viewCount # should be asked only for admins?
      clickCount # should be asked only for admins?
      user {
        _id
        telescope {
          displayName
          slug
          emailHash
        }
      }
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
      pollInterval: 20000,
    };
  },
  props({data: {loading, posts, postsViewTotal, refetch, fetchMore}}) {
    return {
      loading,
      posts,
      postsViewTotal,
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
})(PostsListContainer);

module.exports = PostsListContainerWithData;