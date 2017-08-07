import React, { Component } from 'react';
import { Components, registerComponent, withList, withCurrentUser, Loading } from 'meteor/vulcan:core';
import Comments from 'meteor/vulcan:comments';

const RecentComments = (props) => {
    const results = props.results;
    const currentUser = props.currentUser;
    const loading = props.loading;
    const fontSize = props.fontSize;
    const loadMore = props.loadMore;
    const loadingMore = props.networkStatus == 2;

    return (
      <div>
        <div className="comments-list recent-comments-list">
          {loading || !results ? <Loading /> :
            <div className={"comments-items" + (fontSize == "small" ? " smalltext" : "")}>
              {results.map(comment =>
                  <div key={comment._id}>
                    <Components.RecentCommentsItem comment={comment} currentUser={currentUser} />
                  </div>
                )}
                <Components.CommentsLoadMore loading={loadingMore} loadMore={loadMore}  />
            </div>}
        </div>
      </div>)
  }

const commentsOptions = {
  collection: Comments,
  queryName: 'selectCommentsListQuery',
  fragmentName: 'SelectCommentsList',
  totalResolver: false,
};

registerComponent('RecentComments', RecentComments, [withList, commentsOptions], withCurrentUser);
