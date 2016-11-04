import React, { PropTypes, Component } from 'react';
import { intlShape } from 'react-intl';
import NovaForm from "meteor/nova:forms";
import { withRouter } from 'react-router'
import Posts from "meteor/nova:posts";

const PostsNewForm = (props, context) => {
  return (
    <Telescope.components.CanDo
      action="posts.new"
      noPermissionMessage="users.cannot_post"
      displayNoPermissionMessage={true}
    >
      <div className="posts-new-form">
        <NovaForm
          collection={Posts}
          novaFormMutation={props.novaFormMutation}
          successCallback={post => {
            props.router.push({pathname: Posts.getPageUrl(post)});
            props.flash(context.intl.formatMessage({id: "posts.created_message"}), "success");
          }}
        />
      </div>
    </Telescope.components.CanDo>
  );
};

PostsNewForm.contextTypes = {
  currentUser: React.PropTypes.object,
  triggerMainRefetch: React.PropTypes.func,
  intl: intlShape
};

PostsNewForm.displayName = "PostsNewForm";

module.exports = PostsNewForm;
