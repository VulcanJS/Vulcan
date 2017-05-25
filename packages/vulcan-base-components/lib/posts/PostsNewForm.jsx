import { Components, registerComponent, getRawComponent, getFragment, withMessages } from 'meteor/vulcan:core';
import Posts from "meteor/vulcan:posts";
import React from 'react';
import PropTypes from 'prop-types';
import { intlShape, FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router'

const PostsNewForm = (props, context) => 
  <Components.ShowIf
      check={Posts.options.mutations.new.check}
      failureComponent={<div><p className="posts-new-form-message"><FormattedMessage id="posts.sign_up_or_log_in_first" /></p><Components.AccountsLoginForm /></div>}
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
  closeModal: PropTypes.func,
  router: PropTypes.object,
  flash: PropTypes.func,
}

PostsNewForm.contextTypes = {
  closeCallback: PropTypes.func,
  intl: intlShape
};

PostsNewForm.displayName = "PostsNewForm";

registerComponent('PostsNewForm', PostsNewForm, withRouter, withMessages);
