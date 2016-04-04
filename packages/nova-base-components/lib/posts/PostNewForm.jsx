import React, { PropTypes, Component } from 'react';
import Router from '../router.js'

import Core from "meteor/nova:core";
const Messages = Core.Messages;
const FlashContainer = Core.FlashContainer;

import NovaForm from "meteor/nova:forms";

const PostNewForm = (props, context) => {

  ({CanCreatePost, FlashMessages} = Telescope.components);
  
  return (
    <CanCreatePost user={context.currentUser}>
      <div className="new-post-form">
        <h3 className="modal-form-title">New Post</h3>
        <FlashContainer component={FlashMessages}/>
        <NovaForm 
          collection={Posts} 
          currentUser={context.currentUser}
          methodName="posts.new"
          successCallback={(post)=>{
            Messages.flash("Post created.", "success");
            Router.go('posts.single', post);
          }}
          labelFunction={(fieldName)=>Telescope.utils.getFieldLabel(fieldName, Posts)}
        />
      </div>
    </CanCreatePost>
  )
}

PostNewForm.contextTypes = {
  currentUser: React.PropTypes.object
};

module.exports = PostNewForm;
export default PostNewForm;