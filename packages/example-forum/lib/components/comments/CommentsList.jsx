import { Components, registerComponent } from 'meteor/vulcan:core';
import React from 'react';
import { FormattedMessage } from 'meteor/vulcan:i18n';

const CommentsList = ({comments, commentCount, currentUser}) => {

  if (commentCount > 0) {
    return (
      <div className="comments-list">
        {comments.map(comment => <Components.CommentsNode currentUser={currentUser} comment={comment} key={comment._id} />)}
        {/*hasMore ? (ready ? <Components.CommentsLoadMore loadMore={loadMore} count={count} totalCount={totalCount} /> : <Components.Loading/>) : null*/}
      </div>
    )
  } else {
    return (
      <div className="comments-list">
        <p>
          <FormattedMessage id="comments.no_comments"/>
        </p>
      </div>
    )
  }

};

CommentsList.displayName = "CommentsList";

registerComponent('CommentsList', CommentsList);
