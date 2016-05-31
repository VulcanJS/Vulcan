import React, { PropTypes, Component } from 'react';
import { Button } from 'react-bootstrap';
import { ModalTrigger } from "meteor/nova:core";

const PostsNewButton = (props, context) => {

  const size = context.currentUser ? "small" : "large";

  return (
    <ModalTrigger size={size} title="New Post" component={<Button className="posts-new-button" bsStyle="primary">New Post</Button>}>
      <Telescope.components.PostsNewForm/>
    </ModalTrigger>
  )
}

PostsNewButton.displayName = "PostsNewButton";

module.exports = PostsNewButton;
export default PostsNewButton;