import React, { PropTypes, Component } from 'react';
import { intlShape } from 'react-intl';
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
            Messages.flash(context.intl.formatMessage({id: "posts.created_message"}), "success");
            Router.go('posts.single', post);
          }}
        />
      </div>
    </Telescope.components.CanCreatePost>
  )
}

PostsNewForm.contextTypes = {
  currentUser: React.PropTypes.object,
  intl: intlShape
};

PostsNewForm.displayName = "PostsNewForm";

module.exports = PostsNewForm;
export default PostsNewForm;