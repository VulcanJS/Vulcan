import React, { PropTypes, Component } from 'react';
import { Button } from 'react-bootstrap';

const NewPostButton = (props, context) => {

  ({ModalTrigger, NewDocContainer, CanCreatePost} = Telescope.components);

  return (
    <ModalTrigger component={<Button bsStyle="primary">New Post</Button>}>
      <CanCreatePost user={context.currentUser}>
        <NewDocContainer 
          collection={Posts} 
          label="New Post" 
          methodName="posts.new" 
          successCallback={(post)=>{
            Messages.flash("Post created.", "success");
            Router.go('posts.single', post);
          }}
        />
      </CanCreatePost>
    </ModalTrigger>
  )
}

NewPostButton.contextTypes = {
  currentUser: React.PropTypes.object
};

module.exports = NewPostButton;
export default NewPostButton;