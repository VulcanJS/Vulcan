import React, { PropTypes, Component } from 'react';
import Router from '../router.js'

import { Messages } from "meteor/nova:core";

import NovaForm from "meteor/nova:forms";

const PostsNewForm = (props, context) => {

  return (
    <Telescope.components.CanCreatePost>
      <div className="posts-new-form">
        <NovaForm 
          collection={Posts} 
          currentUser={context.currentUser}
          methodName="posts.new"
          successCallback={(post)=>{
            Messages.flash("Post created.", "success");
            Router.go('posts.single', post);
          }}
        />
      </div>
    </Telescope.components.CanCreatePost>
  )
}

PostsNewForm.contextTypes = {
  currentUser: React.PropTypes.object
};

PostsNewForm.displayName = "PostsNewForm";

module.exports = PostsNewForm;
export default PostsNewForm;