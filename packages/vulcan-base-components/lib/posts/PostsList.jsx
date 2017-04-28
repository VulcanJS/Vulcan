import { Components, registerComponent, withList, withCurrentUser, Utils } from 'meteor/vulcan:core';
import React from 'react';
import Posts from 'meteor/vulcan:posts';
import { Alert } from 'react-bootstrap';
import { FormattedMessage, intlShape } from 'react-intl';

const Error = ({error}) => <Alert className="flash-message" bsStyle="danger"><FormattedMessage id={error.id} values={{value: error.value}}/>{error.message}</Alert>

const PostsList = (props) => {

  const {results, loading, count, totalCount, loadMore, showHeader = true, showLoadMore = true, networkStatus, currentUser, error, terms} = props;

  const loadingMore = networkStatus === 2;

  if (results && results.length) {

    const hasMore = totalCount > results.length;

    return (
      <div className="posts-list">
        {showHeader ? <Components.PostsListHeader/> : null}
        {error ? <Error error={Utils.decodeIntlError(error)} /> : null }
        <div className="posts-list-content">
          {results.map(post => <Components.PostsItem post={post} key={post._id} currentUser={currentUser} terms={terms} />)}
        </div>
        {showLoadMore ? hasMore ? (loadingMore ? <Components.PostsLoading/> : <Components.PostsLoadMore loadMore={loadMore} count={count} totalCount={totalCount} />) : <Components.PostsNoMore/> : null}
      </div>
    )
  } else if (loading) {
    return (
      <div className="posts-list">
        {showHeader ? <Components.PostsListHeader /> : null}
        {error ? <Error error={Utils.decodeIntlError(error)} /> : null }
        <div className="posts-list-content">
          <Components.PostsLoading/>
        </div>
      </div>
    )
  } else {
    return (
      <div className="posts-list">
        {showHeader ? <Components.PostsListHeader /> : null}
        {error ? <Error error={Utils.decodeIntlError(error)} /> : null }
        <div className="posts-list-content">
          <Components.PostsNoResults/>
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

PostsList.contextTypes = {
  intl: intlShape
};

const options = {
  collection: Posts,
  queryName: 'postsListQuery',
  fragmentName: 'PostsList',
};

registerComponent('PostsList', PostsList, withCurrentUser, [withList, options]);
