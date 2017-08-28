import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withList, Components, replaceComponent} from 'meteor/vulcan:core';
import LWEvents from '../../lib/collections/lwevents/collection.js';

const PostsCommentsThread = ({loading, terms: {postId}, results, comments}) => {
    if (loading || !results) {
      console.log("Loading & Results PostsCommentsThread: ", loading, results);
      return <div className="posts-comments-thread"><Components.CommentsListSection comments={comments} postId={postId}/></div>
    } else {
      const lastEvent = results && results[0]
      return <div className="posts-comments-thread"><Components.CommentsListSection comments={comments} lastEvent={lastEvent} postId={postId}/></div>
    }
}

PostsCommentsThread.displayName = 'PostsCommentsThread';

PostsCommentsThread.propTypes = {
  currentUser: PropTypes.object
};

const options = {
  collection: LWEvents,
  queryName: 'lastPostVisitQuery',
  fragmentName: 'lastEventFragment',
  limit: 1,
  totalResolver: false,
};

replaceComponent('PostsCommentsThread', PostsCommentsThread, [withList, options]);
