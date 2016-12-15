import { Components, registerComponent, getRawComponent } from 'meteor/nova:lib';
import NovaForm from "meteor/nova:forms";
import { ShowIf, withMessages } from 'meteor/nova:core';
import Posts from "meteor/nova:posts";
import React, { PropTypes, Component } from 'react';
import { intlShape } from 'react-intl';
import { withRouter } from 'react-router'

const PostsNewForm = (props, context) => {
  return (
    <ShowIf
      check={Posts.options.mutations.new.check}
      failureComponent={<Components.UsersAccountForm />}
    >
      <div className="posts-new-form">
        <NovaForm
          collection={Posts}
          fragment={getRawComponent('PostsItem').fragment}
          successCallback={post => {
            // props.router.push({pathname: Posts.getPageUrl(post)});
            props.flash(context.intl.formatMessage({id: "posts.created_message"}), "success");
          }}
        />
      </div>
    </ShowIf>
  );
};

PostsNewForm.propTypes = {
  router: React.PropTypes.object,
  flash: React.PropTypes.func,
}

PostsNewForm.contextTypes = {
  closeCallback: React.PropTypes.func,
  intl: intlShape
};

PostsNewForm.displayName = "PostsNewForm";

registerComponent('PostsNewForm', PostsNewForm, withRouter, withMessages);