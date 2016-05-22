import React from 'react';
import SmartContainers from "meteor/utilities:react-list-container";
const ListContainer = SmartContainers.ListContainer;

import { ModalTrigger } from "meteor/nova:core";

const PostsCommentsThread = ({document, currentUser}) => {

  const post = document;

  return (
    <div className="posts-comments-thread">
      <h4 className="posts-comments-thread-title">Comments</h4>
      <ListContainer 
        collection={Comments} 
        publication="comments.list" 
        selector={{postId: post._id}} 
        terms={{postId: post._id, view: "postComments"}} 
        limit={0}
        parentProperty="parentCommentId"
        joins={Comments.getJoins()}
        component={Telescope.components.CommentsList}
      />
      { currentUser ?
        <div className="posts-comments-thread-new">
          <h4>New Comment:</h4>
          <Telescope.components.CommentsNew type="comment" postId={post._id} />
        </div> :
        <div>
          <ModalTrigger size="small" component={<a>Please log in to comment</a>}>
            <Telescope.components.UsersAccountForm/>
          </ModalTrigger>
        </div> }
    </div>
  )
};

PostsCommentsThread.displayName = "PostsCommentsThread";

module.exports = PostsCommentsThread;
export default PostsCommentsThread;