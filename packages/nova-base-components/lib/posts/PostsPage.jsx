import React from 'react';
import Posts from "meteor/nova:posts";

const PostsPage = ({document, currentUser}) => {
  
  const post = document;
  const htmlBody = {__html: post.htmlBody};

  return (
    <div className="posts-page">

      <Telescope.components.HeadTags url={Posts.getLink(post)} title={post.title} image={post.thumbnailUrl} />
      
      <Telescope.components.PostsItem post={post}/>

      <div className="posts-page-body" dangerouslySetInnerHTML={htmlBody}></div>

      {/*<SocialShare url={ Posts.getLink(post) } title={ post.title }/>*/}

      <Telescope.components.PostsCommentsThread document={post} currentUser={currentUser}/>

    </div>
  )
};

PostsPage.displayName = "PostsPage";

module.exports = PostsPage;
export default PostsPage;