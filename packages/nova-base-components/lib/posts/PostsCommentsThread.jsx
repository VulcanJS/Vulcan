import Telescope from 'meteor/nova:lib';
import React from 'react';
import {FormattedMessage } from 'react-intl';
import { ModalTrigger, withList } from 'meteor/nova:core';
import { withCurrentUser } from 'meteor/nova:core';
import Comments from 'meteor/nova:comments';
import gql from 'graphql-tag';

const PostsCommentsThread = (props, context) => {

  const {loading, terms: { postId }, results} = props;

  if (loading) {
  
    return <div className="posts-comments-thread"><Telescope.components.Loading/></div>
  
  } else {

    const commentCount = results.length;

    const resultsClone = _.map(results, _.clone); // we don't want to modify the objects we got from props
    const nestedComments = Telescope.utils.unflatten(resultsClone, '_id', 'parentCommentId');

    return (
      <div className="posts-comments-thread">
        <h4 className="posts-comments-thread-title"><FormattedMessage id="comments.comments"/></h4>
        <Telescope.components.CommentsList comments={nestedComments} commentCount={commentCount}/>
        { props.currentUser ?
          <div className="posts-comments-thread-new">
            <h4><FormattedMessage id="comments.new"/></h4>
            <Telescope.components.CommentsNewForm
              postId={postId} 
              type="comment" 
            />
          </div> :
          <div>
            <ModalTrigger size="small" component={<a><FormattedMessage id="comments.please_log_in"/></a>}>
              <Telescope.components.UsersAccountForm/>
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

PostsCommentsThread.fragmentName = 'commentsListFragment';
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
  }
`;

const options = {
  collection: Comments,
  queryName: 'commentsListQuery',
  fragmentName: PostsCommentsThread.fragmentName,
  fragment: PostsCommentsThread.fragment,
};

Telescope.registerComponent('PostsCommentsThread', PostsCommentsThread, withCurrentUser, withList(options));
