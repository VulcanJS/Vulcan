import React from 'react';
import PropTypes from 'prop-types';
import { withList, Components, registerComponent} from 'meteor/vulcan:core';
import Comments from 'meteor/vulcan:comments';

const LWPostsCommentsThreadWrapper = (props, /* context*/) => {

  const {loading, results, terms: {postId}, userId} = props;

  if (loading || !results) {

    return <div className="posts-comments-thread"><Components.Loading/></div>

  } else {
    return (
      <div className="posts-comments-thread-wrapper">
        <Components.PostsCommentsThread terms={{postId: postId, userId: userId, view: "postVisits", limit: 1}} comments={results} />
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

registerComponent('PostsCommentsThreadWrapper', LWPostsCommentsThreadWrapper, [withList, options]);
