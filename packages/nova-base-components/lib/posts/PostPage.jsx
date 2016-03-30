import React from 'react';
import SmartContainers from "meteor/utilities:react-list-container";
const ListContainer = SmartContainers.ListContainer;

const PostPage = ({document, currentUser}) => {
  
  ({CommentList, CommentNew, PostItem, PostCategories, SocialShare, Vote, PostStats, HeadTags} = Telescope.components);

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
        ><CommentList/></ListContainer>

        <div className="post-new-comment">
          <h4>New Comment:</h4>
          <CommentNew type="comment" postId={post._id} />
        </div>
      </div>

    </div>
  )
}

module.exports = PostPage;