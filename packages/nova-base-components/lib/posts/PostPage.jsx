import React from 'react';
import { Accounts } from 'meteor/std:accounts-ui';
import SmartContainers from "meteor/utilities:react-list-container";
const ListContainer = SmartContainers.ListContainer;

import Core from "meteor/nova:core";
const ModalTrigger = Core.ModalTrigger;

const PostPage = ({document, currentUser}) => {
  
  ({CommentList, CommentNew, PostItem, PostCategories, SocialShare, Vote, PostStats, HeadTags, AccountsForm} = Telescope.components);

  const post = document;
  const htmlBody = {__html: post.htmlBody};

  return (
    <div className="post-page">

      {/*<HeadTags url={Posts.getLink(post)} title={post.title}/>*/}
      
      <PostItem post={post}/>

      <div className="post-body" dangerouslySetInnerHTML={htmlBody}></div>

      {/*<SocialShare url={ Posts.getLink(post) } title={ post.title }/>*/}

      <div className="comments-thread">
        <h4 className="comments-thread-title">Comments</h4>
        <ListContainer 
          collection={Comments} 
          publication="comments.list" 
          selector={{postId: post._id}} 
          terms={{postId: post._id, view: "postComments"}} 
          limit={0}
          parentProperty="parentCommentId"
          joins={Comments.getJoins()}
          component={CommentList}
        />

        { currentUser ?
          <div className="post-new-comment">
            <h4>New Comment:</h4>
            <CommentNew type="comment" postId={post._id} />
          </div> :
          <div>
            <ModalTrigger size="small" component={<a>Please log in to comment</a>}>
              <AccountsForm/>
            </ModalTrigger>
          </div> }
      </div>

    </div>
  )
};

module.exports = PostPage;