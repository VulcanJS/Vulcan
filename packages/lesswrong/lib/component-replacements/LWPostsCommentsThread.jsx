import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'meteor/vulcan:i18n';
import { withList, withCurrentUser, Components, replaceComponent, Utils } from 'meteor/vulcan:core';
import { withRouter } from 'react-router';
import LWEvents from '../collections/lwevents/collection.js';

const LWPostsCommentsThread = (props, /* context*/) => {

  const {loading, terms: {postId}, results, comments, currentUser} = props;

  if (loading) {

    return <div className="posts-comments-thread"><Components.Loading/></div>

  } else {

    const resultsClone = _.map(comments, _.clone); // we don't want to modify the objects we got from props
    const nestedComments = Utils.unflatten(resultsClone, {idProperty: '_id', parentIdProperty: 'parentCommentId'});
    const lastEvent = results[0];

    return (
      <div className="posts-comments-thread">
        {currentUser ? <Components.LastVisitDisplay lastEvent={lastEvent} /> : null}

        <h4 className="posts-comments-thread-title"><FormattedMessage id="comments.comments"/></h4>

        <Components.CommentsList currentUser={currentUser} comments={nestedComments} lastVisitDate={lastEvent && lastEvent.properties.startTime}/>
        {!!currentUser ?
          <div className="posts-comments-thread-new">
            <h4><FormattedMessage id="comments.new"/></h4>
            <Components.CommentsNewForm
              postId={postId}
              type="comment"
            />
          </div> :
          <div>
            <Components.ModalTrigger size="small" component={<a href="#"><FormattedMessage id="comments.please_log_in"/></a>}>
              <Components.AccountsLoginForm/>
            </Components.ModalTrigger>
          </div>
        }
      </div>
    );
  }
};

LWPostsCommentsThread.displayName = 'PostsCommentsThread';

LWPostsCommentsThread.propTypes = {
  currentUser: PropTypes.object
};

const options = {
  collection: LWEvents,
  queryName: 'lastPostVisitQuery',
  fragmentName: 'lastEventFragment',
  limit: 1,
};

replaceComponent('PostsCommentsThread', LWPostsCommentsThread, [withList, options], withCurrentUser, withRouter);
