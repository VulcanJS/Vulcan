import Telescope from 'meteor/nova:lib';
import React from 'react';
import Posts from "meteor/nova:posts";

const PostsSingle = (props, context) => {
  return <Telescope.components.PostsPage documentId={props.params._id} />
};

PostsSingle.displayName = "PostsSingle";

Telescope.registerComponent('PostsSingle', PostsSingle);