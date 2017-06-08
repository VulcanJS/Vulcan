import { Components, registerComponent, withList, withCurrentUser, Utils } from 'meteor/vulcan:core';
import React from 'react';
import PropTypes from 'prop-types';
import Posts from 'meteor/vulcan:posts';
import Alert from 'react-bootstrap/lib/Alert'
import { FormattedMessage, intlShape } from 'meteor/vulcan:i18n';
import classNames from 'classnames';

const Error = ({error}) => <Alert className="flash-message" bsStyle="danger"><FormattedMessage id={error.id} values={{value: error.value}}/>{error.message}</Alert>

const PostsList = ({className, results, loading, count, totalCount, loadMore, showHeader = true, showLoadMore = true, networkStatus, currentUser, error, terms}) => {

  const loadingMore = networkStatus === 2;

  if (results && results.length) {

    const hasMore = totalCount > results.length;

    return (
      <div className={classNames(className, 'posts-list')}>
        {showHeader ? <Components.PostsListHeader/> : null}
        {error ? <Error error={Utils.decodeIntlError(error)} /> : null }
        <div className="posts-list-content">
          {results.map(post => <Components.PostsItem post={post} key={post._id} currentUser={currentUser} terms={terms} />)}
        </div>
        {showLoadMore ? 
          hasMore ? 
            <Components.PostsLoadMore loading={loadingMore} loadMore={loadMore} count={count} totalCount={totalCount} /> : 
            <Components.PostsNoMore/> : 
          null
        }
      </div>
    )
  } else if (loading) {
    return (
      <div className={classNames(className, 'posts-list')}>
        {showHeader ? <Components.PostsListHeader /> : null}
        {error ? <Error error={Utils.decodeIntlError(error)} /> : null }
        <div className="posts-list-content">
          <Components.PostsLoading/>
        </div>
      </div>
    )
  } else {
    return (
      <div className={classNames(className, 'posts-list')}>
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
  results: PropTypes.array,
  terms: PropTypes.object,
  hasMore: PropTypes.bool,
  loading: PropTypes.bool,
  count: PropTypes.number,
  totalCount: PropTypes.number,
  loadMore: PropTypes.func,
  showHeader: PropTypes.bool,
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
