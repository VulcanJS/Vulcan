import React, { PropTypes, Component } from 'react';
import { intlShape } from 'react-intl';
import NovaForm from "meteor/nova:forms";
import { withRouter } from 'react-router'
import Posts from "meteor/nova:posts";

const PostsNewForm = (props, context) => {
  return (
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
  );
};

PostsNewForm.contextTypes = {
  currentUser: React.PropTypes.object,
  triggerMainRefetch: React.PropTypes.func,
  intl: intlShape
};

PostsNewForm.displayName = "PostsNewForm";

module.exports = PostsNewForm;
