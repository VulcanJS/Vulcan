import React, { PropTypes, Component } from 'react';
import { Button } from 'react-bootstrap';
import { ModalTrigger } from "meteor/nova:core";

const PostsNewButton = (props, context) => {

  ({PostsNewForm} = Telescope.components);

  return (
    <ModalTrigger title="New Post" component={<Button className="posts-new-button" bsStyle="primary">New Post</Button>}>
      <PostsNewForm/>
    </ModalTrigger>
  )
}

module.exports = PostsNewButton;
export default PostsNewButton;