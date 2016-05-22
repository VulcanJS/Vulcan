import React, { PropTypes, Component } from 'react';
import Router from '../router.js'

import { Messages } from "meteor/nova:core";

import NovaForm from "meteor/nova:forms";

const PostsNewForm = (props, context) => {

  ({CanCreatePost, FlashMessages} = Telescope.components);

  return (
    <CanCreatePost>
      <div className="posts-new-form">
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

PostsNewForm.contextTypes = {
  currentUser: React.PropTypes.object
};

module.exports = PostsNewForm;
export default PostsNewForm;