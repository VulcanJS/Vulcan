import React from 'react';

const PostsThumbnail = ({post}) => {
  return (
    <a className="posts-thumbnail" href={Posts.getLink(post)} target={Posts.getLinkTarget(post)}>
      <span><img src={Posts.getThumbnailUrl(post)} /></span>
    </a>
  )
}

PostsThumbnail.displayName = "PostsThumbnail";

module.exports = PostsThumbnail;
export default PostsThumbnail;