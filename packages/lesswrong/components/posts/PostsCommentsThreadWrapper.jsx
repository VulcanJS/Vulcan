import React from 'react';
import PropTypes from 'prop-types';
import { withList, Components, registerComponent, Utils} from 'meteor/vulcan:core';
import Comments from 'meteor/vulcan:comments';

const PostsCommentsThreadWrapper = (props, /* context*/) => {

  const {loading, results, terms: {postId}, userId} = props;

  if (loading || !results) {
    return <div className="posts-comments-thread"><Components.Loading/></div>
  } else {
    const resultsClone = _.map(results, _.clone); // we don't want to modify the objects we got from props
    const nestedComments = Utils.unflatten(resultsClone, {idProperty: '_id', parentIdProperty: 'parentCommentId'});
    return (
      <div className="posts-comments-thread-wrapper">
        <Components.PostsCommentsThread terms={{postId: postId, userId: userId, view: "postVisits", limit: 1}} comments={nestedComments} />
      </div>
    );
  }
};

const options = {
  collection: Comments,
  queryName: 'commentsListQuery',
  fragmentName: 'CommentsList',
  limit: 0,
};

registerComponent('PostsCommentsThreadWrapper', PostsCommentsThreadWrapper, [withList, options]);
