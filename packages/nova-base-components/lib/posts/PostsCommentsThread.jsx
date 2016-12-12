import React from 'react';
import {FormattedMessage } from 'react-intl';
import { ModalTrigger, withList } from 'meteor/nova:core';
import { withCurrentUser, Components, registerComponent, Utils } from 'meteor/nova:core';
import Comments from 'meteor/nova:comments';
import gql from 'graphql-tag';

const PostsCommentsThread = (props, context) => {

  const {loading, terms: { postId }, results} = props;

  if (loading) {
  
    return <div className="posts-comments-thread"><Components.Loading/></div>
  
  } else {

    const commentCount = results.length;

    const resultsClone = _.map(results, _.clone); // we don't want to modify the objects we got from props
    const nestedComments = Utils.unflatten(resultsClone, '_id', 'parentCommentId');

    return (
      <div className="posts-comments-thread">
        <h4 className="posts-comments-thread-title"><FormattedMessage id="comments.comments"/></h4>
        <Components.CommentsList comments={nestedComments} commentCount={commentCount}/>
        { props.currentUser ?
          <div className="posts-comments-thread-new">
            <h4><FormattedMessage id="comments.new"/></h4>
            <Components.CommentsNewForm
              postId={postId} 
              type="comment" 
            />
          </div> :
          <div>
            <ModalTrigger size="small" component={<a><FormattedMessage id="comments.please_log_in"/></a>}>
              <Components.UsersAccountForm/>
            </ModalTrigger>
          </div> 
        }
      </div>
    );
  }
};

PostsCommentsThread.displayName = "PostsCommentsThread";

PostsCommentsThread.propTypes = {
  currentUser: React.PropTypes.object
};

PostsCommentsThread.fragment = gql`
  fragment commentsListFragment on Comment {
    _id
    postId
    parentCommentId
    topLevelCommentId
    body
    htmlBody
    postedAt
    user {
      _id
      __displayName
      __emailHash
      __slug
    }
    userId
  }
`;

const options = {
  collection: Comments,
  queryName: 'commentsListQuery',
  fragment: PostsCommentsThread.fragment,
};

registerComponent('PostsCommentsThread', PostsCommentsThread, withCurrentUser, withList(options));
