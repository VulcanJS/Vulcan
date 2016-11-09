import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import Posts from "meteor/nova:posts";

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class PostsListContainer extends Component {

  render() {
    const {loading, posts, postsViewTotal, loadMore, componentProps} = this.props;
    const Component = this.props.component;
    const hasMore = posts && postsViewTotal && posts.length < postsViewTotal;

    return loading ? <Telescope.components.Loading/> : <Component 
      results={posts || []}
      hasMore={hasMore}
      ready={!loading}
      count={posts && posts.length}
      totalCount={postsViewTotal}
      loadMore={loadMore}
      {...componentProps}
    />;
  }
};

PostsListContainer.propTypes = {
  loading: React.PropTypes.bool,
  postsViewTotal: React.PropTypes.number,
  posts: React.PropTypes.array,
  loadMore: React.PropTypes.func,
  params: React.PropTypes.object
};

PostsListContainer.displayName = "PostsListContainer";

const PostsListContainerWithData = graphql(gql`
  query getPostsView($terms: Terms, $offset: Int, $limit: Int) {
    postsViewTotal(terms: $terms)
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
  props({data: {loading, posts, postsViewTotal, fetchMore}}) {
    return {
      loading,
      posts,
      postsViewTotal,
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