import Telescope from 'meteor/nova:lib';
import React from 'react';
import Posts from "meteor/nova:posts";

const PostsPage = ({post, refetchQuery}) => {
  
  const htmlBody = {__html: post.htmlBody};

  return (
    <div className="posts-page">

      <Telescope.components.HeadTags url={Posts.getLink(post)} title={post.title} image={post.thumbnailUrl} />
      
      <Telescope.components.PostsItem post={post} refetchQuery={refetchQuery} />

      {post.htmlBody ? <div className="posts-page-body" dangerouslySetInnerHTML={htmlBody}></div> : null}

      {/*<SocialShare url={ Posts.getLink(post) } title={ post.title }/>*/}

      <Telescope.components.PostsCommentsThread document={post} refetchQuery={refetchQuery} />

    </div>
  )
};

PostsPage.displayName = "PostsPage";

module.exports = PostsPage;
export default PostsPage;