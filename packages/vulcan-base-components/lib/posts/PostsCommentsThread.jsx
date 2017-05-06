import React from 'react';
import { FormattedMessage } from 'react-intl';
import { withList, withCurrentUser, Components, registerComponent, Utils } from 'meteor/vulcan:core';
import Comments from 'meteor/vulcan:comments';

const PostsCommentsThread = (props, context) => {

  const {loading, terms: { postId }, results, totalCount} = props;
  
  if (loading) {
  
    return <div className="posts-comments-thread"><Components.Loading/></div>
  
  } else {
    
    const resultsClone = _.map(results, _.clone); // we don't want to modify the objects we got from props
    const nestedComments = Utils.unflatten(resultsClone, {idProperty: '_id', parentIdProperty: 'parentCommentId'});

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
            <Components.ModalTrigger size="small" component={<a href="#"><FormattedMessage id="comments.please_log_in"/></a>}>
              <Components.AccountsLoginForm/>
            </Components.ModalTrigger>
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

const options = {
  collection: Comments,
  queryName: 'commentsListQuery',
  fragmentName: 'CommentsList',
  limit: 0,
};

registerComponent('PostsCommentsThread', PostsCommentsThread, [withList, options], withCurrentUser);
