import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { ListContainer } from "meteor/utilities:react-list-container";
import Posts from "meteor/nova:posts";

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const PostsHome = (props, context) => {

  const {loading, posts, postsViewTotal, refetchQuery, loadMore} = props;
  const hasMore = posts && postsViewTotal && posts.length < postsViewTotal;

  return <Telescope.components.PostsList 
            results={posts || []}
            hasMore={hasMore}
            ready={!loading}
            count={posts && posts.length}
            totalCount={postsViewTotal}
            loadMore={loadMore}
            refetchQuery={refetchQuery}
          />;
};


PostsHome.propTypes = {
  loading: React.PropTypes.bool,
  postsViewTotal: React.PropTypes.number,
  posts: React.PropTypes.array,
  refetch: React.PropTypes.func,
  loadMore: React.PropTypes.func,
  params: React.PropTypes.object
};

PostsHome.contextTypes = {
  currentUser: React.PropTypes.object
};

const PostsHomeWithData = graphql(gql`
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
    const { view = 'top', cat } = ownProps.location && ownProps.location.query;

    return {
      variables: { 
        terms: { view, cat },
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
})(PostsHome);

PostsHome.displayName = "PostsHome";

module.exports = PostsHomeWithData;