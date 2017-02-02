import { registerComponent } from 'meteor/nova:core';
import React from 'react';
import Posts from "meteor/nova:posts";

const PostsThumbnail = ({post}) => {
  return (
    <a className="posts-thumbnail" href={Posts.getLink(post)} target={Posts.getLinkTarget(post)}>
      <span><img src={Posts.getThumbnailUrl(post)} /></span>
    </a>
  )
}

PostsThumbnail.displayName = "PostsThumbnail";

registerComponent('PostsThumbnail', PostsThumbnail);