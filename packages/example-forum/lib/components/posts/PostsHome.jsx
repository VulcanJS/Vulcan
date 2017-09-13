import { Components, registerComponent } from 'meteor/vulcan:core';
import React, { PropTypes, Component } from 'react';

const PostsHome = (props, context) => {
  const terms = _.isEmpty(props.location && props.location.query) ? {view: 'top'}: props.location.query;
  return <Components.PostsList terms={terms}/>
};

PostsHome.displayName = "PostsHome";

registerComponent('PostsHome', PostsHome);
