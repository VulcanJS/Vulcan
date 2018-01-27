import {
  Components,
  registerComponent,
  getRawComponent,
  getFragment,
  withMessages,
  withList,
} from 'meteor/vulcan:core';
import { Posts } from '../../modules/posts/index.js';
import React from 'react';
import PropTypes from 'prop-types';
import { intlShape, FormattedMessage } from 'meteor/vulcan:i18n';
import { withRouter } from 'react-router'

const PostsNewForm = (props, context) => {
  if (props.loading) {
    return <div className="posts-new-form"><Components.Loading/></div>;
  }
  return (
    <Components.ShowIf
      check={Posts.options.mutations.new.check}
      failureComponent={
        <div>
          <p className="posts-new-form-message">
            <FormattedMessage id="posts.sign_up_or_log_in_first" />
          </p>
          <Components.AccountsLoginForm />
        </div>
      }
    >
      <div className="posts-new-form">
        <Components.SmartForm
          collection={Posts}
          mutationFragment={getFragment('PostsPage')}
          successCallback={post => {
            props.closeModal();
            props.router.push({pathname: props.redirect || Posts.getPageUrl(post)});
            props.flash(context.intl.formatMessage({id: "posts.created_message"}), "success");
          }}
        />
      </div>
    </Components.ShowIf>
  );
};

PostsNewForm.propTypes = {
  closeModal: PropTypes.func,
  router: PropTypes.object,
  flash: PropTypes.func,
  redirect: PropTypes.string,
}

PostsNewForm.contextTypes = {
  closeCallback: PropTypes.func,
  intl: intlShape
};

PostsNewForm.displayName = "PostsNewForm";

const options = {
  collectionName: 'Categories',
  queryName: 'categoriesListQuery',
  fragmentName: 'CategoriesList',
  limit: 0,
  pollInterval: 0,
};

registerComponent('PostsNewForm', PostsNewForm, withRouter, withMessages, [withList, options]);
