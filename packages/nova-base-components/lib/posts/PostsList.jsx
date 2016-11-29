import Telescope from 'meteor/nova:lib';
import React from 'react';
import { withList } from 'meteor/nova:core';
import Posts from 'meteor/nova:posts';

const PostsList = (props) => {

  const {results, terms, loading, count, totalCount, loadMore, showHeader = true} = props;

  if (results && results.length) {

    const hasMore = totalCount > results.length;

    return (
      <div className="posts-list">
        {showHeader ? <Telescope.components.PostsListHeader/> : null}
        <div className="posts-list-content">
          {results.map(post => <Telescope.components.PostsItem post={post} key={post._id} />)}
        </div>
        {hasMore ? (loading ? <Telescope.components.PostsLoading/> : <Telescope.components.PostsLoadMore loadMore={loadMore} count={count} totalCount={totalCount} />) : <Telescope.components.PostsNoMore/>}
      </div>
    )
  } else if (loading) {
    return (
      <div className="posts-list">
        {showHeader ? <Telescope.components.PostsListHeader /> : null}
        <div className="posts-list-content">
          <Telescope.components.PostsLoading/>
        </div>
      </div>
    )
  } else {
    return (
      <div className="posts-list">
        {showHeader ? <Telescope.components.PostsListHeader /> : null}
        <div className="posts-list-content">
          <Telescope.components.PostsNoResults/>
        </div>
      </div>
    )  
  }
  
};

PostsList.displayName = "PostsList";

PostsList.propTypes = {
  results: React.PropTypes.array,
  terms: React.PropTypes.object,
  hasMore: React.PropTypes.bool,
  loading: React.PropTypes.bool,
  count: React.PropTypes.number,
  totalCount: React.PropTypes.number,
  loadMore: React.PropTypes.func,
  showHeader: React.PropTypes.bool,
};

// const postsListOptions = {
//   queryName: 'getPostsList',
//   collection: Posts,
//   listResolverName: 'postsList',
//   totalResolverName: 'postsListTotal',
//   fragment: Posts.fragments.list,
//   fragmentName: 'fullPostInfo',
//   ownPropsVariables: [
//     // test note: can't overwrite atm
//     // {propName: 'limit', graphqlType: 'Int', defaultValue: 2, usedForTotal: false}, 
//     // note:give the list hoc the ability to catch props coming from upper in the component tree
//     {propName: 'terms', graphqlType: 'Terms', usedForTotal: true},
//   ],
// };


const options = {
  collection: Posts,
  queryName: 'postsListQuery',
  fragmentName: Telescope.getRawComponent('PostsItem').fragmentName,
  fragment: Telescope.getRawComponent('PostsItem').fragment,
};

Telescope.registerComponent('PostsList', PostsList, withList(options));
