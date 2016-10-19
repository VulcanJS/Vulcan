import Telescope from 'meteor/nova:lib';
import React from 'react';
import {injectIntl, FormattedMessage} from 'react-intl';

const CommentsList = ({comments, commentCount}) => {

  if (!!comments) {
    return (
      <div className="comments-list">
        {comments.map(comment => <Telescope.components.CommentsNode comment={comment} key={comment._id} />)}
        {/*hasMore ? (ready ? <Telescope.components.CommentsLoadMore loadMore={loadMore} count={count} totalCount={totalCount} /> : <Telescope.components.Loading/>) : null*/}
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

module.exports = CommentsList;