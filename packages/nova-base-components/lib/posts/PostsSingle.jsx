import { Components, registerComponent } from 'meteor/nova:lib';
import React from 'react';
import Posts from "meteor/nova:posts";

const PostsSingle = (props, context) => {
  return <Components.PostsPage documentId={props.params._id} />
};

PostsSingle.displayName = "PostsSingle";

registerComponent('PostsSingle', PostsSingle);