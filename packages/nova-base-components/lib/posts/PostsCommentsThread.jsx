import React from 'react';
import { FormattedMessage } from 'react-intl';
import { ModalTrigger, withList, withCurrentUser, Components, registerComponent, Utils } from 'meteor/nova:core';
import Comments from 'meteor/nova:comments';
import gql from 'graphql-tag';

const PostsCommentsThread = (props, context) => {

  const {loading, terms: { postId }, results, totalCount} = props;
  
  if (loading) {
  
    return <div className="posts-comments-thread"><Components.Loading/></div>
  
  } else {
    
    const resultsClone = _.map(results, _.clone); // we don't want to modify the objects we got from props
    const nestedComments = Utils.unflatten(resultsClone, '_id', 'parentCommentId');

    return (
      <div className="posts-comments-thread">
        <h4 className="posts-comments-thread-title"><FormattedMessage id="comments.comments"/></h4>
        <Components.CommentsList comments={nestedComments} commentCount={totalCount}/>
        {!!props.currentUser ?
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
      displayName
      emailHash
      slug
    }
    post {
      _id
      commentCount
      commenters {
        _id
        displayName
        emailHash
        slug
      }
    }
    userId
    upvoters {
      _id
    }
    downvoters {
      _id
    }
    upvotes # should be asked only for admins?
    downvotes # should be asked only for admins?
    baseScore # should be asked only for admins?
    score # should be asked only for admins?
  }
`;

const options = {
  collection: Comments,
  queryName: 'commentsListQuery',
  fragment: PostsCommentsThread.fragment,
  limit: 0,
};

registerComponent('PostsCommentsThread', PostsCommentsThread, withList(options), withCurrentUser);
