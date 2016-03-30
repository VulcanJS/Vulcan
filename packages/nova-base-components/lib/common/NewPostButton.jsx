import React, { PropTypes, Component } from 'react';
import { Button } from 'react-bootstrap';

import Core from "meteor/nova:core";
const Messages = Core.Messages;
const ModalTrigger = Core.ModalTrigger;

import ReactForms from "meteor/utilities:react-form-containers";
const NewDocument = ReactForms.NewDocument;

const NewPostButton = (props, context) => {

  ({CanCreatePost} = Telescope.components);

  return (
    <ModalTrigger component={<Button bsStyle="primary">New Post</Button>}>
      <CanCreatePost user={context.currentUser}>
        <div className="new-post-form">
          <h3 className="modal-form-title">New Post</h3>
          <NewDocument 
            collection={Posts} 
            currentUser={context.currentUser}
            methodName="posts.new"
            successCallback={(post)=>{
              Messages.flash("Post created.", "success");
              Router.go('posts.single', post);
            }}
            labelFunction={Telescope.utils.camelToSpaces}
          />
        </div>
      </CanCreatePost>
    </ModalTrigger>
  )
}

NewPostButton.contextTypes = {
  currentUser: React.PropTypes.object
};

module.exports = NewPostButton;
export default NewPostButton;