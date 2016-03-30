import React from 'react';

const PostThumbnail = ({post}) => {
  return (
    <a className="post-thumbnail" href={Posts.getLink(post)} target={Posts.getLinkTarget(post)}>
      <img src={post.thumbnailUrl} />
    </a>
  )
}

module.exports = PostThumbnail;
export default PostThumbnail;