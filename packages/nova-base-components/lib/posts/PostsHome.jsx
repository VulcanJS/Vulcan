import { Components, registerComponent } from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';

const PostsHome = (props, context) => {
  const terms = props.location && props.location.query;
  return <Components.PostsList terms={terms}/>
};

PostsHome.displayName = "PostsHome";

registerComponent('PostsHome', PostsHome);
