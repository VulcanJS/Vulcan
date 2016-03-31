import React, { PropTypes, Component } from 'react';
import { Button } from 'react-bootstrap';
import Core from "meteor/nova:core";
const ModalTrigger = Core.ModalTrigger;

const NewPostButton = (props, context) => {

  ({PostNewForm} = Telescope.components);

  return (
    <ModalTrigger component={<Button bsStyle="primary">New Post</Button>}>
      <PostNewForm/>
    </ModalTrigger>
  )
}

module.exports = NewPostButton;
export default NewPostButton;