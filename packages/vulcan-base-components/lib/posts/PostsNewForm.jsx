import { Components, registerComponent, getRawComponent, getFragment, withMessages } from 'meteor/vulcan:core';
import Posts from "meteor/vulcan:posts";
import React, { PropTypes, Component } from 'react';
import { intlShape } from 'react-intl';
import { withRouter } from 'react-router'

const PostsNewForm = (props, context) => 
  <Components.ShowIf
      check={Posts.options.mutations.new.check}
      failureComponent={<Components.AccountsLoginForm />}
    >
      <div className="posts-new-form">
        <Components.SmartForm
          collection={Posts}
          mutationFragment={getFragment('PostsPage')}
          successCallback={post => {
            props.closeModal();
            props.router.push({pathname: Posts.getPageUrl(post)});
            props.flash(context.intl.formatMessage({id: "posts.created_message"}), "success");
          }}
        />
      </div>
    </Components.ShowIf>

PostsNewForm.propTypes = {
  closeModal: React.PropTypes.func,
  router: React.PropTypes.object,
  flash: React.PropTypes.func,
}

PostsNewForm.contextTypes = {
  closeCallback: React.PropTypes.func,
  intl: intlShape
};

PostsNewForm.displayName = "PostsNewForm";

registerComponent('PostsNewForm', PostsNewForm, withRouter, withMessages);
