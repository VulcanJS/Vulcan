import React, { PropTypes, Component } from 'react';
import { intlShape } from 'react-intl';
import NovaForm from "meteor/nova:forms";
import { withRouter } from 'react-router'
import Posts from "meteor/nova:posts";

const PostsNewForm = (props, context) => {
  
  const router = props.router;

  return (
    <Telescope.components.CanCreatePost>
      <div className="posts-new-form">
        <NovaForm 
          collection={Posts} 
          currentUser={context.currentUser}
          methodName="posts.new"
          successCallback={(post)=>{
            context.messages.flash(context.intl.formatMessage({id: "posts.created_message"}), "success");
            router.push({pathname: Posts.getPageUrl(post)});
          }}
        />
      </div>
    </Telescope.components.CanCreatePost>
  )
}

PostsNewForm.contextTypes = {
  currentUser: React.PropTypes.object,
  messages: React.PropTypes.object,
  intl: intlShape
};

PostsNewForm.displayName = "PostsNewForm";

module.exports = withRouter(PostsNewForm);
export default withRouter(PostsNewForm);