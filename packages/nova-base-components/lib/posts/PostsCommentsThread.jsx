import Telescope from 'meteor/nova:lib';
import React from 'react';
import {FormattedMessage } from 'react-intl';
import { ModalTrigger } from "meteor/nova:core";
import Comments from "meteor/nova:comments";

const PostsCommentsThread = (props, context) => {

  const {postId, results, commentCount} = props;

  const nestedComments = Telescope.utils.unflatten(results, '_id', 'parentCommentId');

  return (
    <div className="posts-comments-thread">
      <h4 className="posts-comments-thread-title"><FormattedMessage id="comments.comments"/></h4>
      <Telescope.components.CommentsList comments={nestedComments} commentCount={commentCount}/>
      { context.currentUser ?
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

};

PostsCommentsThread.displayName = "PostsCommentsThread";

PostsCommentsThread.contextTypes = {
  currentUser: React.PropTypes.object
};

module.exports = PostsCommentsThread;
export default PostsCommentsThread;