import React, { PropTypes, Component } from 'react';
import { Button } from 'react-bootstrap';
import Core from "meteor/nova:core";
const ModalTrigger = Core.ModalTrigger;

const NewPostButton = (props, context) => {

  ({PostsNewForm} = Telescope.components);

  return (
    <ModalTrigger title="New Post" component={<Button bsStyle="primary">New Post</Button>}>
      <PostsNewForm/>
    </ModalTrigger>
  )
}

module.exports = NewPostButton;
export default NewPostButton;