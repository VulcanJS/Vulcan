import React from 'react';

const PostsPage = ({document, currentUser}) => {
  
  ({PostsCommentsThread, PostsItem, PostsCategories, SocialShare, Vote, PostsStats, HeadTags} = Telescope.components);

  const post = document;
  const htmlBody = {__html: post.htmlBody};

  return (
    <div className="posts-page">

      <HeadTags url={Posts.getLink(post)} title={post.title} image={post.thumbnailUrl} />
      
      <PostsItem post={post}/>

      <div className="posts-page-body" dangerouslySetInnerHTML={htmlBody}></div>

      {/*<SocialShare url={ Posts.getLink(post) } title={ post.title }/>*/}

      <PostsCommentsThread document={post} currentUser={currentUser}/>

    </div>
  )
};

module.exports = PostsPage;
export default PostsPage;